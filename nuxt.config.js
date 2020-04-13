import pl from 'vuetify/es5/locale/pl';

export default {
  build: {
    transpile: ['feathers-vuex']
  },
  buildModules: [
    '@nuxtjs/vuetify'
  ],
  vuetify: {
    lang: {
      locales: { pl },
      current: 'pl'
    }
  },
  router: {
    middleware: ['auth']
  },
  plugins: ['~/plugins/feathers-vuex']
}