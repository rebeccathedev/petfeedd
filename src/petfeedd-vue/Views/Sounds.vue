<template>
  <div>
    <portal to="toolbar">
      <button class="btn btn-primary" @click="addSound()">Add Sound</button>
    </portal>
    <div class="feed card mb-2" v-for="sound in sounds" :key="sound.id">
      <div class="card-body">
        <div class="row">
          <div class="form-group col-lg-7 col-md-6">
            <label for="sound.sound">Filename</label>
            <input
              class="form-control"
              v-if="!sound.sound"
              ref="file"
              type="file"
              accept=".mp3,.wav"
              @change="fileChanged($event, sound)"
              name="sound">
            <input disabled class="form-control" v-if="sound.sound" v-model="sound.sound">
          </div>
          <div class="form-group col-lg-5 col-md-6">
            <label for="sound.event">Event</label>
            <select class="form-select" v-model="sound.event">
              <option value="">[None]</option>
              <option value="feed.completed">Feed Successful</option>
              <option value="feed.failed">Feed Failed</option>
            </select>
          </div>
        </div>
        <div class="row mt-2">
          <div class="col-lg-12">
            <button class="btn btn-danger" v-on:click='deleteSound()'>Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    addSound() {
      this.sounds.push({
        event: "",
        sound: null
      });
    },

    fileChanged(event, sound) {
      sound.file = event.target;
    },

    save() {
      let formData = new FormData();

      for (const i in this.sounds) {
        if (Object.hasOwnProperty.call(this.sounds, i)) {
          const sound = this.sounds[i];
          if (sound.file) {
            var file = sound.file.files[0];
            formData.append('file.' + i, file);
            sound.file = i;
          }
        }
      }

      formData.append('body', JSON.stringify(this.sounds));

      this.$http({
        url: "/api/sounds",
        method: "PUT",
        headers: { "Content-Type": "multipart/form-data" },
        data: formData
      });
    }
  },

  data() {
    return {
      sounds: []
    }
  },

  mounted() {
    this.$parent.$on("config.save", this.save);

    this.$http({
      url: "/api/sounds",
      method: "GET"
    }).then(response => {
      this.sounds = response.data;
    })
  }
}
</script>

<style>

</style>
