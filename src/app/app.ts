import { Component, Vue } from "vue-property-decorator";
import { components } from "aws-amplify-vue";
import { AmplifyEventBus } from "aws-amplify-vue";
import { Auth } from "aws-amplify";
import { CognitoUser } from "amazon-cognito-identity-js";
import router from "@/router";
import VueStore from "@/store";
import { ChatUsers, chatUsersType } from "./scripts/chat_users";

@Component({
  components: {
    ...components
  }
})
export default class App extends Vue {
  public created() {
    // AmplifyEventBus Auth周りの処理を分岐するため
    AmplifyEventBus.$on("authState", (info: string) => {
      console.log(info);
      if (info === "signedIn") {
        this.writeLastLogin();
        router.push("/");
      } else if (info === "signedOut") {
        console.log(this.$route.path);
        if (this.$route.path === "/auth") {
          this.$children[0].$data.displayMenu = "signIn";
        } else {
          router.push("/auth");
        }
      } else {
        this.$children[0].$data.displayMenu = (info === "signedOut") ? "signIn" : info;
      }
    });
  }

  /**
   * ログイン時間を更新
   */
  public async writeLastLogin() {
    const user: CognitoUser = await Auth.currentAuthenticatedUser();
    VueStore.commit("setUserID", user.getUsername());
    const currentUser: chatUsersType | null = await ChatUsers.getChatUsers();
    console.log(currentUser);
    if (currentUser === null) {
      await ChatUsers.createChatUser();
    } else {
      await ChatUsers.updateChatUser();
    }
  }
}
