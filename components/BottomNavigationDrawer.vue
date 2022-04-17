<template>
  <div>
    <v-bottom-navigation
      fixed
      app
    >
      <v-btn
        color="teal lighten-2"
        text
        value="home"
        @click="$router.push({ path: '/home' })"
      >
        <span>Home</span>

        <v-icon>mdi-home</v-icon>
      </v-btn>

      <v-btn
        color="teal lighten-2"
        text
        value="friends"
      >
        <span>Friends</span>

        <v-icon>mdi-account-group</v-icon>
      </v-btn>

      <v-btn
        color="deep-purple accent-4"
        text
        value="nearby"
      >
        <span>Discover</span>

        <v-icon>mdi-compass</v-icon>
      </v-btn>

      <v-btn
        color="teal lighten-2"
        text
        value="shuffle"
      >
        <span>Shuffle</span>

        <v-icon>mdi-shuffle-variant</v-icon>
      </v-btn>

      <v-btn
        color="teal lighten-2"
        text
        value="profile"
        @click="$router.push({ path: '/profile' })"
      >
        <v-list-item-avatar
          size="40"
        >
          <v-img src="https://images.pexels.com/photos/4566232/pexels-photo-4566232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
        </v-list-item-avatar>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
export default {
  name: 'BottomNavigationDrawer'

}
</script>

<style lang="scss" scoped>

</style>
