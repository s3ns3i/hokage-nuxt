import pl from "vuetify/es5/locale/pl";
import path from "path";
import fs from "fs";

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
  head: {
    meta: [{ charset: "utf-8" }],
    title: "hokage"
  },
  buildModules: ["@nuxtjs/vuetify", "@nuxtjs/dotenv"],
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
  },
  ...(process.env.NODE_ENV === "production" && {
    env: {
      SOCKET_HOST: "https://hokage.onepiecenakama.pl", // production
      SOCKET_PORT: "30001", // production
      SOCKET_SECURE: true // production
    },
    server: {
      https: {
        key: fs.readFileSync(
          path.resolve(
            "../ssl/keys",
            "969cd_c3acb_e02d5936dbece98a4c9ebb23f6453167.key"
          )
        ),
        cert: fs.readFileSync(
          path.resolve(
            "../ssl/certs",
            "hokage_onepiecenakama_pl_969cd_c3acb_1607212799_0e3e7effb14cbe406076db0b710bba56.crt"
          )
        )
      }
    }
  }),
  ...(process.env.NODE_ENV = "dev" && {
    env: {
      SOCKET_HOST: "http://localhost",
      SOCKET_PORT: "3030",
      SOCKET_SECURE: false
    }
  })
};
