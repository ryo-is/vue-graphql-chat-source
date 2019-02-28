import { Component, Vue } from "vue-property-decorator";
import { Auth } from "aws-amplify";
import router from "@/router";
import AppSyncComponent from "@/components/appSync/AppSync.vue";

@Component({
  components: {
    AppSyncComponent
  }
})
export default class Home extends Vue {
  public homeTitle: string = "Amplify Vue Demo";

  public signOut() {
    Auth.signOut().then(() => {
      const appSyncComponent: AppSyncComponent = this.$refs.appSync as AppSyncComponent;
      appSyncComponent.$data.subCreateChatMessageClient.unsubscribe();
      appSyncComponent.$data.subDeleteChatMessageClient.unsubscribe();
      appSyncComponent.$data.subUpdateChatMessageClient.unsubscribe();
      return router.push("/auth");
    }).catch((err: any) => {
      console.error(err);
    });
  }
}
