<template>
  <div>
    <v-card flat class="mt-16" color="mainCards">
      <div>
        <v-card-title class="justify-center">
          <a :class="$vuetify.breakpoint.xsOnly ? 'font-weight-black title text-center' : 'font-weight-black text-md-h4 text-sm-h4 text-center'">
            Select your genre and <span :style="[$vuetify.theme.dark === true ? {'color': '#1CEFBD'} : {'color': '#565EE8'} ]">START</span> streaming!
          </a>
        </v-card-title>
        <v-row justify="center">
          <v-col cols="6">
            <v-select
              v-model="genre"
              class="mt-0"
              :items="genres"
              label="Choose stream's music genre"
              item-text="name"
            />
          </v-col>
        </v-row>
        <!-- <v-select
            v-model="genre"
            :items="genres"
            label="Tags"
            chips
          >
            <template #selection="{ item }">
              {{ item.name }}
            </template>
            <template #item="{ item, attrs, on }">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-content>x
                  <v-list-item-title>
                    <span>{{ item.name }}</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-select>
          {{ genre.id }} -->
        <CreateStreamButton />
      </div>
    </v-card>
    <v-divider />
  </div>
</template>

<script>
import CreateStreamButton from '@/components/CreateStreamButton.vue'
export default {
  name: 'GenreSelect',
  components: { CreateStreamButton },
  data () {
    return {
      genres: [],
      genre: ''
    }
  },
  async mounted () {
    try {
      const genre = await this.$store.dispatch('getAllGenres')
      this.genres = genre
    } catch (error) {
      throw new Error(error)
    }
  },
  async updated () {
    const genreId = this.genres.filter(e => e.name === this.genre)
    if (genreId[0]) {
      await this.$store.commit('genreAlert', false)
      await this.$store.commit('saveGenre', genreId[0])
    }
  }
}
</script>

<style lang="scss" scoped>
.d-flex {
  justify-content: center;
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
  transition: transform .7s ease-in-out;
}
a:hover::before {
  transform-origin: left;
  transform: scaleX(1);
}
</style>
