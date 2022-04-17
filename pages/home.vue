<template>
  <div>
    <NavBar />
    <NavigationDrawer />
    <GenreSelect />
    <GenreAlert v-if="$store.state.genreAlert" />
    <LiveStreams />
    <TopFive />
    <FooterBar />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import NavigationDrawer from '@/components/NavigationDrawer.vue'
import GenreSelect from '@/components/GenreSelect.vue'
import GenreAlert from '@/components/GenreAlert.vue'
import LiveStreams from '@/components/LiveStreams.vue'
import TopFive from '@/components/TopFive.vue'
import FooterBar from '@/components/FooterBar.vue'

export default {
  name: 'HomePage',
  components: {
    NavBar,
    NavigationDrawer,
    GenreSelect,
    GenreAlert,
    LiveStreams,
    TopFive,
    FooterBar
  },
  data () {
    return {
      name: ''
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
