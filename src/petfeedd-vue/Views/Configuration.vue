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
            <router-link :to="{name: 'config.feeds'}" class="nav-link">Feeds</router-link>
            <router-link :to="{name: 'config.servos'}" class="nav-link">Servos</router-link>
            <router-link :to="{name: 'config.buttons'}" class="nav-link">Buttons</router-link>
            <router-link :to="{name: 'config.mqtt'}" class="nav-link">MQTT</router-link>
            <router-link :to="{name: 'config.notifications'}" class="nav-link">Notifications</router-link>
          </nav>
        </div>
      </div>
    </div>
    <div class="col-lg-10 col-md-9">
      <h2 class="d-none d-md-block">{{ $route.meta.title }}</h2>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
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

</style>
