const { boolean } = require('boolean');

module.exports = {
  methods: {
    transformSettings(setting) {
      switch (setting.type) {
        case "bool":
          setting.value = boolean(setting.value);
          break;

        case "number":
          setting.value = parseInt(setting.value);

        default:
          break;
      }
    },

    prepareSettings(setting) {
      setting.value = setting.value.toString();
    }
  }
}
