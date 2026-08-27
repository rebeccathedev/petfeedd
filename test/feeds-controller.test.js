const test = require("node:test");
const assert = require("node:assert/strict");
const { requireWithMocks, responseSpy } = require("./helpers");

function subject({ feed, servo, result }) {
  class REST {
    constructor(database) { this.database = database; this.primaryKey = "id"; }
    getAdditionalRoutes() { return []; }
  }
  const calls = [];
  const Feeds = requireWithMocks("../src/Controllers/Feeds", {
    "./REST": REST,
    "../event-bus": { emit() {} },
    "../Core/Feeder": { feed: async data => { calls.push(data); return result; } },
  });
  const database = {
    modelFactory: name => name === "Feed"
      ? { findByPk: async () => feed }
      : { findByPk: async () => servo },
  };
  return { controller: new Feeds(database), calls };
}

test("feed now validates the feed and servo", async () => {
  let ctx = subject({ feed: null });
  let response = responseSpy();
  await ctx.controller.feed({ params: { id: 1 } }, response);
  assert.equal(response.statusCode, 404);

  ctx = subject({ feed: { servo_id: 3 }, servo: null });
  response = responseSpy();
  await ctx.controller.feed({ params: { id: 1 } }, response);
  assert.equal(response.statusCode, 422);
});

test("feed now awaits hardware completion and returns the feed event", async () => {
  const event = { id: 9, name: "Breakfast (On Demand)" };
  const ctx = subject({
    feed: { id: 1, servo_id: 3, size: 2 },
    servo: { pin: 27, feed_time: 0.5 },
    result: { successful: true, feedEvent: event },
  });
  const response = responseSpy();
  await ctx.controller.feed({ params: { id: 1 } }, response);
  assert.deepEqual(ctx.calls[0], {
    pin: 27, time: 0.5, size: 2, feed: { id: 1, servo_id: 3, size: 2 }, onDemand: true,
  });
  assert.deepEqual(response.body, event);
});

test("feed now reports paused and GPIO failures", async () => {
  const base = { feed: { servo_id: 3, size: 1 }, servo: { pin: 27, feed_time: 1 } };
  let ctx = subject({ ...base, result: { successful: false, reason: "paused", feedEvent: null } });
  let response = responseSpy();
  await ctx.controller.feed({ params: { id: 1 } }, response);
  assert.equal(response.statusCode, 409);

  ctx = subject({ ...base, result: { successful: false, feedEvent: { id: 10 } } });
  response = responseSpy();
  await ctx.controller.feed({ params: { id: 1 } }, response);
  assert.equal(response.statusCode, 503);
  assert.equal(response.body.event.id, 10);
});
