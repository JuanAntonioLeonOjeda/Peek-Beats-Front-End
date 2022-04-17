<template>
  <div>
    ALL THE STREAMS
  </div>
</template>

<script>
export default {
  name: 'AllStreamsPage',
  mounted () {
    !this.$auth.loggedIn ? this.$router.push({ path: '/' }) : console.log('allGood')
  }
}
</script>

<style lang="scss" scoped>

</style>
