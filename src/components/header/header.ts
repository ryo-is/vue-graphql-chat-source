import { Component, Vue } from "vue-property-decorator";
import { Auth } from "aws-amplify";
import router from "@/router";
import VueStore from "@/store";
import HomeComponent from "@/views/home/Home.vue";
import AppSyncComponent from "@/components/appSync/AppSync.vue";

@Component({})
export default class HeaderComponent extends Vue {

  /**
   * サインアウト処理
   */
  public signOut() {
    Auth.signOut().then(() => {
      const appSyncComponent: AppSyncComponent = (this.$parent.$refs.home as HomeComponent).$refs.appSync as AppSyncComponent;
      if (appSyncComponent.$data.subCreateChatMessageClient !== null) {
        appSyncComponent.$data.subCreateChatMessageClient.unsubscribe();
        appSyncComponent.$data.subDeleteChatMessageClient.unsubscribe();
        appSyncComponent.$data.subUpdateChatMessageClient.unsubscribe();
      }
      VueStore.commit("setUserID", "");
      return router.push("/auth");
    }).catch((err: any) => {
      console.error(err);
    });
  }
}
