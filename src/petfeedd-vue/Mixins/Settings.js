const { boolean } = require('boolean');

module.exports = {
  methods: {
    loadSettings(namespaces, bare = false) {
      if (!Array.isArray(namespaces)) {
        namespaces = [namespaces];
      }

      this._rawSettings = [];
      this._rawSettingsWithNamespaces = {};
      this._loadedBare = bare;
      this._settingsNamespaces = namespaces;

      for (const namespace of namespaces) {
        this._rawSettingsWithNamespaces[namespace] = [];

        this.$http({
          url: "/api/settings",
          method: "GET",
          params: {
            namespace: namespace
          }
        }).then(response => {
          response.data.forEach(setting => {
            switch (setting.type) {
              case "bool":
                setting.value = boolean(setting.value);
                break;

              case "number":
              case "int":
                setting.value = parseInt(setting.value);
                break;

              default:
                break;
            }

            if (bare) {
              this[setting.key] = setting.value;
              this._rawSettings.push(setting);
            } else {
              this.$set(this[namespace], setting.key, setting.value);
              this._rawSettingsWithNamespaces[namespace].push(setting);
            }
          });
        });
      }
    },

    saveSettings() {
      var sendSettings = [];

      if (this._loadedBare) {
        for (const setting of this._rawSettings) {
          if (this[setting.key]) {
            setting.value = this[setting.key].toString();
            sendSettings.push(setting);
          }
        }
      } else {
        for (const namespace of this._settingsNamespaces) {
          for (const setting of this._rawSettingsWithNamespaces[namespace]) {
            if (this[namespace][setting.key]) {
              setting.value = this[namespace][setting.key].toString();
              sendSettings.push(setting);
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
