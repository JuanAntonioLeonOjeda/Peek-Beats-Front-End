<template>
  <v-app dark>
    <v-main>
      <Nuxt />
      <!-- <v-overlay :value="overlay">
        <p>
          <v-progress-circular
            indeterminate
            color="primary"
          />
          Lost connection to server, trying to reconnect ...
        </p>
    </v-overlay> -->
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  // data () {
  //   return {
  //     clipped: false
  //   }
  // },
  // computed: {
  //   mapState () {
  //     const overlay = this.$store.state.overlay
  //     return overlay
  //   }
  // },
  mounted () {
    this.$socket.on('reconnecting', () => {
      this.$store.commit('setting/setOverlay', {
        overlay: true
      })
    })
    this.$socket.on('reconnect', () => {
      this.$store.commit('setting/setOverlay', {
        overlay: false
      })
    })
    this.$socket.on('reconnect', () => {
      this.$store.commit('setting/setOverlay', {
        overlay: false
      })
    })
    this.$socket.on('reject', (data) => {
      this.$router.push('/error')
    })
  }

}
</script>
