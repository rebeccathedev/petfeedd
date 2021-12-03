<template>
  <div>
    <portal to="toolbar">
      <button class="btn btn-primary" @click="addFeed()">Add Feed</button>
    </portal>
    <div class="feed card mb-2" v-for="feed in feeds" :key="feed.id">
      <div class="card-body">
        <div class="row">
          <div class="form-group col-lg-7 col-md-6">
            <label for="feed.name">Name</label>
            <input class="form-control" type="input" name="feed.name" value="1" step="1" v-model="feed.name">
          </div>

          <div class="form-group col-lg-2 col-md-6">
            <label for="feed.servo_id">Servo</label>
            <select class="form-select" v-model="feed.servo_id">
              <option v-for="servo in servos" :value="servo.id" :key="servo.id">
                {{ servo.name }}
              </option>
            </select>
          </div>

          <div class="form-group col-lg-2 col-md-6 mt-2 mt-lg-0">
            <label for="feed.time">Time</label>
            <input class="form-control" type="time" name="feed.time" value="00:00" step="60" v-model="feed.time">
          </div>

          <div class="form-group col-lg-1 col-md-6 mt-2 mt-lg-0">
            <label for="feed.size">Size</label>
            <input class="form-control" type="number" name="feed.size" value="1" step="1" v-model="feed.size">
          </div>
        </div>
        <div class="row mt-2">
          <div class="col-lg-12">
            <button class="btn btn-danger" v-on:click='deleteFeed(feed)'>Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    addFeed() {
      this.feeds.push({
        name: "New Feed",
        servo_id: 1,
        size: 1,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})
      });
    },

    deleteFeed(feed) {
      this.feedsToDelete.push(feed);
      this.feeds.splice(this.feeds.indexOf(feed), 1);
    },

    save() {
      this.feedsToDelete.forEach(async (feed)  => {
        if (feed.id) {
          this.$http({
            url: "/api/feeds/" + feed.id,
            method: "DELETE"
          });
        }
      });

      this.feeds.forEach(async (feed)  => {
        if (feed.id) {
          this.$http({
            url: "/api/feeds/" + feed.id,
            method: "PUT",
            data: feed
          });
        } else {
          this.$http({
            url: "/api/feeds",
            method: "POST",
            data: feed
          });
        }
      });

      this.$toast.open('Feeds saved.');
    }
  },
  data() {
    return {
      feeds: [],
      servos: [],
      feedsToDelete: []
    }
  },
  mounted() {
    this.$parent.$on("config.save", this.save);

    this.$http({
      url: "/api/feeds",
      method: "GET"
    }).then(response => {
      this.feeds = response.data;
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
