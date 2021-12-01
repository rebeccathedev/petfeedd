<template>
  <div>
    <h2>General Settings</h2>
    <div class="row">
      <div class="form-group col">
        <label for="general.name">Name</label>
        <input class="form-control" type="input" name="general.name" v-model="setting.general.name.value">
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="form-check my-2">
          <input class="form-check-input" type="checkbox" value="1" id="mqtt.enable" v-model="setting.bonjour.enable.value">
          <label class="form-check-label" for="mqtt.enable">
            Enable Zeroconf/Bonjour Service Discovery
          </label>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <button class="btn btn-success" @click="save()">Save</button>
    </div>
  </div>
</template>

<script>
import SettingTransformer from "../Mixins/SettingTransformer";

export default {
  mixins: [SettingTransformer],

  methods: {
    save() {
      for (const ns in this.setting) {
        for (const setting_name in this.setting[ns]) {
          var setting = this.setting[ns][setting_name];
          this.$http({
            url: "/api/settings/" + setting.id,
            method: "PUT",
            data: setting
          });
        }
      }
    }
  },

  data() {
    return {
      setting: {
        bonjour: {
          enable: {}
        },
        general: {
          name: {}
        }
      }
    }
  },

  mounted() {

    ["general", "bonjour"].forEach(ns => {
      this.$http({
        url: "/api/settings",
        method: "GET",
        params: {
          namespace: ns
        }
      }).then(response => {
        response.data.forEach(setting => {
          this.transformSettings(setting);
          this.$set(this.setting[ns], setting.key, setting);
        });
      });
    });
  }
}
</script>

<style>

</style>
