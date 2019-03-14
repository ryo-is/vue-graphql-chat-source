import { Component, Vue } from "vue-property-decorator";
import { Auth } from "aws-amplify";
import router from "@/router";
import VueStore from "@/store";
import AppSyncComponent from "@/components/appSync/AppSync.vue";

@Component({
  components: {
    AppSyncComponent
  }
})
export default class Home extends Vue {
  public homeTitle: string = "Amplify Vue Demo"; // Page title

  public created() {
    const loginStatus: string = localStorage.getItem("loginStatus");
    if (loginStatus !== "logined") {
      return router.push("/auth");
    }
  }

  /**
   * サインアウト処理
   */
  public signOut() {
    Auth.signOut().then(() => {
      const appSyncComponent: AppSyncComponent = this.$refs.appSync as AppSyncComponent;
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
