const database = require("../database");
const Library = require("./Library");
const config = require("../config");
const nodemailer = require("nodemailer");
const bus = require("../event-bus");
const fs = require("fs");
const mjml2html = require("mjml");
const path = require("path");
const Handlebars = require("handlebars");

class Email extends Library {
  constructor(database) {
    super();
    this.database = database;
  }

  async run() {
    this.logger.info("Starting up.");

    this.config = await config.getConfigEntries("email");

    if (this.config.enable) {
      this.feedCompleteCall = async (feedEvent) => {
        this.sendEmail(feedEvent);
      };

      bus.on("feed.completed", this.feedCompleteCall);
      bus.on("email.test", this.feedCompleteCall);
    }
  }

  async sendEmail(feedEvent) {
    let mjmlSource = fs.readFileSync(
      path.join(__dirname, "../Emails/Feed.mjml"),
      "utf8"
    );
    let htmlOutput = mjml2html(mjmlSource);
    let template = Handlebars.compile(htmlOutput.html);

    let transporter = nodemailer.createTransport({
      host: this.config.server,
      port: this.config.port || 25,
      secure: this.config.secure,
      auth: {
        user: this.config.username,
        pass: this.config.password,
      },
    });

    this.logger.info("Sending email to: " + this.config.to);

    let info = await transporter.sendMail({
      from: {
        name: this.config.from,
        address: this.config.from_address,
      },
      to: this.config.to,
      subject: this.config.subject,
      html: template(
        { feedEvent: feedEvent },
        {
          allowProtoMethodsByDefault: true,
          allowProtoPropertiesByDefault: true
        }
      ),
    });

    this.logger.info("Message sent: %s", info.messageId);
  }

  async reload() {
    this.logger.info("Reloading");
    this.shutdown();
    this.run();
  }

  async shutdown() {
    this.logger.info("Shutting down.");
    if (this.feedCompleteCall) {
      bus.removeListener("feed.completed", this.feedCompleteCall);
      bus.removeListener("email.test", this.feedCompleteCall);
    }
  }
}

module.exports = new Email(database);
