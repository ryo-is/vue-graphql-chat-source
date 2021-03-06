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
  public displayCreateTaskModal: boolean = false;
  public selectedTaskStatus: string = "";
  public inputTaskTitle: string = "";
  public inputTaskDescription: string = "";

  public created() {
    this.queryTasks();
  }

  /**
   * ドラッグ終了時の処理
   */
  public dragEnd() {
    this.updateTask();
  }

  /**
   * Task取得
   */
  public async queryTasks() {
    try {
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
   * Task追加
   */
  public addTask() {
    try {
      const updateTasks: {[key: string]: TaskType[]} = this.todoTasks;
      updateTasks[this.selectedTaskStatus].push(
        {
          task_id: String(uuidv4()),
          title: `${this.inputTaskTitle}`,
          description: `${this.inputTaskDescription}`,
          create_user: VueStore.state.displayName
        }
      );

      this.updateTask();
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Task更新
   */
  public async updateTask() {
    try {
      const updateTasks: {[key: string]: TaskType[]} = this.todoTasks;
      const params: string = this.makeUpdateTaskGqlParams(updateTasks);
      const result: any = await API.graphql(graphqlOperation(params));
      const taskContents: {[key: string]: TaskType[]} = JSON.parse(result.data.updateTaskContents.tasks);
      Object.keys(this.todoTasks).forEach((key: string) => {
        this.todoTasks[key] = taskContents[key];
      });
    } catch (err) {
      console.error(err);
    } finally {
      this.displayCreateTaskModal = false;
      this.inputTaskTitle = "";
      this.inputTaskDescription = "";
    }
  }

  /**
   * Task削除
   * @param {String} taskStatus
   * @param {String} taskIndex
   */
  public async deleteTask(taskStatus: string, taskIndex: number) {
    try {
      const deletedTasks: {[key: string]: TaskType[]} = this.todoTasks;
      deletedTasks[taskStatus].splice(taskIndex, 1);
      console.log(deletedTasks);
      const params: string = this.makeUpdateTaskGqlParams(deletedTasks);
      const result: any = await API.graphql(graphqlOperation(params));
      const taskContents: {[key: string]: TaskType[]} = JSON.parse(result.data.updateTaskContents.tasks);
      Object.keys(this.todoTasks).forEach((key: string) => {
        this.todoTasks[key] = taskContents[key];
      });
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Task追加/更新用のPamameter生成
   * @param updateTasks
   */
  public makeUpdateTaskGqlParams(updateTasks: {[key: string]: TaskType[]}) {
    return `
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
  }

  /**
   * Taskの Object/Array を文字列に変換
   * @param {TaskType[]} tasks
   */
  public makeTasksBody(tasks: TaskType[]) {
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
