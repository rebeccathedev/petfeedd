<template>
  <div>
    <p><strong>Note:</strong> Changes made to settings on this page will require
    a restart of petfeedd.</p>
    <div class="row">
      <div class="col-sm-9 mt-2 mb-4">
        <label for="bearer_token" class="form-label">Bind Address</label>
        <input type="text" class="form-control" id="address" v-model="web.address">
      </div>
      <div class="col-sm-3 mt-2 mb-4">
        <label for="bearer_token" class="form-label">Bind Port</label>
        <input type="number" class="form-control" id="port" v-model="web.port">
      </div>
    </div>
  </div>
</template>

<script>
import SettingTransformer from "../Mixins/SettingTransformer";

export default {
  mixins: [SettingTransformer],

  methods: {
    save() {
      this.saveSettings();
    }
  },

  data() {
    return {
      web: {
        address: '',
        port: 8080
      }
    }
  },

  mounted() {
    this.$parent.$on("config.save", this.save);
    this.loadSettings(["web"]);
  },

  beforeDestroy() {
    this.$parent.$off("config.save", this.save);
  }
}
</script>

<style>

</style>
