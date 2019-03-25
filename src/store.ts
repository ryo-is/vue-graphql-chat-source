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
    setTaskIds(state, user: ChatUsersType) {
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
