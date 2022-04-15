<template>
  <v-alert class="mt-10" border="bottom" color="primary" dark>
    {{ message }}
  </v-alert>
</template>

<script>
export default {
  name: 'FavouriteStreamerAlert',
  props: ['message']
}
</script>

<style lang="scss" scoped>
</style>
