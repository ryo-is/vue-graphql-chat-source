import { Component, Vue } from "vue-property-decorator";
import { Auth } from "aws-amplify";
import axios from "axios";
import router from "@/router";
import AppSyncComponent from "@/components/appSync/AppSync.vue";
import awsExports from "@/aws-exports";
const CognitoBaseURL: string = awsExports.oauth.CognitoBaseURL;
const CognitoAppClientID: string = awsExports.oauth.CognitoAppClientID;
const RedirectURI: string = awsExports.oauth.RedirectURI;

@Component({
  components: {
    AppSyncComponent
  }
})
export default class Home extends Vue {
  public homeTitle: string = "Amplify Vue Demo"; // Page title

  public created() {
    const code: string = this.$route.query.code as string;
    if (localStorage.getItem("loginStatus") !== "logined") {
      if (code) {
        this.getTokenAndUserInfo(code);
      } else {
        return router.push("/auth");
      }
    }
  }

  /**
   * 外部IDプロバイダ認証時にTokenやユーザ情報を取得する
   * @param {String} code
   */
  public getTokenAndUserInfo(code: string) {
    const localStorageMainKey: string = "CognitoIdentityServiceProvider." + CognitoAppClientID;
    const params: URLSearchParams = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("redirect_uri", RedirectURI);
    params.append("code", code);
    params.append("client_id", CognitoAppClientID);

    // Tokenの取得
    axios.post(CognitoBaseURL + "/oauth2/token", params, {
      headers : {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then((token: any) => {
      const bearer: string = "Bearer " + token.data.access_token;
      // ユーザー情報の取得
      axios.post(CognitoBaseURL + "/oauth2/userInfo", {}, {
        headers : {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": bearer
        }
      }).then((userInfo: any) => {
        const localStorageSubKey: string = localStorageMainKey + "." + userInfo.data.username;
        localStorage.setItem(localStorageSubKey + ".accessToken", token.data.access_token);
        localStorage.setItem(localStorageSubKey + ".idToken", token.data.id_token);
        localStorage.setItem(localStorageSubKey + ".refreshToken", token.data.refresh_token);
        localStorage.setItem(localStorageSubKey + ".clockDrift", "0");
        localStorage.setItem(localStorageMainKey + ".LastAuthUser", userInfo.data.username);
        localStorage.setItem("loginStatus", "logined");
      });
    }).catch((err: any) => {
      console.error(err);
    });
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
      return router.push("/auth");
    }).catch((err: any) => {
      console.error(err);
    });
  }
}
