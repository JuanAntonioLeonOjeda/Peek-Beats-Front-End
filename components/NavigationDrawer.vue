<template>
  <div>
    <div v-if="!$vuetify.breakpoint.xs">
      <v-navigation-drawer
        app
        width="200"
        clipped
        :mini-variant="$vuetify.breakpoint.smOnly || $vuetify.breakpoint.xsOnly"
        mini-variant-width="73"
        mobile-breakpoint="600"
        color="navDrawer"
        class="elevation-3"
      >
        <v-list color="topNavDraw">
          <v-list-item link @click="$router.push({ path: '/profile' })">
            <v-list-item-avatar
              size="60"
            >
              <v-img :src="`${avatar}`" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="nameTitle text-h6">
                {{ $auth.user.userName }}
              </v-list-item-title>
              <v-list-item-subtitle>
                My Profile
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list
          nav
        >
          <v-list-item link @click="$router.push({ path: '/home' })">
            <v-list-item-icon>
              <v-icon color="#565EE8">
                mdi-home
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon color="red accent-4">
                mdi-record
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title>My Streams</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon color="#565EE8">
                mdi-account-group
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title>Friends</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon color="#565EE8">
                mdi-message-reply
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title>Whispers</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon color="#F9A825">
                mdi-police-badge
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title>Badges</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon color="#565EE8">
                mdi-shuffle-variant
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title>Shuffle</v-list-item-title>
          </v-list-item>
        </v-list>
        <template #append>
          <v-list-item class="mb-6" @click="dayOrNigth">
            <v-icon large color="accentIcons">
              mdi-theme-light-dark
            </v-icon>
            <!-- <v-list-item-subtitle>Day/Nigth</v-list-item-subtitle> -->
            <v-container class="ml-4" fluid>
              <v-switch
                color="grey"
                inset
              />
            </v-container>
          </v-list-item>

          <div v-if="$vuetify.breakpoint.smOnly || $vuetify.breakpoint.xsOnly" class="pa-2">
            <v-btn
              color="#565EE8"
              :outlined="!$vuetify.theme.dark === true ? false : true"
              block
              fab
              @click="$auth.logout()"
            >
              <v-icon dark :color="$vuetify.theme.dark ? '#565EE8' : 'white' ">
                mdi-logout
              </v-icon>
            </v-btn>
          </div>
          <div v-else class="pa-2">
            <v-btn
              color="#565EE8"
              :outlined="!$vuetify.theme.dark === true ? false : true"
              x-large
              block
              @click="$auth.logout()"
            >
              <v-icon dark :color="$vuetify.theme.dark ? '#565EE8' : 'white'">
                mdi-logout
              </v-icon>
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
    </div>

    <div v-else>
      <BottomNavigationDrawer />
    </div>
  </div>
</template>

<script>
import BottomNavigationDrawer from '@/components/BottomNavigationDrawer.vue'
export default {
  name: 'NavigationDrawer',
  components: { BottomNavigationDrawer },
  data () {
    return {
      userName: '',
      avatar: this.$auth.user.avatar
    }
  },
  async mounted () {
  },
  methods: {
    dayOrNigth () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    }
  }

}
</script>

<style lang="scss" scoped>
.nameTitle {
  // color: #f5f2f2;
  color: #565EE8 !important;
  font-weight: bold;
  font-size: 1.4rem !important;
}
</style>
