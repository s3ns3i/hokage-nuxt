export default {
  build: {
    transpile: ['feathers-vuex']
  },
  buildModules: [
    '@nuxtjs/vuetify'
  ],
  router: {
    middleware: ['auth']
  }
}