<template>
  <v-footer
    v-if="!$vuetify.breakpoint.xs"
    inset
    height="70"
    width="auto"
    app
    color="footer"
  >
    <v-container>
      <v-row justify="center">
        <v-col cols="12" align-self="center">
          <h5 class="text-center">
            <h3><span class="peek">Peek</span><span class="beats"><span class="firstLetter">B</span>eats</span></h3> {{ new Date().getFullYear() }} — All Rights Reserved ©
          </h5>
        </v-col>
        </v-colcols="12">
      </v-row>
    </v-container>
  </v-footer>
</template>
<script>
export default {
  name: 'FooterBar'
}
</script>
<style lang="scss" scoped>
.peek {
  color: #565EE8;
  }
.beats {
  color: #1CEFBD;
  }
.firstLetter {
  color: #D50000;
}
</style>
