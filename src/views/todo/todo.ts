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
    TODO: [
      {
        title: "TODO Task 1",
        status: "TODO"
      },
      {
        title: "TODO Task 2",
        status: "TODO"
      },
      {
        title: "TODO Task 3",
        status: "TODO"
      }
    ],
    Doing: [
      {
        title: "Doing Task 1",
        status: "Doing"
      }
    ],
    Check: [
      {
        title: "Check Task 1",
        status: "Check"
      },
      {
        title: "Check Task 2",
        status: "Check"
      }
    ],
    Done: [
      {
        title: "Done Task 1",
        status: "Done"
      },
      {
        title: "Done Task 2",
        status: "Done"
      },
      {
        title: "Done Task 3",
        status: "Done"
      },
      {
        title: "Done Task 4",
        status: "Done"
      }
    ]
  };

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
              status: "${taskStatus}"
            }
          ) {
            ${todoTaskItems}
          }
        }
      `;
      console.log(gqlParams);
      const result: any = await API.graphql(graphqlOperation(gqlParams));
      console.log(result);
      this.todoTasks[taskStatus].push(result.data.createTodoTask);
    } catch (err) {
      console.error(err);
    }
  }
}
