import { Component, Vue } from "vue-property-decorator";
import TodoTaskComponent from "@/components/todoTask/TodoTask.vue";
import { TodoTaskType } from "@/interfaces";

const draggable: any = require("vuedraggable");

@Component({
  components: {
    draggable,
    TodoTaskComponent
  }
})
export default class TodoComponent extends Vue {
  public options: any = {
    animation: 200,
    draggable: ".todo-task",
    handle: ".todo-task",
    group: "task",
    scrollSensitivity: 200,
    scrollSpeed: 30,
  };

  // Lambdaかクライアント側で生成する必要がある
  public todoTasks: {[key: string]: TodoTaskType[]} = {
    TODO: [
      {
        title: "TODO Task 1"
      },
      {
        title: "TODO Task 2"
      },
      {
        title: "TODO Task 3"
      }
    ],
    Doing: [
      {
        title: "Doing Task 1"
      }
    ],
    Check: [
      {
        title: "Check Task 1"
      },
      {
        title: "Check Task 2"
      }
    ],
    Done: [
      {
        title: "Done Task 1"
      },
      {
        title: "Done Task 2"
      },
      {
        title: "Done Task 3"
      },
      {
        title: "Done Task 4"
      }
    ]
  };

  public dragEnd() {
    console.log(this.todoTasks);
  }
}
