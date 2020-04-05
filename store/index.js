import Vuex from 'vuex'
import feathersClient, { makeAuthPlugin } from '../feathers-client'
import { initAuth } from 'feathers-vuex'

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
    state: {
      isTaskInProgress: false,
    },
    mutations: {
      increment(state) {
        state.counter++
      },
      set_is_task_in_progress(state, { isTaskInProgress }) {
        state.isTaskInProgress = isTaskInProgress;
      }
    },
    actions: {
      setIsTaskInProgress({ commit }, payload) {
        commit('set_is_task_in_progress', payload);
      },
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
    getters: {
      getIsTaskInProgress: state => state.isTaskInProgress
    },
    plugins: [
      ...servicePlugins,
      makeAuthPlugin({
        userService: 'user',
        state: {
          publicPages: ['login', 'first-user']
        }
      })
    ]
  })
}

export default createStore