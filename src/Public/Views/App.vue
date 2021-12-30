<template>
  <div>
    <nav class="navbar navbar-expand-md navbar-light bg-light mb-4">
      <div class="container">
        <router-link :to="{name: 'home'}" class="navbar-brand">petfeedd</router-link>
        <button class="btn btn-secondary order-md-4" v-if="!setting.general.paused.value" @click="toggle(setting.general.paused)">
          Pause
        </button>
        <button class="btn btn-success order-md-4" v-if="setting.general.paused.value" @click="toggle(setting.general.paused)">
          Start
        </button>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          ref="appNavCollapseButton"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent" ref="appNavCollapse">
          <ul class="navbar-nav me-auto mb-2 mb-md-0">
            <li class="nav-item">
              <router-link :to="{name: 'home'}" class="nav-link" aria-current="page">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{name: 'config'}" class="nav-link" aria-current="page">Configuration</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import SettingTransformer from "../Mixins/SettingTransformer";

export default {
  mixins: [SettingTransformer],

  methods: {
    toggle(setting) {
      setting.value = !setting.value;

      this.$http({
        url: "/api/settings/" + setting.id,
        method: "PUT",
        data: setting
      });
    }
  },

  watch:{
    $route (to, from) {
      // This is a fast way to check if the button is visible in the current
      // screen size.
      //
      // @see https://stackoverflow.com/a/21696585
      if (this.$refs.appNavCollapseButton.offsetParent) {

        // We use a small timeout here to reduce overlapping animations.
        setTimeout(() => {
          let collapse = this.$bootstrap.Collapse.getOrCreateInstance(
            this.$refs.appNavCollapse,
            {
              toggle: false
            }
          );

          collapse.hide();
        }, 300);
      }
    }
  },

  data() {
    return {
      setting: {
        general: {
          paused: {}
        }
      }
    }
  },

  mounted() {
    this.$http({
      url: "/api/settings",
      method: "GET",
      params: {
        namespace: "general",
        key: "paused"
      }
    }).then(response => {
      response.data.forEach(setting => {
        this.transformSettings(setting);
        this.$set(this.setting["general"], setting.key, setting);
      });
    });
  }
}
</script>

<style>

</style>
