const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const database = require("../database");
const fileUpload = require('express-fileupload');
const bus = require("../event-bus");

const MQTT = require("../Controllers/MQTT");
const Settings = require("../Controllers/Settings");
const Servos = require("../Controllers/Servos");
const Feeds = require("../Controllers/Feeds");
const FeedEvents = require("../Controllers/FeedEvents");
const Buttons = require("../Controllers/Buttons");
const Sounds = require("../Controllers/Sounds");
const Util = require("../Controllers/Util");

const Library = require("./Library");

class Web extends Library {
  constructor(database) {
    super();
    this.database = database;
    this.app = express();

    this.app.use(fileUpload({
      createParentPath: true
    }));

    this.app.use(bodyParser.json());

    this.app.use(function(err, req, res, next) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      res.status(err.statusCode).json({
        status: false,
        error: err.message
      });
    });

    // This is the main / route that serves the Vue app.
    this.app.use('/', express.static(path.join(__dirname, '../public')));

    // Create a router for our API.
    var apiRouter = express.Router();
    this.app.use('/api', apiRouter);

    // Build the controllers for each type.
    this.buildCrud(apiRouter, "events", new FeedEvents(database));
    this.buildCrud(apiRouter, "feeds", new Feeds(database));
    this.buildCrud(apiRouter, "servos", new Servos(database));
    this.buildCrud(apiRouter, "mqtt", new MQTT(database));
    this.buildCrud(apiRouter, "settings", new Settings(database));
    this.buildCrud(apiRouter, "buttons", new Buttons(database));
    this.buildCrud(apiRouter, "sounds", new Sounds(database));

    // Build the util routes
    let util = new Util(database);
    apiRouter.get("/util/emailtest", this.wrapper(util, "testEmail"));
    apiRouter.get("/util/reload", this.wrapper(util, "reload"));
    apiRouter.get("/util/reload/:type", this.wrapper(util, "reloadCore"));
    apiRouter.get("/util/shutdown", this.wrapper(util, "shutdown"));
  }

  buildCrud(apiRouter, path, controller) {
    apiRouter.get("/" + path, this.wrapper(controller, "index"));
    apiRouter.post("/" + path, this.wrapper(controller, "create"));
    apiRouter.put("/" + path, this.wrapper(controller, "bulkUpdate"));
    apiRouter.get("/" + path + "/:" + controller.primaryKey,
      this.wrapper(controller, "get")
    );
    apiRouter.put("/" + path + "/:" + controller.primaryKey,
      this.wrapper(controller, "update")
    );
    apiRouter.delete("/" + path + "/:" + controller.primaryKey,
      this.wrapper(controller, "delete")
    );

    controller.getAdditionalRoutes().forEach(route => {
      apiRouter[route.method]("/" + path + route.path, this.wrapper(controller, route.callback));
    });
  }

  async run() {
    this.logger.info("Starting up.");
    this.server = this.app.listen(8080, () => {
      this.logger.info(`petfeedd listening at http://localhost:8080`);
    });
  }

  wrapper(controller, method) {
    return async (request, response, next) => {
      try {
        await controller[method](request, response);
      } catch (e) {

        next(e)
      }
    }
  }

  async shutdown() {
    this.logger.info("Shutting down.");
    await this.server.close();
  }
}

module.exports = new Web(database);
