import { Component, Vue } from "vue-property-decorator";
import { Auth } from "aws-amplify";
import { CognitoUser } from "amazon-cognito-identity-js";
import router from "@/router";
import VueStore from "@/store";
import AppSyncComponent from "@/components/appSync/AppSync.vue";

@Component({
  components: {
    AppSyncComponent
  }
})
export default class Home extends Vue {
  public homeTitle: string = "Amplify Vue Demo";

  public created() {
    Auth.currentAuthenticatedUser().then((user: CognitoUser) => {
      VueStore.commit("setUserID", user.getUsername());
    });
  }

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
