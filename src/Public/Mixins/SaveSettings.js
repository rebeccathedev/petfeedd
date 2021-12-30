module.exports = {
  methods: {
    saveSettings(inputSettings) {
      let sendSettings = [];

      for (const namespace in inputSettings) {
        if (Object.hasOwnProperty.call(inputSettings, namespace)) {
          const settings = inputSettings[namespace];

          for (const i in settings) {
            if (Object.hasOwnProperty.call(settings, i)) {
              const setting = settings[i];

              if (setting.value) {
                var sendSetting = Object.assign({}, setting);
                sendSetting.value = sendSetting.value.toString();
                sendSettings.push(sendSetting);
              }
            }
          }
        }
      }

      this.$http({
        url: "/api/settings",
        method: "PUT",
        data: sendSettings
      });
    }
  }
}
