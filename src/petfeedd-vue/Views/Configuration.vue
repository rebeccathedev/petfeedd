<template>
  <div class="row">
    <div class="col-lg-2 col-md-3">
      <div class="d-flex flex-column">
        <button
          class="d-block d-md-none btn btn-light btn-lg dropdown-toggle mb-3 text-start"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#configNavCollapse"
          aria-expanded="false"
          aria-controls="configNavCollapse"
          ref="configNavCollapseButton"
        >
          {{ $route.meta.title }}
        </button>
        <div class="collapse d-md-block" id="configNavCollapse" ref="configNavCollapse">
          <nav class="nav nav-pills flex-column mt-md-5 mb-3">
            <router-link :to="{name: 'config.general'}" class="nav-link">General</router-link>
            <h6 class="nav-section-header">Core</h6>
            <router-link :to="{name: 'config.feeds'}" class="nav-link">Feeds</router-link>
            <router-link :to="{name: 'config.servos'}" class="nav-link">Servos</router-link>
            <router-link :to="{name: 'config.buttons'}" class="nav-link">Buttons</router-link>
            <router-link :to="{name: 'config.sounds'}" class="nav-link">Sounds</router-link>
            <h6 class="nav-section-header">Notifications</h6>
            <router-link :to="{name: 'config.mqtt'}" class="nav-link">MQTT</router-link>
            <router-link :to="{name: 'config.email'}" class="nav-link">Email</router-link>
            <router-link :to="{name: 'config.twitter'}" class="nav-link">Twitter</router-link>
          </nav>
        </div>
      </div>
    </div>
    <div class="col-lg-10 col-md-9">
      <div class="d-flex align-items-center justify-content-end justify-content-md-between mb-3">
        <h2 class="d-none d-md-block m-0">{{ $route.meta.title }}</h2>
        <div class="d-flex ">
          <portal-target name="toolbar"></portal-target>
          <button class="btn btn-success ms-1" @click="save()">Save</button>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    save() {
      this.$emit("config.save");
    }
  },

  watch:{
    $route (to, from) {
      // This is a fast way to check if the button is visible in the current
      // screen size.
      //
      // @see https://stackoverflow.com/a/21696585
      if (this.$refs.configNavCollapseButton.offsetParent) {

        // We use a small timeout here to reduce overlapping animations.
        setTimeout(() => {
          let collapse = this.$bootstrap.Collapse.getOrCreateInstance(
            this.$refs.configNavCollapse
          );

          collapse.hide();
        }, 300);
      }
    }
  }
}
</script>

<style>
.nav-section-header {
  display: block;
  padding: .5rem 1rem;
  --bs-bg-opacity: 1;
  background-color: rgba(var(--bs-light-rgb),var(--bs-bg-opacity)) !important;
  margin: 1rem 0 0 0;
}
</style>
