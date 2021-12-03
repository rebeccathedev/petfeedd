const REST = require("./REST");
const bus = require("../event-bus")

class Settings extends REST {
  model = "Setting";

  async bulkUpdate(request, response) {
    response = super.bulkUpdate(request, response);

    if (Array.isArray(request.body)) {
      let namespaces = [...new Set(
        request.body.map(obj => obj.namespace)
      )];

      namespaces.forEach(ns => {
        bus.emit(ns + ".reload");
      });
    }

    return response;
  }
}

module.exports = Settings;
