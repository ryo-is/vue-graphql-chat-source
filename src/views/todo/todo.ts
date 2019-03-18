import { Component, Vue } from "vue-property-decorator";
import TodoTaskComponent from "@/components/todoTask/TodoTask.vue";

@Component({
  components: {
    TodoTaskComponent
  }
})
export default class TodoComponent extends Vue {
  public taskStatuses: string[] = ["TODO", "Doing", "Check", "Done"];
}
