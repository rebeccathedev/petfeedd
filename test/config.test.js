const test = require("node:test");
const assert = require("node:assert/strict");
const config = require("../src/config");

test("configuration entries are converted to declared types", async () => {
  config.initalizeDatabaseConfig({ modelFactory: () => ({ findAll: async () => [
    { key: "enabled", value: "true", type: "bool" },
    { key: "port", value: "8080", type: "number" },
    { key: "name", value: "Mochi", type: "string" },
  ] }) });
  assert.deepEqual(await config.getConfigEntries("test"), { enabled: true, port: 8080, name: "Mochi" });
});

test("single configuration entry prefers database and falls back to defaults", async () => {
  config.initalizeDatabaseConfig({ modelFactory: () => ({ findOne: async ({ where }) => where.key === "stored" ? { value: "yes" } : null }) });
  assert.equal(await config.getConfigEntry("general", "stored"), "yes");
  assert.equal(await config.getConfigEntry("general", "database"), "petfeedd.db");
  assert.equal(await config.getConfigEntry("missing", "key"), undefined);
});
