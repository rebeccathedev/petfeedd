<template>
  <form-wizard title="petfeedd Setup Wizard" subtitle="" @on-complete="save">
    <tab-content title="Welcome">
      <p>Welcome to petfeedd!</p>
      <p>This wizard will help you set up your first petfeedd instance.</p>
    </tab-content>

    <tab-content title="Create a Servo">
      <p>In order for petfeedd to actually feed your animals, you will need to
        configure at least one servo.
      </p>

      <p>Petfeedd supports multiple servos. You can control as many different
        feeders from a single petfeedd instance as your board will support. You
        can add additional servos in the configuration section.
      </p>

      <div class="row mt-3">
        <label for="servo.name" class="col-sm-2 col-form-label">Name</label>
        <div class="col-sm-10">
          <input class="form-control" type="input" name="servo.name" v-model="servo.name">
        </div>
      </div>
      <div class="row mb-3">
        <div class="offset-sm-2">
          <small>A unique name for your servo.</small>
        </div>
      </div>

      <div class="row">
        <label for="servo.feed_time" class="col-sm-2 col-form-label">Spin Time</label>
        <div class="col-sm-10 col-md-4 col-lg-2">
          <input class="form-control" type="number" name="servo.feed_time" step="0.01" v-model="servo.feed_time">
        </div>
      </div>
      <div class="row mb-3">
        <div class="offset-sm-2 col-sm-10">
          <small>How long to spin the servo for. Feeds are multiples of this
            number; it represents how long it takes to dump one measurement of
            food in the bowl. The actual value will depend on your feeder design and will
            probably require fine tuning. 0.25 is a good starting point.</small>
        </div>
      </div>

      <div class="row">
        <label for="inputPassword" class="col-sm-2 col-form-label">Pin</label>
        <div class="col-sm-10 col-md-4 col-lg-2">
          <input class="form-control" type="number" name="servo.pin" value="1" step="1" v-model="servo.pin">
        </div>
      </div>
      <div class="row mb-3">
        <div class="offset-sm-2 col-sm-10">
          <small>What GPIO pin the servo is connected to. This uses GPIO pin
            numbers, not physical pin numbers. 17 is a common pin.
          </small>
        </div>
      </div>
    </tab-content>

    <tab-content title="Schedule a Feed">
      <p>Petfeedd can feed your animals on a schedule. You can schedule as many
        feeds as you like in the configuration section. Here we will schedule a
        single feed.
      </p>

      <div class="row mt-3">
        <label for="feed.name" class="col-sm-2 col-form-label">Name</label>
        <div class="col-sm-10">
          <input class="form-control" type="input" name="feed.name" v-model="feed.name">
        </div>
      </div>
      <div class="row mb-3">
        <div class="offset-sm-2">
          <small>A unique name for your feed.</small>
        </div>
      </div>

      <div class="row">
        <label for="feed.time" class="col-sm-2 col-form-label">Time</label>
        <div class="col-sm-10 col-md-4 col-lg-2">
          <input class="form-control" type="time" name="feed.time" value="00:00" step="60" v-model="feed.time">
        </div>
      </div>
      <div class="row mb-3">
        <div class="offset-sm-2">
          <small>What time to run the feed each day.</small>
        </div>
      </div>

      <div class="row">
        <label for="feed.time" class="col-sm-2 col-form-label">Size</label>
        <div class="col-sm-10 col-md-4 col-lg-2">
          <input class="form-control" type="number" name="feed.size" value="1" step="1" v-model="feed.size">
        </div>
      </div>
      <div class="row mb-3">
        <div class="offset-sm-2 col-sm-10">
          <small>What size to make the feed. This is a multiple of Spin Time on
            the servo, so if Spin Time is set to 0.25, a feed size of 2 will
            spin the servo for 0.5 seconds.
          </small>
        </div>
      </div>
    </tab-content>

    <tab-content title="Finish">
      <div class="row mt-3">
        <div class="col-sm-2">
          <div class="my-2"><strong>Servo Name</strong></div>
        </div>
        <div class="col-sm-10">
          <div class="my-2">{{ servo.name }}</div>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-2">
          <div class="my-2"><strong>Spin Time</strong></div>
        </div>
        <div class="col-sm-10">
          <div class="my-2">{{ servo.feed_time }}</div>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-2">
          <div class="my-2"><strong>Pin</strong></div>
        </div>
        <div class="col-sm-10">
          <div class="my-2">{{ servo.pin }}</div>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-2">
          <div class="my-2"><strong>Feed Name</strong></div>
        </div>
        <div class="col-sm-10">
          <div class="my-2">{{ feed.name }}</div>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-2">
          <div class="my-2"><strong>Size</strong></div>
        </div>
        <div class="col-sm-10">
          <div class="my-2">{{ feed.size }}</div>
        </div>
      </div>

      <div class="row mb-2">
        <div class="col-sm-2">
          <div class="my-2"><strong>Time</strong></div>
        </div>
        <div class="col-sm-10">
          <div class="my-2">{{ feed.time }}</div>
        </div>
      </div>

      <p>If this looks correct, click "Finish" to save your changes.</p>
    </tab-content>
  </form-wizard>
</template>

<script>
import {FormWizard, TabContent} from 'vue-form-wizard';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';

export default {
  components: {
    FormWizard,
    TabContent
  },

  methods: {
    async save() {
      var servoData = await this.$http({
        url: "/api/servos",
        method: "POST",
        data: this.servo
      });

      servoData = servoData.data;
      this.feed.servo_id = servoData.id;

      await this.$http({
        url: "/api/feeds",
        method: "POST",
        data: this.feed
      });

      this.$router.push({ name: 'home' });
    }
  },

  data() {
    return {
      servo: {
        pin: 17,
        name: "Default",
        feed_time: 0.25
      },
      feed: {
        name: "Default",
        size: 1,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})
      }
    }
  }
}
</script>

<style>

</style>
