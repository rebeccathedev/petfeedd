const bus = require("../event-bus");

class REST {
  model = "";
  primaryKey = "id";
  namespace = "";

  constructor(database) {
    this.database = database;

    if (!this.namespace) {
      this.namespace = this.constructor.name.toLowerCase();
    }
  }

  getAdditionalRoutes() {
    return [];
  }

  async index(request, response) {
    let Model = this.database.modelFactory(this.model);
    let query = {};

    if (request.query) {
      if (request.query.sort && request.query.sort_direction) {
        query.order = [
          [request.query.sort, request.query.sort_direction]
        ];

        delete request.query.sort;
        delete request.query.sort_direction;
      }

      if (request.query.limit) {
        query.limit = request.query.limit;
        delete request.query.limit;
      }

      if (request.query.offset) {
        query.offset = request.query.offset;
        delete request.query.offset;
      }

      if (request.query) {
        query.where = request.query;
      }
    }

    const data = await Model.findAll(query);
    return response.send(data);
  }

  async get(request, response) {
    let Model = this.database.modelFactory(this.model);
    var data = await Model.findByPk(request.params[this.primaryKey]);

    if (!data) {
      return response.status(404).send();
    }

    return response.send(data);
  }

  async create(request, response) {
    let Model = this.database.modelFactory(this.model);
    let data = await Model.create(request.body);
    bus.emit(this.namespace + ".reload");
    return response.send(data);
  }

  async update(request, response) {
    let Model = this.database.modelFactory(this.model);
    var data = await Model.findByPk(request.params[this.primaryKey]);

    if (!data) {
      return response.status(404).send();
    }

    for (const key in request.body) {
      if (Object.hasOwnProperty.call(request.body, key)) {
        const value = request.body[key];
        data[key] = value;
      }
    }

    data.save();

    bus.emit(this.namespace + ".reload");

    return response.send(data);
  }

  async bulkUpdate(request, response) {
    let Model = this.database.modelFactory(this.model);

    let ret = [];

    if (Array.isArray(request.body)) {
      for (const obj of request.body) {
        if (obj[this.primaryKey]) {
          var data = await Model.findByPk(obj[this.primaryKey]);

          for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
              const value = obj[key];
              data[key] = value;
            }
          }

          data.save();
          ret.push(data);
        } else {
          let data = await Model.create(obj);
          ret.push(data);
        }
      }
    }

    bus.emit(this.namespace + ".reload");

    return response.send(data);
  }

  async delete(request, response) {
    let Model = this.database.modelFactory(this.model);
    var data = await Model.findByPk(request.params[this.primaryKey]);

    if (!data) {
      return response.status(404).send();
    }

    data.destroy();
    bus.emit(this.namespace + ".reload");
    return response.send(data);
  }
}

module.exports = REST;
