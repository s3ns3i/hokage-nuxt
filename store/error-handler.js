export const state = () => ({
  message: ""
});

export const mutations = {
  ADD_ERROR_MESSAGE(state, { message }) {
    state.message = message;
  },

  REMOVE_ERROR_MESSAGE(state) {
    state.message = "";
  }
};

export const actions = {
  addErrorMessage({ commit }, payload) {
    commit("ADD_ERROR_MESSAGE", payload);
  },

  removeErrorMessage({ commit }) {
    commit("REMOVE_ERROR_MESSAGE");
  }
};

export const getters = {
  getErrorMessage: state => state.message
};
