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

const chatMassageType: string = `
user_id,
create_time,
message_body
`;

@Component({
  components: {
    MessageBodyComponent
  }
})
export default class AppSyncComponent extends Vue {
  public appSyncTitle: string = "GraphQL Chat App";
  public chatMessages: ChatMessagesType[] = [];
  public displayButton: boolean = true;
  public othersChatMessages: ChatMessagesType[] = [];
  public myChatMessages: ChatMessagesType[] = [];
  public putMessage: string = "";
  public messageClass: string = "others-message";
  public editMessageTime: string = "";
  public subCreateChatMessageClient: any = null;
  public subCreateChatMessageObservable: Observable<object> | null = null;
  public subDeleteChatMessageClient: any = null;
  public subDeleteChatMessageObservable: Observable<object> | null = null;
  public subUpdateChatMessageClient: any = null;
  public subUpdateChatMessageObservable: Observable<object> | null = null;

  public async created() {
    await this.createGqlSubscriber();
    await this.deleteGqlSubscriber();
    await this.updateGqlSubscriber();
    await this.getMessages();
  }

  public updated() {
    // メッセージが増えるたびに一番下までスクロールする
    document.querySelector("#lastChatMessage").scrollIntoView(false);
  }

  /**
   * メッセージ新規作成のsubscribe
   */
  private async createGqlSubscriber() {
    const gqlParams: string = `
      subscription subCreateChatMessage {
        onCreateChatMessage {
          ${chatMassageType}
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

  private async updateGqlSubscriber() {
    const gqlParams: string = `
      subscription subUpdateChatMessage {
        onUpdateChatMessage {
          ${chatMassageType}
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
          ${chatMassageType}
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
        listChatMessages(limit: 50) {
          items {
            ${chatMassageType}
          }
        }
      }
    `;
    const result: any = await API.graphql(graphqlOperation(gqlParams));
    const messages: ChatMessagesType[] = result.data.listChatMessages.items;
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
            message_body: "${this.putMessage}"
          }
        ) {
          ${chatMassageType}
        }
      }
    `;
    await API.graphql(graphqlOperation(gqlParams));
    this.putMessage = "";
  }

  public async updateMessage() {
    const targetMessageComponent: any = this.$refs[this.editMessageTime] as MessageBodyComponent[];
    await targetMessageComponent[0].editMessage(this.putMessage);
    this.putMessage = "";
    this.displayButton = true;
  }
}
