module.exports = {
  scripts: {
    "CreateServo": require("./CreateServo"),
  },

  run(config, database) {
    for (const i in this.scripts) {
      if (this.scripts.hasOwnProperty(i)) {
        var s = new this.scripts[i](config, database);
        s.migrate();
      }
    }
  }
}
