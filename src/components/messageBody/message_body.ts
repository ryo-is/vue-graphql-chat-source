import { Component, Vue, Prop } from "vue-property-decorator";
import VueStore from "@/store";
import { API, graphqlOperation } from "aws-amplify";
import AppSyncComponent from "../appSync/AppSync.vue";

interface ChatMessagesType {
  user_id: string;
  create_time: string;
  message_body: string;
}

const chatMassageType: string = `
user_id,
create_time,
message_body
`;

@Component({})
export default class MessageBodyComponent extends Vue {
  @Prop() public chatMessage: ChatMessagesType; // Chat message value

  public displayControlArea: boolean = false; // Display edit / delete icon flug
  public editIcon: boolean = true; // Display exit edit icon

  /**
   * ユーザID判定
   */
  public checkUserID() {
    return this.chatMessage.user_id === VueStore.state.userID;
  }

  /**
   * チャットメッセージのClassを切り替える
   */
  public checkMessgeClass() {
    if (this.checkUserID()) {
      return "my-message";
    } else {
      return "others-message";
    }
  }

  /**
   * メッセージ操作アイコンの位置決め
   */
  public checkIconPosition() {
    if (this.checkUserID()) {
      return "end";
    } else {
      return "start";
    }
  }

  /**
   * メッセージ操作アイコンの表示切り替え
   */
  public changeDisplayControlIconArea() {
    if (this.checkUserID()) {
      this.displayControlArea = !this.displayControlArea;
    }
  }

  /**
   * チャットメッセージ編集モードの開始
   */
  public changeEditMode() {
    const parentComponent: AppSyncComponent = this.$parent.$parent.$parent.$parent.$parent as AppSyncComponent;
    parentComponent.$data.putMessage = this.chatMessage.message_body;
    parentComponent.$data.editMessageTime = this.chatMessage.create_time;
    parentComponent.$data.displayButton = false;
    this.editIcon = !this.editIcon;
  }

  /**
   * チャットメッセージ編集モードの終了
   */
  public exitEditMode() {
    const parentComponent: AppSyncComponent = this.$parent.$parent.$parent.$parent.$parent as AppSyncComponent;
    parentComponent.$data.putMessage = "";
    parentComponent.$data.editMessageTime = "";
    parentComponent.$data.displayButton = true;
    this.displayControlArea = !this.displayControlArea;
    this.editIcon = !this.editIcon;
  }

  /**
   * チャットメッセージの編集
   * @param messageBody
   */
  public async editMessage(messageBody: string) {
    if (this.checkUserID()) {
      const gqlParams: string = `
        mutation update {
          updateChatMessage(
            input: {
              user_id: "${this.chatMessage.user_id}",
              create_time: "${this.chatMessage.create_time}"
              message_body: "${messageBody}"
            }
          ) {
            ${chatMassageType}
          }
        }
      `;
      await API.graphql(graphqlOperation(gqlParams));
      this.displayControlArea = !this.displayControlArea;
      this.editIcon = !this.editIcon;
    } else {
      return;
    }
  }

  /**
   * チャットメッセージの削除
   */
  public async deleteMessage() {
    if (this.checkUserID()) {
      const gqlParams: string = `
        mutation delete {
          deleteChatMessage(
            input: {
              user_id: "${this.chatMessage.user_id}",
              create_time: "${this.chatMessage.create_time}"
            }
          ) {
            ${chatMassageType}
          }
        }
      `;
      await API.graphql(graphqlOperation(gqlParams));
    } else {
      return;
    }
  }
}
