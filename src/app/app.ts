import { Component, Vue } from "vue-property-decorator";
import HeaderComponent from "@/components/header/Header.vue";

@Component({
  components: {
    HeaderComponent
  }
})
export default class App extends Vue {
  public displayHeaderComponent() {
    return this.$route.path !== "/auth";
  }

  public createRef() {
    if (this.$route.path === "/") {
      return "home";
    } else {
      return "";
    }
  }
}
