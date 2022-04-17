<template>
  <div>
    <v-card flat class="pb-1 mt-10">
      <div v-if="loading" class="progress">
        <LoadingAnimation />
      </div>
      <div v-else>
        <v-card-title class="justify-center">
          <a :class="$vuetify.breakpoint.xsOnly ? 'font-weight-black title' : 'font-weight-black text-md-h4 text-sm-h4'">
            Top 5 Streamers
          </a>
        </v-card-title>
        <carousel-3d
          :disable3d="true"
          :space="365"
          :controls-visible="true"
          :height="110"
        >
          <slide v-for="(slide, i) in top5" :key="i" :index="i" class="slide" :style="[$vuetify.theme.dark === true ? {'background-color': '#ffffff00'} : {'background-color': '#353a3d9d'}]">
            <v-container>
              <v-row justify="center" class="buttons-on">
                <v-spacer />
                <v-col cols="6" class="pt-1">
                  <div class="avatar-container">
                    <v-list-item-avatar size="100">
                      <v-img :src="`${slide.avatar}`" alt="Avatar Image" />
                    </v-list-item-avatar>
                  </div>
                  <!-- <div class="followers-container">
                    <v-list-item-avatar size="70">
                      <v-img :src="require('@/static/followersColor.png')" alt="Followers Icon" />
                    </v-list-item-avatar>
                  </div> -->
                  <div class="invisible">
                    <v-btn class="followStream" @click="alert1">
                      Follow
                    </v-btn>
                    <v-btn class="addStream" fab @click="alert2">
                      <v-icon color="red accent-4">
                        mdi-heart
                      </v-icon>
                    </v-btn>
                  </div>
                </v-col>
                <v-spacer />
                <figcaption
                  :style="[$vuetify.theme.dark === true ? {'background-color': '#ffffff10'} : {'background-color': '#ffffff10'}]"
                >
                  <v-col cols="12" class="tags" :style="[$vuetify.theme.dark === true ? {'color': 'white'} : {'color': 'white'}]">
                    <span class="title">{{ slide.userName }}</span>
                    <p class="followers mb-0">
                      Followers: {{ slide.followers.length }}
                    </p>
                    <p class="streams">
                      Streams made: {{ slide.myStreams.length }}
                    </p>
                  </v-col>
                  <v-spacer />
                </figcaption>
              </v-row>
            </v-container>
          </slide>
        </carousel-3d>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'TopFive',
  data () {
    return {
      top5: [],
      loading: true
    }
  },
  async mounted () {
    try {
      this.top5 = await this.$store.dispatch('getTopFive')
      this.loading = false
    } catch (error) {
      throw new Error(error)
    }
  },
  methods: {
    alert1 () {
      alert('Following')
    },
    alert2 () {
      alert('Liked')
    }
  }
}
</script>

<style lang="scss" scoped>
.text-center {
  margin-top: 50px;
}
.title {
  font-size: 1.6rem !important;
  margin-left: 10%;
}
.followers{
  font-weight: bold;
  position: absolute;
  bottom: 30px;
}
.streams {
  font-weight: bold;
  position: absolute;
  bottom: -10px;
}
img {
  margin-top: 6px;
}
.avatar-container {
  z-index: 1;
  position: absolute;
  right: -5px;
  top: -4px;
}
// .followers-container {
//   z-index: 123;
//   position: absolute;
//   left: 150px;
//   top: 30px;
// }
.slide {
  border-radius: 5px;
  // border-style: solid;
  // border-width: 2px !important;
}
.carousel-3d-container figcaption {
  z-index: 1;
  position: absolute;
  background-color: #ffffff00;
  left: 0;
  border-radius: 5px;
  padding: 5px;
  height: 100%;
  min-width: 65%;
  box-sizing: border-box;
}
.avatar {
  background-size: cover !important;
}
a {
  position: absolute;
  text-decoration: none;
  margin-bottom: 25px;
  padding: 25px;
}
a::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 15px;
  border-radius: 7px;
  background-color: #565de8bb;
  top: 60px;
  left: 0;
  transform-origin: right;
  transform: scaleX(0);
  transition: transform .5s ease-in-out;
}
a:hover::before {
  transform-origin: left;
  transform: scaleX(1);
}
.followStream {
  background-color: #565EE8 !important;
  z-index: 12;
  position: absolute;
  right: 110px;
  bottom: 10px;
}
.addStream {
  background-color: white !important;
  z-index: 12;
  position: absolute;
  right: 60px;
  bottom: 10px;
  width:30px;
  height:30px;
}
.invisible {
  display: none;
}
.avatar-container:hover + .invisible,  .invisible:hover {
    display: inline-block;
}
</style>
