<template>
  <div>
    <p>
      MQTT is a lightweight publisher-subscriber ("pub-sub") messaging protocol.
      petfeedd can be configured to both send messages to and act on messages
      from an MQTT broker.
    </p>
    <div class="row">
      <div class="col">
        <div class="form-check my-2">
          <input class="form-check-input" type="checkbox" value="1" id="mqtt.enable" v-model="mqtt.enable">
          <label class="form-check-label" for="mqtt.enable">
            Enable MQTT Support
          </label>
        </div>
      </div>
    </div>

    <div v-if="mqtt.enable">
      <div class="row">
        <div class="col mt-2 mb-4">
          <label for="mqtt.server" class="form-label">MQTT Server</label>
          <input type="text" class="form-control" id="mqtt.server" placeholder="mqtt://example.com" v-model="mqtt.server">
        </div>
      </div>

      <h4 class="mt-2">MQTT Broadcast Events</h4>

      <div class="row">
        <div class="col mt-2 mb-4">
          <label for="mqtt.broadcast_event" class="form-label">Broadcast Feed Event Name</label>
          <input type="text" class="form-control" id="mqtt.broadcast_event" placeholder="home/petfeedd/feed" v-model="mqtt.broadcast_event">
        </div>
      </div>

      <h4 class="mt-2">MQTT Listen Events</h4>
      <p>
        MQTT Listen Events allows you to configure petfeedd to listen for certain
        events and run a feed when they happen. You may optionally send a feed
        size as the data for the event. Otherwise, the default feed size
        configured below will be used.
      </p>
      <button class="btn btn-primary mb-3" @click="addListen()">Add Listen Event</button>
      <div class="card mb-2" v-for="(listen, key) in mqttEvents" :key="key">
        <div class="card-body">
          <div class="row">
            <div class="form-group col-lg-8 col-md-5">
              <label for="listen.event">Event</label>
              <input class="form-control" type="input" name="listen.event" value="1" step="1" v-model="listen.event">
            </div>

            <div class="form-group col-lg-2 col-md-3 mt-2 mt-md-0">
              <label for="listen.servo_id">Servo</label>
              <select class="form-select" v-model="listen.servo_id">
                <option v-for="servo in servos" :value="servo.id" :key="servo.id">
                  {{ servo.name }}
                </option>
              </select>
            </div>

            <div class="form-group col-lg-2 col-md-4 mt-2 mt-md-0">
              <label for="listen.default_feed_size">Default Feed Size</label>
              <input class="form-control" type="number" name="listen.default_feed_size" value="1" step="1" v-model="listen.default_feed_size">
            </div>
          </div>

          <div class="row mt-2">
            <div class="col-md-12">
              <button class="btn btn-danger" v-on:click='deleteListen(listen)'>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    addListen() {
      this.mqttEvents.push({
        event: "New/Listen/Event",
        servo_id: 1,
        default_feed_size: 1
      });
    },

    deleteListen(listen) {
      this.mqttEventsToDelete.push(listen);
      this.mqttEvents.splice(this.mqttEvents.indexOf(listen), 1);
    },

    save() {
      this.mqttEventsToDelete.forEach(async (listen)  => {
        if (listen.id) {
          this.$http({
            url: "/api/mqtt/" + listen.id,
            method: "DELETE"
          });
        }
      });

      this.$http({
        url: "/api/mqtt",
        method: "PUT",
        data: this.mqttEvents
      });

      this.saveSettings();
    }
  },

  data() {
    return {
      mqtt: {},
      mqttEvents: [],
      mqttEventsToDelete: [],
      servos: [],
    }
  },

  mounted() {
    this.$parent.$on("config.save", this.save);

    this.loadSettings("mqtt");

    this.$http({
      url: "/api/mqtt",
      method: "GET",
    }).then(response => {
      this.mqttEvents = response.data;
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
