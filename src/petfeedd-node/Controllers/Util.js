const bus = require("../event-bus");

class Util {
  async testEmail(request, response) {
    bus.emit("email.test", {
      size: "Test Email",
      date_created: new Date()
    });
    return response.status(200).send();
  }

  reload(request, response) {
    bus.emit("reload");
    return response.status(200).send();
  }

  shutdown(request, response) {
    bus.emit("shutdown");
    return response.status(200).send();
  }

  reloadCore(request, response) {
    let type = request.params.type;
    bus.emit(type + ".reload");
    return response.status(200).send();
  }
}

module.exports = Util;
