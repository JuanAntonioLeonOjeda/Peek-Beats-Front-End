<template>
  <div class="error-page">
    <h1>Room is full</h1>
    <v-btn to="/" color="primary">
      Go to Home
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'ErrorPage',
  mounted () {
    !this.$auth.loggedIn ? this.$router.push({ path: '/' }) : console.log('allGood')
  }
}
</script>

<style>
  .error-page {
    width: 100vw;
    height: calc(100vh - 90px);
    padding-top: 200px;
    text-align: center;
  }
</style>
