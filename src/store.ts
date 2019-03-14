import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import initialState from "./initial_state";

Vue.use(Vuex);

export default new Vuex.Store({
  state: initialState,
  mutations: {
    resetStore(state) {
      Object.assign(state, JSON.parse(localStorage.getItem("initialState")));
    },
    setUserID(state, id) {
      state.userID = id;
    },
    setDisplayName(state, name) {
      state.displayName = name;
    }
  },
  plugins: [createPersistedState()],
  actions: {}
});
