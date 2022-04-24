<template>
  <div class="stop-container">
    <v-btn class="mx-2" fab color="error" @click="stopStream">
      <v-icon dark>
        mdi-stop
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'StopStream',
  methods: {
    async stopStream () {
      await this.$store.dispatch('stopStream')
      await this.$store.commit('changeRole')
      this.$router.push({ path: '/home' })
    }
  }
}
</script>

<style lang="scss">
.stop-container {
  display: inline-block;
}
</style>
