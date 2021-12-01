const eventBus = require("../event-bus");
const REST = require("./REST");

class MQTT extends REST {
  model = "MQTT";

  async create(request, response) {
    response = await super.create(request, response);
    eventBus.emit("mqtt.reload");
    return response;
  }

  async update(request, response) {
    response = await super.update(request, response);
    eventBus.emit("mqtt.reload");
    return response;
  }

  async delete(request, response) {
    response = await super.delete(request, response);
    eventBus.emit("mqtt.reload");
    return response;
  }
}

module.exports = MQTT;
