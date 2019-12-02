import Vuex from 'vuex'
import feathersClient from '../feathers-client'
import feathersVuex, { initAuth } from 'feathers-vuex'

const { makeAuthPlugin } = feathersVuex(feathersClient)

const requireModule = require.context(
  // The path where the service modules live
  './services',
  // Whether to look in subfolders
  false,
  // Only include .js files (prevents duplicate imports`)
  /.js$/
)
const servicePlugins = requireModule
  .keys()
  .map(modulePath => requireModule(modulePath).default)

const createStore = () => {
  return new Vuex.Store({
    state: {},
    mutations: {
      increment(state) {
        state.counter++
      }
    },
    actions: {
      nuxtServerInit({ commit, dispatch }, { req }) {
        return initAuth({
          commit,
          dispatch,
          req,
          feathersClient,
          moduleName: 'auth',
          cookieName: 'feathers-jwt'
        })
      }
    },
    plugins: [
      ...servicePlugins,
      // service('courses'),
      makeAuthPlugin({
        userService: 'users',
        state: {
          publicPages: ['login', 'first-user']
        }
      })
    ]
  })
}

export default createStore