<template>
  <div>
    <div class="d-flex justify-content-center mb-2">
      <button class="btn btn-primary m-1" v-for="feed in feeds" :key="feed.id" @click="doFeed(feed)">
        Feed {{ feed.name }}
      </button>
    </div>

    <div class="row py-2 d-none d-md-flex d-lg-flex d-xl-flex">
      <div class="col-md-4 col-lg-3">
        <strong>Date</strong>
      </div>
      <div class="col-md-1">
        <strong>Size</strong>
      </div>
      <div class="col-md-7 col-lg-8">
        <strong>Name</strong>
      </div>
    </div>

    <div class="row py-2 alternating" v-for="event in events" :key="event.id">
      <div class="col-md-4 col-lg-3">
        <span class="d-md-none d-lg-none d-xl-none">
          <strong>Date:</strong>
        </span>
        {{ event.date_created }}
      </div>
      <div class="col-md-1">
        <span class="d-md-none d-lg-none d-xl-none">
          <strong>Size:</strong>
        </span>
        {{ event.size }}
      </div>
      <div class="col-md-7 col-lg-8">
        <span class="d-md-none d-lg-none d-xl-none">
          <strong>Name:</strong>
        </span>
        {{ event.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    doFeed(feed) {
      this.$http({
        url: "/api/feeds/" + feed.id + "/feed",
        method: "GET"
      }).then(response => {
        this.getEvents();
      });
    },

    getEvents() {
      this.$http({
        url: "/api/events",
        method: "GET",
        params: {
          limit: 50,
          sort: "id",
          sort_direction: "desc"
        }
      }).then(response => {
        this.events = response.data;
      });
    },

    async checkForOnboarding() {
      let feedData = await this.$http({
        url: "/api/feeds",
        method: "GET"
      });

      let servoData = await this.$http({
        url: "/api/servos",
        method: "GET"
      });

      if (feedData.data.length == 0 && servoData.data.length == 0) {
        this.$router.push({ name: 'onboard' });
      }
    }
  },

  data() {
    return {
      events: [],
      feeds: []
    }
  },

  mounted() {
    this.checkForOnboarding();
    this.getEvents();

    this.$http({
      url: "/api/feeds",
      method: "GET"
    }).then(response => {
      this.feeds = response.data;
    });
  }
}
</script>

<style>
.alternating:nth-of-type(odd) {
  background-color: rgb(var(--bs-light-rgb)) !important;
}
</style>
