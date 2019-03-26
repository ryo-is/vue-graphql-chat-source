import { Component, Vue } from "vue-property-decorator";
import { API, graphqlOperation } from "aws-amplify";
import VueStore from "@/store";
import draggable from "vuedraggable";
import uuidv4 from "uuid/v4";
import TodoTaskComponent from "@/components/todoTask/TodoTask.vue";
import { TodoTaskType, ChatUsersType } from "@/interfaces";

const todoTaskItems: string = `
user_id
task_id
title
status
`;

const chatUsersItems: string = `
user_id,
last_login,
display_name
todo_task_ids
doing_task_ids
check_task_ids
done_task_ids
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
    handle: ".todo-task",
    scrollSensitivity: 200,
    scrollSpeed: 30,
  };

  public todoTaskIDs: string[] = [];
  public todoTaskStatuses: string[] = ["TODO", "Doing", "Check", "Done"];
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
      const promises: any[] = [];
      const taskID: string = uuidv4();
      const taskKey: string = this.checkTaskIDs(taskStatus).key;
      const taskIDs: string[] = this.checkTaskIDs(taskStatus).store;
      taskIDs.push(taskID);

      const gqlUserParams: string = this.makeUpdateUserParams(taskKey, taskIDs);
      promises.push(API.graphql(graphqlOperation(gqlUserParams)));

      const gqlTaskParams: string = this.makeCreateTaskParams(taskID, taskStatus);
      promises.push(API.graphql(graphqlOperation(gqlTaskParams)));

      const result: any = await Promise.all(promises);
      VueStore.commit("setUser", result[0].data.updateChatUsers);
      this.todoTasks[taskStatus].push(result[1].data.createTodoTask);
    } catch (err) {
      console.error(err);
    }
  }

  public checkTaskIDs(taskStatus: string) {
    const user: ChatUsersType = VueStore.state.user;
    switch (taskStatus) {
      case "Doing":
        return {
          key: "doing_task_ids",
          store: (user.doing_task_ids === null) ? [] : user.doing_task_ids
        };
      case "Check":
        return {
          key: "check_task_ids",
          store: (user.check_task_ids === null) ? [] : user.check_task_ids
        };
      case "Done":
        return {
          key: "done_task_ids",
          store: (user.done_task_ids === null) ? [] : user.done_task_ids
        };
      default:
        return {
          key: "todo_task_ids",
          store: (user.todo_task_ids === null) ? [] : user.todo_task_ids
        };
    }
  }

  /**
   * Task取得
   */
  public async queryTasks() {
    const gqlParams: string = `
      query queryTasks {
        queryTodoTasks(user_id: "${VueStore.state.userID}") {
          items {
            ${todoTaskItems}
          }
        }
      }
    `;
    const result: any = await API.graphql(graphqlOperation(gqlParams));
    const tasks: TodoTaskType[] = result.data.queryTodoTasks.items;
    const user: ChatUsersType = VueStore.state.user;
    // 取得したTasksを各Statusにpush
    for (const task of tasks) {
      switch (task.status) {
        case "TODO":
          for (const id of user.todo_task_ids) {
            if (id === task.task_id) {
              this.todoTasks.TODO.push(task);
              break;
            }
          }
          break;
        case "Doing":
          for (const id of user.doing_task_ids) {
            if (id === task.task_id) {
              this.todoTasks.Doing.push(task);
              break;
            }
          }
          break;
        case "Check":
          for (const id of user.check_task_ids) {
            if (id === task.task_id) {
              this.todoTasks.Check.push(task);
              break;
            }
          }
          break;
        default:
          for (const id of user.done_task_ids) {
            if (id === task.task_id) {
              this.todoTasks.Done.push(task);
              break;
            }
          }
          break;
      }
    }
  }

  /**
   * ユーザー情報を更新するGQLBody生成
   * @param {String} taskKey
   * @param {String[]} taskIDs
   */
  public makeUpdateUserParams(taskKey: string, taskIDs: string[]) {
    return `
      mutation updateUser {
        updateChatUsers(
          input: {
            user_id: "${VueStore.state.userID}",
            ${taskKey}: ${this.makeArrayBody(taskIDs)}
          }
        ) {
          ${chatUsersItems}
        }
      }
    `;
  }

  /**
   * Task作成するGQLBody生成
   * @param {String} taskID
   * @param {String} taskStatus
   */
  public makeCreateTaskParams(taskID: string, taskStatus: string) {
    return `
      mutation createTask {
        createTodoTask(
          input: {
            user_id: "${VueStore.state.userID}",
            task_id: "${taskID}",
            title: "New Task",
            status: "${taskStatus}"
          }
        ) {
          ${todoTaskItems}
        }
      }
    `;
  }

  /**
   * 配列用生成用
   * @param array
   */
  public makeArrayBody(array: any[]) {
    let returnBody: string = "[";
    for (let i: number = 0; i < array.length; i++) {
      returnBody = `${returnBody}"${array[i]}"`;
      if (i !== array.length - 1) {
        returnBody += ",";
      }
    }
    return returnBody + "]";
  }
}
