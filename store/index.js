import { makeAuthPlugin } from "../plugins/feathers";
import { initAuth } from "feathers-vuex";

const auth = makeAuthPlugin({
  userService: "user",
  entityIdField: "id",
  state: {
    publicPages: ["login", "first-user", "error"]
  },
  actions: {
    // Handles initial authentication
    onInitAuth({ state, dispatch }, payload) {
      if (payload) {
        dispatch("authenticate", {
          strategy: "jwt",
          accessToken: state.accessToken
        })
          .then(result => {
            // handle success like a boss
            console.log("logged in");
          })
          .catch(error => {
            // handle error like a boss
            console.log(error);
          });
      }
    }
  }
});

const requireModule = require.context(
  // The path where the service modules live
  "./services",
  // Whether to look in subfolders
  false,
  // Only include .js files (prevents duplicate imports`)
  /.js$/
);
const servicePlugins = requireModule
  .keys()
  .map(modulePath => requireModule(modulePath).default);

export const mutations = {
  increment(state) {
    state.counter++;
  }
};
export const actions = {
  nuxtServerInit({ commit, dispatch }, { req }) {
    return initAuth({
      commit,
      dispatch,
      req,
      moduleName: "auth",
      cookieName: "feathers-jwt"
    });
  },
  nuxtClientInit({ state, dispatch }) {
    if (state.auth.accessToken) {
      return dispatch("auth/onInitAuth", state.auth.payload);
    }
  }
};
export const plugins = [...servicePlugins, auth];
