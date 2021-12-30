<template>
  <div>
    <div class="row">
      <div class="col">
        <div class="form-check my-2">
          <input class="form-check-input" type="checkbox" value="1" id="enable" v-model="enable">
          <label class="form-check-label" for="enable">
            Enable Twitter Notifications
          </label>
        </div>
      </div>
    </div>

    <div v-if="enable">
      <div class="row">
        <div class="col mt-2 mb-4">
          <label for="bearer_token" class="form-label">Consumer Key</label>
          <input type="text" class="form-control" id="consumer_key" v-model="consumer_key">
        </div>
      </div>

      <div class="row">
        <div class="col mt-2 mb-4">
          <label for="consumer_secret" class="form-label">Consumer Secret</label>
          <input type="text" class="form-control" id="consumer_secret" v-model="consumer_secret">
        </div>
      </div>

      <div class="row">
        <div class="col mt-2 mb-4">
          <label for="access_token_key" class="form-label">Access Token Key</label>
          <input type="text" class="form-control" id="access_token_key" v-model="access_token_key">
        </div>
      </div>

      <div class="row">
        <div class="col mt-2 mb-4">
          <label for="access_token_secret" class="form-label">Access Token Secret</label>
          <input type="text" class="form-control" id="access_token_secret" v-model="access_token_secret">
        </div>
      </div>

      <div class="row">
        <div class="col mt-2 mb-4">
          <label for="message_format" class="form-label">Message Format</label>
          <input type="text" class="form-control" id="message_format" v-model="message_format">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    save() {
      this.saveSettings();
    }
  },

  data() {
    return {
      enable: false
    }
  },

  mounted() {
    this.$parent.$on("config.save", this.save);
    this.loadSettings("twitter", true);
  },

  beforeDestroy() {
    this.$parent.$off("config.save", this.save);
  }
}
</script>

<style>

</style>
