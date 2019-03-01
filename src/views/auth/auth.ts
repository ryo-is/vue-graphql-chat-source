import { Component, Vue, Prop } from "vue-property-decorator";
import VueStore from "@/store";
import router from "@/router";
import { Auth } from "aws-amplify";
import { SignUpParams } from "@aws-amplify/auth/lib/types/Auth";
import {
  CognitoUser,
  ISignUpResult
 } from "amazon-cognito-identity-js";
import { ChatUsers, chatUsersType } from "./scripts/chat_users";

@Component({})
export default class AuthComponent extends Vue {
  public displayMenu: string = "signIn";
  public authTitle: string = "GraphQL Chat App";
  public signUpConfig = {
    hiddenDefaults: ["phone_number"]
  };
  public userName: string = "";
  public signUpUserName: string = "";
  public password: string = "";
  public signUpPassword: string = "";
  public newPassword: string = "";
  public email: string = "";
  public code: string = "";
  public confirmationCode: string = "";

  /**
   * 表示する項目を切り替える
   * @param {String} menu
   */
  public changeAuthViews(menu: string) {
    this.displayMenu = menu;
  }

  /**
   * SignIn処理
   * 成功時はUserIDをStoreにCommitし、最終ログイン時間を更新
   */
  public async signIn() {
    try {
      const user: CognitoUser = await Auth.signIn(this.userName, this.password);
      VueStore.commit("setUserID", user.getUsername());
      const currentUser: chatUsersType | null = await ChatUsers.getChatUsers();
      console.log(currentUser);
      if (currentUser === null) {
        await ChatUsers.createChatUser();
      } else {
        await ChatUsers.updateChatUser();
      }
      return router.push("/");
    } catch (err) {
      console.error(err);
    }
  }

  public async signUp() {
    try {
      const params: SignUpParams = {
        username: this.signUpUserName,
        password: this.signUpPassword,
        attributes: {
          email: this.email
        },
        validationData: []
      };
      const signUpUser: ISignUpResult = await Auth.signUp(params);
      console.log(signUpUser);
      this.changeAuthViews("confirmSignUp");
    } catch (err) {
      console.error(err);
    }
  }

  public async confirmSignUp() {
    try {
      const result: any = await Auth.confirmSignUp(this.signUpUserName, this.confirmationCode);
      console.log(result);
      this.changeAuthViews("signIn");
    } catch (err) {
      console.error(err);
    }
  }
}
