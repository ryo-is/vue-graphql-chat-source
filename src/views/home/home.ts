import { Component, Vue } from "vue-property-decorator";
import router from "@/router";
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
}
