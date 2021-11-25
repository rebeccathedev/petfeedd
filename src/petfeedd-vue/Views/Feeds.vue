<template>
  <div>
    <h2>Feeds</h2>
    <div class="feed card mb-2" v-for="feed in feeds" :key="feed.id">
      <div class="card-body">
        <div class="row">
          <div class="form-group col-md-7">
            <label for="feed.name">Name</label>
            <input class="form-control" type="input" name="feed.name" value="1" step="1" v-model="feed.name">
          </div>

          <div class="form-group col-md-2">
            <label for="feed.servo_id">Servo</label>
            <select class="form-select" v-model="feed.servo_id">
              <option v-for="servo in servos" :value="servo.id" :key="servo.id">
                {{ servo.name }}
              </option>
            </select>
          </div>

          <div class="form-group col-md-2">
            <label for="feed.time">Time</label>
            <input class="form-control" type="time" name="feed.time" value="00:00" step="60" v-model="feed.time">
          </div>

          <div class="form-group col-md-1">
            <label for="feed.size">Size</label>
            <input class="form-control" type="number" name="feed.size" value="1" step="1" v-model="feed.size">
          </div>
        </div>
        <div class="row mt-2">
          <div class="col-md-12">
            <button class="btn btn-danger" v-on:click='deleteFeed(feed)'>Delete</button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <button class="btn btn-primary" @click="addFeed()">Add Feed</button>
      <button class="btn btn-success" @click="save()">Save</button>
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
  }
}
</script>

<style>

</style>
