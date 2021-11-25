class REST {
  model = "";
  primaryKey = "id";

  constructor(database) {
    this.database = database;
  }

  getAdditionalRoutes() {
    return [];
  }

  async index(request, response) {
    let Model = this.database.modelFactory(this.model);
    let query = {};
    if (request.query) {
      query.where = request.query;
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

    return response.send(data);
  }

  async delete(request, response) {
    let Model = this.database.modelFactory(this.model);
    var data = await Model.findByPk(request.params[this.primaryKey]);

    if (!data) {
      return response.status(404).send();
    }

    data.destroy();
    return response.send(data);
  }
}

module.exports = REST;
