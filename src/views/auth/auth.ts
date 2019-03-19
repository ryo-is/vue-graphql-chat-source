import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import VueStore from "@/store";
import router from "@/router";
import { Auth } from "aws-amplify";
import { SignUpParams } from "@aws-amplify/auth/lib/types/Auth";
import {
  ISignUpResult
 } from "amazon-cognito-identity-js";
import { ChatUsers } from "./scripts/chat_users";
import { ChatUsersType } from "@/interfaces";
import awsExports from "@/aws-exports.js";
const CognitoBaseURL: string = awsExports.oauth.CognitoBaseURL;
const CognitoAppClientID: string = awsExports.oauth.CognitoAppClientID;
const RedirectURI: string = awsExports.oauth.RedirectURI;

@Component({})
export default class AuthComponent extends Vue {
  public authTitle: string = "GraphQL Chat App"; // Page title
  public displayMenu: string = "signIn"; // Display form flug
  public userName: string = ""; // UserName input value
  public displayName: string = ""; // DisplayName input value
  public password: string = ""; // Password input value
  public signUpUserName: string = ""; // SignUp userName input value
  public signUpPassword: string = ""; // SignUp password input value
  public code: string = ""; // Confirm code value
  public email: string = ""; // User email input value
  public newPassword: string = ""; // Reset password value
  public confirmationCode: string = ""; // ComfirmationCode value
  public resetPasswordInput: boolean = false; // Display reset password input
  public displayLoadingLayer: boolean = false; // Display loading layer flug
  public registerDisplayNameForm: boolean = false; // Register display name form flug

  public created() {
    localStorage.setItem("loginStatus", "not login");
    const code: string = this.$route.query.code as string;
    if (code) {
      this.getTokenAndUserInfo(code);
    }
  }

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
      this.displayLoadingLayer = true;
      await Auth.signIn(this.userName, this.password);
      VueStore.commit("setUserID", this.userName);
      const currentUser: ChatUsersType | null = await ChatUsers.getChatUsers();
      if (currentUser === null) {
        this.registerDisplayNameForm = true;
      } else {
        const user: ChatUsersType = await ChatUsers.updateChatUser();
        VueStore.commit("setDisplayName", user.display_name);
        VueStore.commit("setTaskIds", user);
        localStorage.setItem("loginStatus", "logined");
        return router.push("/");
      }
    } catch (err) {
      console.error(err);
      this.displayLoadingLayer = false;
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

  /**
   * 外部プロバイダー認証
   * @param {String} provider
   */
  public linkOAuth(provider: string) {
    try {
      this.displayLoadingLayer = true;
      const targetURL: string =
      CognitoBaseURL +
      "/oauth2/authorize?response_type=code&client_id=" +
      CognitoAppClientID +
      "&redirect_uri=" +
      RedirectURI +
      "&identity_provider=" +
      provider;
      window.location.assign(targetURL);
    } catch (err) {
      this.displayLoadingLayer = false;
      console.error(err);
    }
  }

  /**
   * 外部IDプロバイダ認証時にTokenやユーザ情報を取得する
   * @param {String} code
   */
  public async getTokenAndUserInfo(code: string) {
    try {
      this.displayLoadingLayer = true;
      const localStorageMainKey: string = "CognitoIdentityServiceProvider." + CognitoAppClientID;
      const params: URLSearchParams = new URLSearchParams();
      params.append("grant_type", "authorization_code");
      params.append("redirect_uri", RedirectURI);
      params.append("code", code);
      params.append("client_id", CognitoAppClientID);

      // Tokenの取得
      const token: any = await axios.post(CognitoBaseURL + "/oauth2/token", params, {
        headers : {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      // bearerToken生成
      const bearer: string = "Bearer " + token.data.access_token;

      // ユーザ情報の取得
      const userInfo: any = await axios.post(CognitoBaseURL + "/oauth2/userInfo", {}, {
        headers : {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": bearer
        }
      });

      const localStorageSubKey: string = localStorageMainKey + "." + userInfo.data.username;
      localStorage.setItem(localStorageSubKey + ".accessToken", token.data.access_token);
      localStorage.setItem(localStorageSubKey + ".idToken", token.data.id_token);
      localStorage.setItem(localStorageSubKey + ".refreshToken", token.data.refresh_token);
      localStorage.setItem(localStorageSubKey + ".clockDrift", "0");
      localStorage.setItem(localStorageMainKey + ".LastAuthUser", userInfo.data.username);

      VueStore.commit("setUserID", userInfo.data.username);
      const currentUser: ChatUsersType | null = await ChatUsers.getChatUsers();
      console.log(currentUser);
      if (currentUser === null) {
        this.registerDisplayNameForm = true;
      } else {
        const user: ChatUsersType = await ChatUsers.updateChatUser();
        VueStore.commit("setDisplayName", user.display_name);
        VueStore.commit("setTaskIds", user);
        localStorage.setItem("loginStatus", "logined");
        return router.push("/");
      }
    } catch (err) {
      this.displayLoadingLayer = false;
      console.error(err);
    }
  }

  /**
   * 初回ログイン時のユーザー作成
   */
  public async createUser() {
    try {
      VueStore.commit("setDisplayName", this.displayName);
      await ChatUsers.createChatUser();
      localStorage.setItem("loginStatus", "logined");
      return router.push("/");
    } catch (err) {
      this.displayLoadingLayer = false;
      console.error(err);
    }
  }
}
