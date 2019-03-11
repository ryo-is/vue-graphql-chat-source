import { Component, Vue } from "vue-property-decorator";
import VueStore from "@/store";
import { API, graphqlOperation } from "aws-amplify";
import Observable from "zen-observable";
import dayjs from "dayjs";
import MessageBodyComponent from "../messageBody/MessageBody.vue";

interface ChatMessagesType {
  user_id: string;
  create_time: string;
  message_body: string;
}

interface ChatUsersType {
  user_id: string;
  last_login: string;
  join_channels: string[];
  friend_menbers: string[];
}

const chatMassageItems: string = `
user_id,
create_time,
message_body
`;

const chatUsersItems: string = `
user_id,
last_login,
join_channels,
friend_menbers
`;

@Component({
  components: {
    MessageBodyComponent
  }
})
export default class AppSyncComponent extends Vue {
  public appSyncTitle: string = "Chat Room"; // Page title
  public chatUsers: string[] = []; // Chat users values
  public chatMessages: ChatMessagesType[] = []; // Chat messages values
  public displayInputMessageArea: boolean = false; // Display send message input area flug
  public othersChatMessages: ChatMessagesType[] = []; // Others chat message values
  public myChatMessages: ChatMessagesType[] = []; // My chat message values
  public displayName: string = ""; // Display name value
  public messageBody: string = ""; // Put chat message value
  public messageClass: string = "others-message"; // Message class value
  public editMessageTime: string = ""; // Edit message time value
  public subCreateChatMessageClient: any = null; // Create chat message subscription client
  public subCreateChatMessageObservable: Observable<object> | null = null; // Create chat message subscription observable
  public subDeleteChatMessageClient: any = null; // Delete chat message subscription client
  public subDeleteChatMessageObservable: Observable<object> | null = null; // Delete chat message subscription observable
  public subUpdateChatMessageClient: any = null; // Update chat message subscription client
  public subUpdateChatMessageObservable: Observable<object> | null = null; // Update chat message subscription observable

  public async created() {
    await this.listChatUser();
    const promises: any[] = [];
    promises.push(this.createGqlSubscriber());
    promises.push(this.deleteGqlSubscriber());
    promises.push(this.updateGqlSubscriber());
    promises.push(this.getMessages());
    Promise.all(promises);
  }

  public updated() {
    // メッセージが増えるたびに一番下までスクロールする
    document.querySelector("#lastChatMessage").scrollIntoView(false);
  }

  /**
   * 送信フォームを表示する
   */
  public displayForm() {
    this.displayInputMessageArea = true;
    this.displayName = VueStore.state.userID;
  }

  /**
   * 自分の表示名を判断する
   * @param {String} name
   */
  public checkMyName(name: string) {
    return name && name === VueStore.state.userID;
  }

  /**
   * メッセージ新規作成のsubscribe
   */
  private async createGqlSubscriber() {
    const gqlParams: string = `
      subscription subCreateChatMessage {
        onCreateChatMessage {
          ${chatMassageItems}
        }
      }
    `;
    this.subCreateChatMessageObservable = await API.graphql(graphqlOperation(gqlParams, {
      deleted: false
    })) as Observable<object>;
    this.subCreateChatMessageClient = this.subCreateChatMessageObservable.subscribe({
      next: (result: any) => {
        console.log(result.value.data);
        this.getMessages();
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  /**
   * メッセージ編集のsubscribe
   */
  private async updateGqlSubscriber() {
    const gqlParams: string = `
      subscription subUpdateChatMessage {
        onUpdateChatMessage {
          ${chatMassageItems}
        }
      }
    `;
    this.subUpdateChatMessageObservable = await API.graphql(graphqlOperation(gqlParams, {
      deleted: false
    })) as Observable<object>;
    this.subUpdateChatMessageClient = this.subUpdateChatMessageObservable.subscribe({
      next: (result: any) => {
        console.log(result.value.data);
        this.getMessages();
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  /**
   * メッセージ削除のsubscribe
   */
  private async deleteGqlSubscriber() {
    const gqlParams: string = `
      subscription subDeleteChatMessage {
        onDeleteChatMessage {
          ${chatMassageItems}
        }
      }
    `;
    this.subDeleteChatMessageObservable = await API.graphql(graphqlOperation(gqlParams, {
      deleted: false
    })) as Observable<object>;
    this.subDeleteChatMessageClient = this.subDeleteChatMessageObservable.subscribe({
      next: (result: any) => {
        console.log(result.value.data);
        this.getMessages();
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  /**
   * 最新50件分チャットメッセージを取得
   */
  private async getMessages() {
    const gqlParams: string = `
      query list {
        listChatMessages(limit: 1000) {
          items {
            ${chatMassageItems}
          }
        }
      }
    `;
    const result: any = await API.graphql(graphqlOperation(gqlParams));
    const messages: ChatMessagesType[] = result.data.listChatMessages.items;
    // 取得した配列の最新50件を昇順でsortする
    if (this.chatMessages.length > 50) {
      this.chatMessages.length = 50;
    }
    this.chatMessages = messages.sort((a, b) => {
      return dayjs(a.create_time).unix() - dayjs(b.create_time).unix();
    });
  }

  /**
   * チャットメッセージ送信
   */
  public async createMessage() {
    const gqlParams: string = `
      mutation put {
        createChatMessage(
          input: {
            user_id: "${VueStore.state.userID}",
            create_time: "${dayjs().format("YYYY-MM-DD HH:mm:ss")}",
            message_body: "${this.messageBody}"
          }
        ) {
          ${chatMassageItems}
        }
      }
    `;
    await API.graphql(graphqlOperation(gqlParams));
    this.messageBody = "";
    this.displayInputMessageArea = false;
  }

  /**
   * チャットメッセージの編集
   */
  public async updateMessage() {
    const targetMessageComponent: any = this.$refs[this.editMessageTime] as MessageBodyComponent[];
    await targetMessageComponent[0].editMessage(this.messageBody);
    this.messageBody = "";
    this.displayInputMessageArea = false;
  }

  /**
   * チャットユーザー取得
   */
  public async listChatUser() {
    const gqlParams: string = `
      query list {
        listChatUsers(limit: 1000) {
          items {
            ${chatUsersItems}
          }
        }
      }
    `;
    const result: any = await API.graphql(graphqlOperation(gqlParams));
    this.chatUsers = result.data.listChatUsers.items;
  }
}
