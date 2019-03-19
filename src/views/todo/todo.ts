import { Component, Vue } from "vue-property-decorator";
import { API, graphqlOperation } from "aws-amplify";
import VueStore from "@/store";
import draggable from "vuedraggable";
import uuidv4 from "uuid/v4";
import TodoTaskComponent from "@/components/todoTask/TodoTask.vue";
import { TodoTaskType } from "@/interfaces";

const todoTaskItems: string = `
user_id
task_id
title
status
priority
`;

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
    TODO: [],
    Doing: [],
    Check: [],
    Done: []
  };

  public created() {
    this.queryTasks();
  }

  /**
   * ドラッグ開始時の処理
   */
  public dragStart() {
    console.log(this);
  }

  /**
   * ドラッグ終了時の処理
   */
  public dragEnd() {
    console.log(this.todoTasks);
  }

  /**
   * Task作成
   * @param {String} taskStatus
   */
  public async createTask(taskStatus: string) {
    try {
      console.log("create task", taskStatus);
      const gqlParams: string = `
        mutation create {
          createTodoTask(
            input: {
              user_id: "${VueStore.state.displayName}",
              task_id: "${uuidv4()}",
              title: "New Task",
              status: "${taskStatus}",
              priority: ${this.todoTasks[taskStatus].length + 1}
            }
          ) {
            ${todoTaskItems}
          }
        }
      `;
      const result: any = await API.graphql(graphqlOperation(gqlParams));
      console.log(result);
      this.todoTasks[taskStatus].push(result.data.createTodoTask);
    } catch (err) {
      console.error(err);
    }
  }

  public async queryTasks() {
    const gqlParams: string = `
      query queryTasks {
        queryTodoTasks(user_id: "${VueStore.state.displayName}") {
          items {
            ${todoTaskItems}
          }
        }
      }
    `;
    const result: any = await API.graphql(graphqlOperation(gqlParams));
    const tasks: TodoTaskType[] = result.data.queryTodoTasks.items;
    // 取得したTasksを各Statusにpush
    for (const task of tasks) {
      this.todoTasks[task.status].push(task);
    }
    // priorityでsort(昇順)
    Object.keys(this.todoTasks).forEach((key: string) => {
      this.todoTasks[key] = this.todoTasks[key].sort((a, b) => {
        return a.priority - b.priority;
      });
    });
  }
}
