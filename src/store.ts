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
    },
    setTaskIds(state, user) {
      if (user.todo_task_ids !== null) {
        state.todo_task_ids = user.todo_task_ids;
      }
      if (user.doing_task_ids !== null) {
        state.doing_task_ids = user.doing_task_ids;
      }
      if (user.check_task_ids !== null) {
        state.check_task_ids = user.check_task_ids;
      }
      if (user.done_task_ids !== null) {
        state.done_task_ids = user.done_task_ids;
      }
    }
  },
  plugins: [createPersistedState()],
  actions: {}
});
