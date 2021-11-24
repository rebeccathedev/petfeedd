<template>
  <div>
    <h2>Feeds</h2>
    <div class="feed" v-for="feed in feeds" :key="feed.id">
      <div class="row">
        <div class="form-group col-md-9">
          <label for="feed.name">Name</label>
          <input class="form-control" type="input" name="feed.name" value="1" step="1" v-model="feed.name">
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
          <button class="btn btn-danger" v-on:click='deleteFeed()'>Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      feeds: []
    }
  },
  mounted() {
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

</style>
