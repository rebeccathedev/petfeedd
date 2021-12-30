<template>
  <div>
    <portal to="toolbar">
      <button class="btn btn-primary" @click="testEmail()">Test Email</button>
    </portal>
    <div class="row">
      <div class="col">
        <div class="form-check my-2">
          <input class="form-check-input" type="checkbox" value="1" id="enable" v-model="enable">
          <label class="form-check-label" for="enable">
            Enable Email Notifications
          </label>
        </div>
      </div>
    </div>

    <div v-if="enable">
      <div class="row">
        <div class="col-md-10">
          <label for="server" class="form-label">Mail Server</label>
          <input type="text" class="form-control" id="server" placeholder="mail.google.com" v-model="server">
        </div>
        <div class="col-md-2">
          <label for="port" class="form-label">Port</label>
          <input type="number" class="form-control" id="port" placeholder="25" v-model="port">
        </div>
      </div>

      <div class="row mt-2">
        <div class="col-md-6">
          <label for="from" class="form-label">From Name</label>
          <input type="text" class="form-control" id="from" placeholder="Example Name" v-model="from">
        </div>
        <div class="col-md-6">
          <label for="from_address" class="form-label">From Address</label>
          <input type="email" class="form-control" id="from_address" placeholder="name@example.com" v-model="from_address">
        </div>
      </div>

      <div class="row mt-2">
        <div class="col">
          <label for="to" class="form-label">To</label>
          <input type="text" class="form-control" id="to" placeholder="Example Name" v-model="to">
        </div>
      </div>

      <div class="row mt-2">
        <div class="col">
          <label for="subject" class="form-label">Subject</label>
          <input type="text" class="form-control" id="subject" placeholder="Example Name" v-model="subject">
        </div>
      </div>

      <div class="row mt-2">
        <div class="col-md-6">
          <label for="username" class="form-label">Username</label>
          <input type="text" class="form-control" id="username" placeholder="Example Name" v-model="username">
        </div>
        <div class="col-md-6">
          <label for="password" class="form-label">Password</label>
          <input type="text" class="form-control" id="password" placeholder="name@example.com" v-model="password">
        </div>
      </div>

      <div class="row mt-2">
        <div class="col">
          <div class="form-check my-2">
            <input class="form-check-input" type="checkbox" value="1" id="secure" v-model="secure">
            <label class="form-check-label" for="secure">
              Use SSL/TLS
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    async save() {
      await this.saveSettings();
      this.$toast.open('Email Settings Saved');
    },

    async testEmail() {
      await this.$http({
        url: "/api/util/emailtest",
        method: "GET"
      });

      this.$toast.open('Test Email Sent');
    }
  },

  data() {
    return {
      enable: false,
      server: "",
      port: 25,
      from: "",
      from_address: "",
      to: "",
      subject: "",
      username: "",
      password: "",
      secure: false
    }
  },

  mounted() {
    this.$parent.$on("config.save", this.save);
    this.loadSettings("email", true);
  },

  beforeDestroy() {
    this.$parent.$off("config.save", this.save);
  }
}
</script>

<style>

</style>
