import pl from "vuetify/es5/locale/pl";

export default {
  mode: "spa",
  build: {
    transpile: ["feathers-vuex"]
  },
  buildModules: ["@nuxtjs/vuetify"],
  vuetify: {
    lang: {
      locales: { pl },
      current: "pl"
    }
  },
  router: {
    middleware: ["auth"]
  },
  plugins: ["~/plugins/feathers-vuex.js", "~/plugins/vue2-editor", "~/plugins/vuetify-theme-cache.js"],
  generate: {
    fallback: "/translations"
  }
};
