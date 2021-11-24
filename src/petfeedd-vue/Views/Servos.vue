<template>
  <div>
    <h2>Servos</h2>
    <div class="servo" v-for="servo in servos" :key="servo.id">
      <div class="row">
        <div class="form-group col-md-9">
          <label for="servo.name">Name</label>
          <input class="form-control" type="input" name="servo.name" value="1" step="1" v-model="servo.name">
        </div>

        <div class="form-group col-md-2">
          <label for="servo.feed_time">Spin Time</label>
          <input class="form-control" type="number" name="servo.feed_time" step="0.01" v-model="servo.feed_time">
        </div>

        <div class="form-group col-md-1">
          <label for="servo.pin">Pin</label>
          <input class="form-control" type="number" name="servo.pin" value="1" step="1" v-model="servo.pin">
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-md-12">
          <button class="btn btn-danger" v-on:click='deleteServo()'>Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      servos: []
    }
  },
  mounted() {
    this.$http({
      url: "/api/servos",
      method: "GET"
    }).then(response => {
      this.servos = response.data;
    });
  }
}
</script>

<style>

</style>
