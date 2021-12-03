<template>
  <div>
    <portal to="toolbar">
      <button class="btn btn-primary" @click="addButton()">Add Button</button>
    </portal>
    <div class="servo card" v-for="button in buttons" :key="button.id">
      <div class="card-body">
        <div class="row">
          <div class="form-group col-lg-2 col-md-4">
            <label for="button.pin">Pin</label>
            <input class="form-control" type="number" name="button.pin" value="1" step="1" v-model="button.pin">
          </div>

            <div class="form-group col-lg-4 col-md-4 mt-2 mt-md-0">
              <label for="button.servo_id">Servo</label>
              <select class="form-select" v-model="button.servo_id">
                <option v-for="servo in servos" :value="servo.id" :key="servo.id">
                  {{ servo.name }}
                </option>
              </select>
            </div>

          <div class="form-group col-lg-2 col-md-4 mt-2 mt-md-0">
            <label for="button.default_feed_size">Default Feed Size</label>
            <input class="form-control" type="number" name="button.default_feed_size" value="1" step="1" v-model="button.default_feed_size">
          </div>
        </div>
        <div class="row mt-2">
          <div class="col-md-12">
            <button class="btn btn-danger" v-on:click='deleteButton(button)'>Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    addButton() {
      this.buttons.push({
        default_feed_size: 1,
        servo_id: 1,
        pin: 17
      });
    },

    deleteButton(button) {
      this.buttonsToDelete.push(button);
      this.buttons.splice(this.buttons.indexOf(button), 1);
    },

    save() {
      this.buttonsToDelete.forEach(async (button) => {
        if (button.id) {
          await this.$http({
            url: "/api/buttons/" + button.id,
            method: "DELETE"
          });
        }
      });

      this.buttons.forEach(async (button) => {
        if (button.id) {
          await this.$http({
            url: "/api/buttons/" + button.id,
            method: "PUT",
            data: button
          });
        } else {
          await this.$http({
            url: "/api/buttons",
            method: "POST",
            data: button
          });
        }
      });

      this.$toast.open('buttons saved.');
    }
  },
  data() {
    return {
      buttons: [],
      buttonsToDelete: [],
      servos: []
    }
  },
  mounted() {
    this.$parent.$on("config.save", this.save);

    this.$http({
      url: "/api/buttons",
      method: "GET"
    }).then(response => {
      this.buttons = response.data;
    });

    this.$http({
      url: "/api/servos",
      method: "GET"
    }).then(response => {
      this.servos = response.data;
    });
  },

  beforeDestroy() {
    this.$parent.$off("config.save", this.save);
  }
}
</script>

<style>

</style>
