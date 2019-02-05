import Vue from "vue";
import App from "./app/App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

import ElementUI from "element-ui";
import locale from "element-ui/lib/locale/lang/ja";
import "../node_modules/element-ui/lib/theme-chalk/index.css";

import Amplify, * as AmplifyModules from "aws-amplify";
import { AmplifyPlugin } from "aws-amplify-vue";
import aws_exports from "./aws-exports";

Amplify.configure(aws_exports);
Vue.use(AmplifyPlugin, AmplifyModules);

Vue.config.productionTip = false;
Vue.use(ElementUI, { locale });

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
