<template>
  <div>
    <div class="row">
      <div class="col">
        <div class="form-check my-2">
          <input class="form-check-input" type="checkbox" value="1" id="setting.twitter.enable" v-model="setting.twitter.enable.value">
          <label class="form-check-label" for="setting.twitter.enable">
            Enable Twitter Notifications
          </label>
        </div>
      </div>
    </div>

    <div v-if="setting.twitter.enable.value">
      <div class="row">
        <div class="col mt-2 mb-4">
          <label for="setting.twitter.bearer_token" class="form-label">Consumer Key</label>
          <input type="text" class="form-control" id="setting.twitter.consumer_key" v-model="setting.twitter.consumer_key.value">
        </div>
      </div>

      <div class="row">
        <div class="col mt-2 mb-4">
          <label for="setting.twitter.consumer_secret" class="form-label">Consumer Secret</label>
          <input type="text" class="form-control" id="setting.twitter.consumer_secret" v-model="setting.twitter.consumer_secret.value">
        </div>
      </div>

      <div class="row">
        <div class="col mt-2 mb-4">
          <label for="setting.twitter.access_token_key" class="form-label">Access Token Key</label>
          <input type="text" class="form-control" id="setting.twitter.access_token_key" v-model="setting.twitter.access_token_key.value">
        </div>
      </div>

      <div class="row">
        <div class="col mt-2 mb-4">
          <label for="setting.twitter.access_token_secret" class="form-label">Access Token Secret</label>
          <input type="text" class="form-control" id="setting.twitter.access_token_secret" v-model="setting.twitter.access_token_secret.value">
        </div>
      </div>

      <div class="row">
        <div class="col mt-2 mb-4">
          <label for="setting.twitter.message_format" class="form-label">Message Format</label>
          <input type="text" class="form-control" id="setting.twitter.message_format" v-model="setting.twitter.message_format.value">
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="form-check my-2">
          <input class="form-check-input" type="checkbox" value="1" id="setting.slack.enable" v-model="setting.slack.enable.value">
          <label class="form-check-label" for="setting.slack.enable">
            Enable Slack Notifications
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SettingTransformer from "../Mixins/SettingTransformer";
import SaveSettings from "../Mixins/SaveSettings";

export default {
  mixins: [SettingTransformer, SaveSettings],

  methods: {
    save() {
      this.saveSettings(this.setting);
    }
  },

  data() {
    return {
      setting: {
        twitter: {
          enable: {},
          consumer_key: {},
          consumer_secret: {},
          access_token_key: {},
          access_token_secret: {},
          message_format: {}
        },
        slack: {
          enable: {}
        }
      }
    }
  },

  mounted() {
    this.$parent.$on("config.save", this.save);

    ["twitter"].forEach(ns => {
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
