import { Component, Vue } from "vue-property-decorator";
import { API, graphqlOperation } from "aws-amplify";
import VueStore from "@/store";
import draggable from "vuedraggable";
import uuidv4 from "uuid/v4";
import TodoTaskComponent from "@/components/todoTask/TodoTask.vue";
import { TaskType } from "@/interfaces";

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

  public todoTasks: {[key: string]: TaskType[]} = {
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
    console.log(VueStore.state.user);
  }

  /**
   * Task取得
   */
  public async queryTasks() {
    try {
      console.log("get Tasks");
      const params: string = `
        query get {
          getTaskContents(room_id: "all") {
            room_id,
            tasks
          }
        }
      `;
      const result: any = await API.graphql(graphqlOperation(params));
      if (result.data.getTaskContents !== null) {
        const taskContents: {[key: string]: TaskType[]} = JSON.parse(result.data.getTaskContents.tasks);
        Object.keys(this.todoTasks).forEach((key: string) => {
          this.todoTasks[key] = taskContents[key];
        });
        console.log(this.todoTasks);
      } else {
        this.createTask();
      }
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Task作成
   */
  public async createTask() {
    try {
      const params: string = `
        mutation create {
          createTaskContents(
            input: {
              room_id: "all",
              tasks: {
                TODO: [],
                Doing: [],
                Check: [],
                Done: []
              }
            }
          ) {
            room_id
          }
        }
      `;
      await API.graphql(graphqlOperation(params));
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Task更新
   * @param {String} taskStatus
   */
  public async updateTask(taskStatus: string) {
    try {
      const updateTasks: {[key: string]: TaskType[]} = this.todoTasks;
      updateTasks[taskStatus].push(
        {
          task_id: String(uuidv4()),
          title: `${taskStatus} test`,
          description: "hogehoge",
          create_user: VueStore.state.displayName
        }
      );
      this.makeTasksBody(updateTasks[taskStatus]);

      const params: string = `
        mutation update {
          updateTaskContents(
            input: {
              room_id: "all",
              tasks: {
                TODO: [${this.makeTasksBody(updateTasks["TODO"])}],
                Doing: [${this.makeTasksBody(updateTasks["Doing"])}],
                Check: [${this.makeTasksBody(updateTasks["Check"])}],
                Done: [${this.makeTasksBody(updateTasks["Done"])}]
              }
            }
          ) {
            room_id,
            tasks
          }
        }
      `;

      const result: any = await API.graphql(graphqlOperation(params));
      this.todoTasks = JSON.parse(result.data.updateTaskContents.tasks);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Taskの Object/Array を文字列に変換
   * @param {TaskType[]} tasks
   */
  public makeTasksBody(tasks: TaskType[]) {
    console.log(tasks);
    let returnBody: string = "";
    for (const task of tasks) {
      returnBody += `
        {
          task_id: "${task.task_id}",
          title: "${task.title}",
          description: "${task.description}",
          create_user: "${task.create_user}"
        }
      `;
    }
    console.log(returnBody);
    return returnBody;
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
