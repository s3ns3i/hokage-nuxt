import pl from "vuetify/es5/locale/pl";

export default {
  mode: "spa",
  build: {
    transpile: ["feathers-vuex"],
    loaders: {
      vue: {
        transformAssetUrls: {
          audio: "src"
        }
      }
    },
    extend(config) {
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]"
        }
      });
    }
  },
  buildModules: ["@nuxtjs/vuetify"],
  vuetify: {
    lang: {
      locales: { pl },
      current: "pl"
    },
    icons: {
      iconfont: "mdi"
    }
  },
  router: {
    middleware: ["auth"]
  },
  plugins: [
    "~/plugins/feathers-vuex.js",
    "~/plugins/vue2-editor",
    "~/plugins/vuetify-theme-cache.js"
  ],
  generate: {
    fallback: "/translations"
  }
};
