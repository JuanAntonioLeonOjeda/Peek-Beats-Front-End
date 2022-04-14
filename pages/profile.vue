<template>
  <div>
    <NavBar />
    <NavigationDrawer />
    <ProfileCard />
  </div>
</template>

<script>
import NavBar from '~/components/NavBar.vue'
import NavigationDrawer from '@/components/NavigationDrawer.vue'
import ProfileCard from '@/components/ProfileCard.vue'

export default {
  name: 'ProfilePage',
  components: {
    NavBar,
    NavigationDrawer,
    ProfileCard
  }
}
</script>

<style lang="scss" scoped>
</style>
