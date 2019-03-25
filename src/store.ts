import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import initialState from "./initial_state";
import { ChatUsersType } from "@/interfaces";

Vue.use(Vuex);

export default new Vuex.Store({
  state: initialState,
  mutations: {
    resetStore(state) {
      Object.assign(state, JSON.parse(localStorage.getItem("initialState")));
    },
    setUserID(state, id: string) {
      state.userID = id;
    },
    setDisplayName(state, name: string) {
      state.displayName = name;
    },
    setUser(state, user: ChatUsersType) {
      state.user = user;
    }
  },
  plugins: [createPersistedState()],
  actions: {}
});
