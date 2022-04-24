<template>
  <div>
    <v-btn color="accent" @click="AddFavouriteStreamer">
      Add Favourite Streamer
    </v-btn>
    <FavouriteStreamerAlert v-if="show" :message="message" />
  </div>
</template>

<script>
import FavouriteStreamerAlert from '@/components/FavouriteStreamerAlert.vue'
export default {
  name: 'AddFavouriteStreamer',
  components: {
    FavouriteStreamerAlert
  },
  data () {
    return {
      show: false,
      message: ''
    }
  },
  methods: {
    async AddFavouriteStreamer () {
      const streamerId = this.$store.state.streamInfo.streamer._id
      const result = await this.$store.dispatch('addFavouriteStreamer', streamerId)
      this.message = result
      this.show = true
      const timerId = setTimeout(() => {
        this.show = false
        clearTimeout(timerId)
      }, 3000)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
