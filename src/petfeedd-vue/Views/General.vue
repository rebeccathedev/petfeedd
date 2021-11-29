<template>
  <div>
    <h2>General Settings</h2>
    <div class="row">
      <div class="form-group col">
        <label for="general.name">Name</label>
        <input class="form-control" type="input" name="general.name" value="1" step="1" >
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="form-check my-2">
          <input class="form-check-input" type="checkbox" value="1" id="mqtt.enable" v-model="setting.zeroconf.enable.value">
          <label class="form-check-label" for="mqtt.enable">
            Enable Zeroconf/Bonjour Service Discovery
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      setting: {
        zeroconf: {
          enable: {}
        }
      }
    }
  }
}
</script>

<style>

</style>
