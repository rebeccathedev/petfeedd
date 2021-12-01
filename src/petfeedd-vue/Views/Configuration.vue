<template>
  <div class="row">
    <div class="col-lg-2">
      <nav class="nav nav-pills flex-column mt-5">
        <router-link :to="{name: 'config.general'}" class="nav-link">General</router-link>
        <router-link :to="{name: 'config.feeds'}" class="nav-link">Feeds</router-link>
        <router-link :to="{name: 'config.servos'}" class="nav-link">Servos</router-link>
        <router-link :to="{name: 'config.buttons'}" class="nav-link">Buttons</router-link>
        <router-link :to="{name: 'config.mqtt'}" class="nav-link">MQTT</router-link>
        <router-link :to="{name: 'config.notifications'}" class="nav-link">Notifications</router-link>
      </nav>
    </div>
    <div class="col-lg-10">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
