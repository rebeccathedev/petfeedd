const test = require("node:test");
const assert = require("node:assert/strict");
const { requireWithMocks } = require("./helpers");

test("servo drives raw and PWM GPIO modes correctly", () => {
  class Model { static init() {} }
  const Servo = requireWithMocks("../src/Models/Servo", {
    sequelize: { Sequelize: { STRING: 1, INTEGER: 2, DOUBLE: 3 }, Model },
    "../sequelize": {},
  });
  const calls = [];
  const gpio = { digitalWrite: value => calls.push(["digital", value]), servoWrite: value => calls.push(["servo", value]) };
  const servo = new Servo();
  servo.type = "raw";
  servo.startSpin(gpio); servo.stopSpin(gpio);
  servo.type = "pwm";
  servo.startSpin(gpio); servo.stopSpin(gpio);
  assert.deepEqual(calls, [["digital", true], ["digital", false], ["servo", 2500], ["servo", 0]]);
});

test("library reload shuts down before starting again", async () => {
  const Library = require("../src/Core/Library");
  const calls = [];
  class Subject extends Library { async shutdown() { calls.push("shutdown"); } async run() { calls.push("run"); } }
  await new Subject().reload();
  assert.deepEqual(calls, ["shutdown", "run"]);
});

test("scheduler creates, executes, and cancels jobs", async () => {
  const emitted = [];
  const jobs = [];
  class Rule {}
  const schedule = {
    RecurrenceRule: Rule,
    scheduleJob(rule, callback) { const job = { rule, callback, nextInvocation: () => "tomorrow" }; jobs.push(job); return job; },
    cancelJob(job) { job.cancelled = true; },
  };
  const database = { modelFactory: name => name === "Feed" ? { findAll: async () => [{ time: "07:30", name: "breakfast" }] } : { findByPk: async () => ({ pin: 12, feed_time: 1.5 }) } };
  const scheduler = requireWithMocks("../src/Core/Scheduler", {
    "node-schedule": schedule, moment: {}, "../event-bus": { emit: (...args) => emitted.push(args) }, "../database": database,
  });
  scheduler.database = database;
  await scheduler.run();
  assert.equal(jobs[0].rule.hour, "07");
  assert.equal(jobs[0].rule.minute, "30");
  await scheduler.feed({ servo_id: 1, size: 2, name: "breakfast" }, jobs[0]);
  assert.deepEqual(emitted[0], ["feed", { pin: 12, time: 1.5, size: 2, name: "breakfast" }]);
  await scheduler.shutdown();
  assert.equal(jobs[0].cancelled, true);
});
