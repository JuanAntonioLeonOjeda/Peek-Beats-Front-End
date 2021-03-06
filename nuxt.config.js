import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
      // { 'http-equiv': 'Content-Security-Policy', content: 'upgrade-insecure-requests' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/socket.io.js',
    { src: '~plugins/vue-carousel-3d', ssr: false }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/auth'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    // baseURL: 'http://localhost:5000/api'
    baseURL: 'https://peek-beats-back-wrtc.herokuapp.com/api'
  },

  auth: {
    redirect: {
      login: '/',
      logout: '/',
      home: '/home'
    },
    watchLoggedIn: true,
    strategies: {
      local: {
        endpoints: {
          login: { url: '/auth/login', method: 'post', propertyName: 'token' },
          logout: { url: '/auth/logout', method: 'post' },
          user: { url: '/users/me', method: 'get', propertyName: false }
        },
        user: {
          autoFetch: true,
          property: ''
        },
        tokenType: ''
      }
    }
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          // 363E43
          primary: '#fff',
          accent: '#1CEFBD',
          accentIcons: 'white',
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          topBar: '#565EE8',
          topNavDraw: '#3e454a',
          navDrawer: '#353A3D',
          bar: '#353A3D',
          footer: '#353A3D',
          mainCards: '#1e1e1e'
        },
        light: {
          primary: '#000000',
          accent: '#565EE8',
          accentIcons: '#565EE8',
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          topBar: '#fff',
          topNavDraw: '#fff',
          navDrawer: '#f5f2f2',
          bar: '#fff',
          footer: '#fff',
          mainCards: '#F2F2F2'
          // red accent-4
        }
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
  env: {
    // WS_URL: process.env.WS_URL || 'http://localhost:5050'
    WS_URL: process.env.WS_URL || 'https://peer-js-server-prueba.herokuapp.com'
  }
}
