<template>
  <div>
    <div class="servo mb-2 card" v-for="servo in servos" :key="servo.id">
      <div class="card-body">
        <div class="row">
          <div class="form-group col-lg-9 col-md-12">
            <label for="servo.name">Name</label>
            <input class="form-control" type="input" name="servo.name" value="1" step="1" v-model="servo.name">
          </div>

          <div class="form-group col-lg-2 col-md-6 mt-2 mt-lg-0">
            <label for="servo.feed_time">Spin Time</label>
            <input class="form-control" type="number" name="servo.feed_time" step="0.01" v-model="servo.feed_time">
          </div>

          <div class="form-group col-lg-1 col-md-6 mt-2 mt-lg-0">
            <label for="servo.pin">Pin</label>
            <input class="form-control" type="number" name="servo.pin" value="1" step="1" v-model="servo.pin">
          </div>
        </div>
        <div class="row mt-2">
          <div class="col-md-12">
            <button class="btn btn-danger" v-on:click='deleteServo(servo)'>Delete</button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <button class="btn btn-primary" @click="addServo()">Add Servo</button>
      <button class="btn btn-success" @click="save()">Save</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    addServo() {
      this.servos.push({
        name: "New Servo",
        feed_time: 0.25,
        pin: 17
      });
    },

    deleteServo(servo) {
      this.servosToDelete.push(servo);
      this.servos.splice(this.servos.indexOf(servo), 1);
    },

    save() {
      this.servosToDelete.forEach(async (servo) => {
        if (servo.id) {
          await this.$http({
            url: "/api/servos/" + servo.id,
            method: "DELETE"
          });
        }
      });

      this.servos.forEach(async (servo) => {
        if (servo.id) {
          await this.$http({
            url: "/api/servos/" + servo.id,
            method: "PUT",
            data: servo
          });
        } else {
          await this.$http({
            url: "/api/servos",
            method: "POST",
            data: servo
          });
        }
      });

      this.$toast.open('Servos saved.');
    }
  },
  data() {
    return {
      servos: [],
      servosToDelete: []
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
