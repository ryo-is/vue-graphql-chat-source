import { Component, Vue } from "vue-property-decorator";
import { components } from "aws-amplify-vue";
import { AmplifyEventBus } from "aws-amplify-vue";
import router from "@/router";

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
}
