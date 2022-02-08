module.exports = {
  general: {
    name: { type: "string", value: "petfeed" },
    paused: { type: "bool", value: 0 },
  },
  mqtt: {
    enable: { type: "bool", value: 1 },
    server: { type: "string", value: "" },
    broadcast_event: { type: "string", value: "" },
  },
  twitter: {
    enable: { type: "bool", value: 0 },
    consumer_key: { type: "string", value: "" },
    consumer_secret: { type: "string", value: "" },
    access_token_key: { type: "string", value: "" },
    access_token_secret: { type: "string", value: "" },
    message_format: { type: "string", value: "{feeder_name} dispensed {feed_event.size} feeds at {feed_event.date_created}" },
  },
  email: {
    enable: { type: "bool", value: 0 },
    secure: { type: "bool", value: 1 },
    from: { type: "string", value: "" },
    from_address: { type: "string", value: "" },
    subject: { type: "string", value: "" },
    to: { type: "string", value: "" },
    server: { type: "string", value: "" },
    port: { type: "number", value: 25 },
    username: { type: "string", value: "" },
    password: { type: "string", value: "" },
  },
  web: {
    port: { type: "number", value: 8080 },
    address: { type: "string", value: "0.0.0.0" },
  }
}
