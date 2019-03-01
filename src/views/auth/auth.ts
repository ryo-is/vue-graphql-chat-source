import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class Auth extends Vue {
  public displayMenu: string = "signIn";
  public authTitle: string = "GraphQL Chat App";
  public signUpConfig = {
    hiddenDefaults: ["phone_number"]
  };
  public userName: string = "";
  public password: string = "";
}
