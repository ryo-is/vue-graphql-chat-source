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
  public authTitle: string = "GraphQL Chat App"; // Page title
  public displayMenu: string = "signIn"; // Display form flug
  public userName: string = ""; // UserName input value
  public password: string = ""; // Password input value
  public signUpUserName: string = ""; // SignUp userName input value
  public signUpPassword: string = ""; // SignUp password input value
  public code: string = ""; // Confirm code value
  public email: string = ""; // User email input value
  public newPassword: string = ""; // Reset password value
  public confirmationCode: string = ""; // ComfirmationCode value
  public resetPasswordInput: boolean = false; // Display reset password input

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
      await Auth.signIn(this.userName, this.password);
      VueStore.commit("setUserID", this.userName);
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

  /**
   * SignUp処理
   */
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

  /**
   * Confirm SignUp処理
   */
  public async confirmSignUp() {
    try {
      const result: any = await Auth.confirmSignUp(this.signUpUserName, this.confirmationCode);
      console.log(result);
      this.changeAuthViews("signIn");
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * パスワードリセット用のCode発行
   */
  public async sendResetCode() {
    try {
      await Auth.forgotPassword(this.userName);
      this.resetPasswordInput = true;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * パスワードリセット処理
   */
  public async resetPassword() {
    try {
      await Auth.forgotPasswordSubmit(this.userName, this.code, this.newPassword);
      this.changeAuthViews("signIn");
    } catch (err) {
      console.error(err);
    }
  }
}
