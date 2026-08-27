const test = require("node:test");
const assert = require("node:assert/strict");
const { responseSpy } = require("./helpers");
const REST = require("../src/Controllers/REST");
const Util = require("../src/Controllers/Util");
const bus = require("../src/event-bus");

function setup(items = []) {
  const events = [];
  const model = {
    findAll: async query => { model.query = query; return items; },
    findByPk: async id => items.find(item => item.id == id),
    create: async data => ({ id: 99, ...data }),
  };
  const database = { modelFactory: () => model };
  class Controller extends REST { model = "Thing"; }
  const controller = new Controller(database);
  const listener = value => events.push(value);
  bus.on("controller.reload", listener);
  return { controller, model, events, cleanup: () => bus.removeListener("controller.reload", listener) };
}

test("REST index translates paging and sorting query parameters", async () => {
  const ctx = setup([{ id: 1 }]);
  const req = { query: { sort: "name", sort_direction: "DESC", limit: "5", offset: "2", active: "1" } };
  const res = responseSpy();
  await ctx.controller.index(req, res);
  assert.deepEqual(ctx.model.query, { order: [["name", "DESC"]], limit: "5", offset: "2", where: { active: "1" } });
  assert.deepEqual(res.body, [{ id: 1 }]);
  ctx.cleanup();
});

test("REST get returns an item or 404", async () => {
  const ctx = setup([{ id: 1 }]);
  const found = responseSpy();
  await ctx.controller.get({ params: { id: 1 } }, found);
  assert.equal(found.body.id, 1);
  const missing = responseSpy();
  await ctx.controller.get({ params: { id: 2 } }, missing);
  assert.equal(missing.statusCode, 404);
  ctx.cleanup();
});

test("REST create emits reload and returns the created item", async () => {
  const ctx = setup();
  const res = responseSpy();
  await ctx.controller.create({ body: { name: "dinner" } }, res);
  assert.deepEqual(res.body, { id: 99, name: "dinner" });
  assert.equal(ctx.events.length, 1);
  ctx.cleanup();
});

test("REST update persists fields and handles missing items", async () => {
  let saved = false;
  const item = { id: 1, name: "old", save: async () => { saved = true; } };
  const ctx = setup([item]);
  const res = responseSpy();
  await ctx.controller.update({ params: { id: 1 }, body: { name: "new" } }, res);
  assert.equal(item.name, "new");
  assert.equal(saved, true);
  const missing = responseSpy();
  await ctx.controller.update({ params: { id: 2 }, body: {} }, missing);
  assert.equal(missing.statusCode, 404);
  ctx.cleanup();
});

test("REST bulkUpdate updates and creates items and returns all results", async () => {
  const item = { id: 1, save: async () => {} };
  const ctx = setup([item]);
  const res = responseSpy();
  await ctx.controller.bulkUpdate({ body: [{ id: 1, name: "updated" }, { name: "created" }] }, res);
  assert.equal(res.body.length, 2);
  assert.equal(res.body[0].name, "updated");
  assert.equal(res.body[1].name, "created");
  ctx.cleanup();
});

test("REST delete destroys an item and handles missing items", async () => {
  let destroyed = false;
  const item = { id: 1, destroy: async () => { destroyed = true; } };
  const ctx = setup([item]);
  await ctx.controller.delete({ params: { id: 1 } }, responseSpy());
  assert.equal(destroyed, true);
  const missing = responseSpy();
  await ctx.controller.delete({ params: { id: 2 } }, missing);
  assert.equal(missing.statusCode, 404);
  ctx.cleanup();
});

test("utility endpoints emit their corresponding lifecycle events", () => {
  const util = new Util();
  const observed = [];
  const names = ["email.test", "reload", "shutdown", "mqtt.reload"];
  const listeners = names.map(name => { const fn = () => observed.push(name); bus.on(name, fn); return [name, fn]; });
  util.testEmail({}, responseSpy());
  util.reload({}, responseSpy());
  util.shutdown({}, responseSpy());
  util.reloadCore({ params: { type: "mqtt" } }, responseSpy());
  assert.deepEqual(observed, names);
  listeners.forEach(([name, fn]) => bus.removeListener(name, fn));
});
