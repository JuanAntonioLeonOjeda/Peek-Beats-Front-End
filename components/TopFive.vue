<template>
  <div>
    <v-card flat class="pb-1 mt-10" color="mainCards">
      <div v-if="loading" class="progress">
        <LoadingAnimation />
      </div>
      <div v-else>
        <v-card-title class="justify-center">
          <a :class="$vuetify.breakpoint.xsOnly ? 'font-weight-black title' : 'font-weight-black text-md-h4 text-sm-h4'">
            Top Streamers
          </a>
        </v-card-title>
        <carousel-3d
          :disable3d="true"
          :space="320"
          :controls-visible="true"
          :width="290"
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
                    <v-btn class="followStream" color="#565de898" @click="alert1">
                      Follow
                    </v-btn>
                    <v-btn class="addStream" fab color="#ffffff63" @click="alert2">
                      <v-icon color="red accent-4">
                        mdi-heart
                      </v-icon>
                    </v-btn>
                  </div>
                </v-col>
                <v-spacer />
                <figcaption
                  class="title-container"
                  :style="[$vuetify.theme.dark === true ? {'background-color': '#ffffff10'} : {'background-color': '#ffffff10'}]"
                >
                  <v-col cols="12" class="tags" :style="[$vuetify.theme.dark === true ? {'color': 'white'} : {'color': 'white'}]">
                    <span class="title">{{ slide.userName }}</span>
                    <p class="followers mb-0">
                      <v-icon color="#565EE8" class="mr-6">
                        mdi-account-heart-outline
                      </v-icon><span class="nmrs">{{ slide.followers.length }}</span>
                    </p>
                    <p class="streams">
                      <v-icon color="red accent-4" class="ml-1 mr-5">
                        mdi-video-wireless-outline
                      </v-icon> <span class="nmrs">{{ slide.myStreams.length }}</span>
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
    <v-divider />
  </div>
</template>

<script>
import LoadingAnimation from '@/components/LoadingAnimation.vue'
export default {
  name: 'TopFive',
  components: { LoadingAnimation },
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
  position: absolute;
  top: 8px;
}
.followers{
  font-weight: bold;
  position: absolute;
  bottom: 40px;
}
.streams {
  font-weight: bold;
  position: absolute;
  bottom: -5px;
}
img {
  margin-top: 6px;
}
.avatar-container {
  z-index: 1;
  position: absolute;
  right: -6px;
  top: -4px;
}
.slide {
  border-radius: 5px;
  // border-style: solid;
  // border-width: 2px !important;
}
.carousel-3d-container figcaption  {
  z-index: 1;
  position: absolute;
  background-color: #ffffff00;
  left: 0;
  border-radius: 5px;
  padding: 5px;
  height: 100%;
  width: 170px;
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
  border-radius: 2px;
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
  // background-color: #565EE8 !important;
  z-index: 12;
  position: absolute;
  right: 12px;
  bottom: 3px;
}
.nmrs {
  z-index: 12;
  position: absolute;
  top: 3px;
}
.addStream {
  // background-color: #ffffff93 !important;
  z-index: 12;
  position: absolute;
  right: 75px;
  top: 3px;
  width:35px;
  height:35px;
}
.invisible {
  display: none;
}
.avatar-container:hover + .invisible,  .invisible:hover {
    display: inline-block;
}
</style>
