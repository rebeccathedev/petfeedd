<template>
  <div>
    <div class="row">
      <div class="form-group col">
        <label for="general.name">Name</label>
        <input class="form-control" type="input" name="general.name" v-model="general.name">
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="form-check my-2">
          <input class="form-check-input" type="checkbox" value="1" id="bonjour.enable" v-model="bonjour.enable">
          <label class="form-check-label" for="bonjour.enable">
            Enable Zeroconf/Bonjour Service Discovery
          </label>
        </div>
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
      bonjour: {},
      general: {}
    }
  },

  mounted() {
    this.$parent.$on("config.save", this.save);
    this.loadSettings(["bonjour", "general"]);
  },

  beforeDestroy() {
    this.$parent.$off("config.save", this.save);
  }
}
</script>

<style>

</style>
