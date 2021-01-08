import pl from "vuetify/es5/locale/pl";
import path from "path";
import fs from "fs";

const result = require("dotenv").config();

if (result.error) {
  throw result.error;
}

export default {
  dev: process.env.NODE_ENV !== "production",
  ssr: false,
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
    server: {
      https: {
        key: fs.readFileSync(
          path.resolve(process.env.SSL_KEY_PATH, process.env.SSL_KEY)
        ),
        cert: fs.readFileSync(
          path.resolve(process.env.SSL_CERT_PATH, process.env.SSL_CERT)
        )
      }
    }
  })
};
