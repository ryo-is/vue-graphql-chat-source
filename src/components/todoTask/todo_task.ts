import { Component, Vue, Prop } from "vue-property-decorator";
import { TodoTaskType } from "@/interfaces";

@Component({})
export default class TodoTaskComponent extends Vue {
  @Prop() public todoTaskItem: TodoTaskType;
}
