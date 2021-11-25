const REST = require("./REST");
const mqtt = require("../mqtt");

class MQTT extends REST {
  model = "MQTT";

  async create(request, response) {
    response = await super.create(request, response);
    mqtt.reconfigure();
    return response;
  }

  async update(request, response) {
    response = await super.update(request, response);
    mqtt.reconfigure();
    return response;
  }

  async delete(request, response) {
    response = await super.delete(request, response);
    mqtt.reconfigure();
    return response;
  }
}

module.exports = MQTT;
