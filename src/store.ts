import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userID: ""
  },
  mutations: {
    setUserID(state, id) {
      state.userID = id;
    }
  },
  actions: {}
});
