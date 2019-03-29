import { Component, Vue, Prop } from "vue-property-decorator";
import { TaskType } from "@/interfaces";

@Component({})
export default class TodoTaskComponent extends Vue {
  @Prop() public todoTaskItem: TaskType;
  @Prop() public taskStatus: string;
  @Prop() public taskIndex: number;
}
