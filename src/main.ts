import Vue from "vue";
import App from "./app/App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import initialState from "./initial_state";

import ElementUI from "element-ui";
import locale from "element-ui/lib/locale/lang/ja";
import "../node_modules/element-ui/lib/theme-chalk/index.css";
import "./plugins/element.js";

import Amplify, * as AmplifyModules from "aws-amplify";
import { AmplifyPlugin } from "aws-amplify-vue";
import aws_exports from "./aws-exports";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(fas, far, fab);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Amplify.configure(aws_exports);
Vue.use(AmplifyPlugin, AmplifyModules);

Vue.config.productionTip = false;
Vue.use(ElementUI, { locale });

new Vue({
  router,
  store,
  render: (h) => h(App),
  created() {
    localStorage.setItem("initialState", JSON.stringify(initialState));
  },
}).$mount("#app");
