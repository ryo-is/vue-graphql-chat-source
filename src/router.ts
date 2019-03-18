import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/home/Home.vue";
import Todo from "@/views/todo/Todo.vue";
import Auth from "@/views/auth/Auth.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "todo",
      component: Todo
    },
    {
      path: "/home",
      name: "home",
      component: Home
    },
    {
      path: "/todo",
      name: "todo",
      component: Todo
    },
    {
      path: "/auth",
      name: "auth",
      component: Auth
    }
  ],
});
