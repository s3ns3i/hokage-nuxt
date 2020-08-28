import pl from "vuetify/es5/locale/pl";

export default {
  dev: process.env.NODE_ENV !== "production",
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
    base: "/hokage/",
    middleware: ["auth"]
  },
  plugins: [
    "~/plugins/feathers-vuex.js",
    "~/plugins/vue2-editor",
    "~/plugins/vuetify-theme-cache.js"
  ],
  generate: {
    fallback: "/translations"
  },
  env: {
    SOCKET_HOST: "localhost",
    SOCKET_PORT: "3030"
    // SOCKET_HOST: "68.66.226.86", // production
    // SOCKET_PORT: "30001" // production
  }
};
