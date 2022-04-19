<template>
  <v-app>
    <div v-if="loading" class="progress">
      <div class="inProgress text-center">
        <v-progress-circular
          indeterminate
          :size="300"
          :width="20"
          color="#565EE8"
        />
        <div class="mt-3 text-center">
          Loading...
        </div>
      </div>
    </div>
    <v-main v-else-if="$vuetify.breakpoint.xl || $vuetify.breakpoint.lg || $vuetify.breakpoint.md">
      <v-container class="mt-5 fill-height" fluid>
        <div :class="windowSize.x >= '1870' ? 'loroLoco roll' : 'bye'">
          <v-img
            :width="windowSize.x >= '1870' ? '180px' : '100px'"

            :src="require('../static/LORO-XL.png')"
          />
        </div>
        <div class="loroLogo">
          <v-spacer />
          <v-img
            class="move"
            width="45vw"
            :src="require('../static/PEEKBEATS-XL.png')"
          />
        </div>
        <v-row class="main-row">
          <v-col
            cols="12"
            offset-lg="7"
            lg="4"
            offset-md="6"
            md="5"
          >
            <!-- deep-purple lighten-2 -->
            <v-card flat tile class="main-card" color="#fff" width="100%">
              <v-window v-model="$store.state.stepChange">
                <v-window-item :value="2">
                  <SignupForm />
                </v-window-item>
                <v-window-item :value="1">
                  <LoginForm />
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-main v-else-if="$vuetify.breakpoint.sm || $vuetify.breakpoint.xs">
      <v-card
        flat
        tile
        class="main-card"
        color="#fff"
        width="100%"
        height="100%"
      >
        <v-img
          class="peekLogo"
          width="45vw"
          :src="require('../static/PEEKBEATS.png')"
        />
        <v-window v-model="$store.state.stepChange">
          <v-window-item :value="2">
            <SignupForm />
          </v-window-item>
          <v-window-item :value="1">
            <LoginForm />
          </v-window-item>
        </v-window>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
import SignupForm from '@/components/SignupForm.vue'
import LoginForm from '@/components/LoginForm.vue'

export default {
  name: 'AccessForm',
  components: { SignupForm, LoginForm },
  data () {
    return {
      loading: true,
      windowSize: {
        x: 0
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.interval)
  },
  mounted () {
    this.interval = setInterval(() => {
      this.loading = false
    }, 1000)
    this.onResize()
  },
  methods: {
    onResize () {
      this.windowSize = { x: window.innerWidth }
    }
  }
}

</script>

  // background-image: url("https://images.pexels.com/photos/3916376/pexels-photo-3916376.jpeg");
  // background-image: url("https://images.pexels.com/photos/2952834/pexels-photo-2952834.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
  // background-image: url("https://images.pexels.com/photos/3052360/pexels-photo-3052360.jpeg");
<style scoped>
#app {
  position: relative;
  background-image: url("@/static/WelcomePageBackground.jpeg");
  background-size: cover;
  background-position: center;
  margin: -20px !important;
}
.inProgress {
  margin-top: 13%;
}
.main-card {
 padding: 25px;
}
v-card {
  margin: 10;
}
.loroLogo {
  position: absolute;
  left: 7%;
  top: 45%;
}
.loroLoco {
  z-index: 12;
  position: absolute;
  /* left: 43.19%;
  bottom: 389px */
  left: 43.15%;
  bottom: calc(262px + (26 - 10) * ((120vw - 210px) / (1300 - 100)));
}
.bye {
  z-index: 12;
  position: absolute;
  left: 50px;
  top: 50px;
}
.peekLogo {
  margin: 23px 0px 5px 23px;
}
.move {
  animation:bounce-in-bck 0.5s both
}
@keyframes bounce-in-bck{0%{transform:scale(7);animation-timing-function:ease-in;opacity:0}38%{transform:scale(1);animation-timing-function:ease-out;opacity:1}55%{transform:scale(1.5);animation-timing-function:ease-in}72%{transform:scale(1);animation-timing-function:ease-out}81%{transform:scale(1.24);animation-timing-function:ease-in}89%{transform:scale(1);animation-timing-function:ease-out}95%{transform:scale(1.04);animation-timing-function:ease-in}100%{transform:scale(1);animation-timing-function:ease-out}}

.roll {
  animation:roll-in-left 2s ease-out both
}
@keyframes roll-in-left{0%{transform:translateX(-1900px) rotate(-1080deg);opacity:0}100%{transform:translateX(0) rotate(0deg);opacity:1}}
</style>
