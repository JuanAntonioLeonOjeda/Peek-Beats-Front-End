<template>
  <v-app dark>
    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      clipped: false,
      title: 'PeekBeats'
    }
  },
  computed: mapState({
    name: state => state.setting.name,
    overlay: state => state.setting.overlay
  }),
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
