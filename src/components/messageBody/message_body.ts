import { Component, Vue, Prop } from "vue-property-decorator";
import VueStore from "@/store";
import { API, graphqlOperation } from "aws-amplify";

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
  @Prop() public chatMessage: ChatMessagesType;

  public displayDeleteBadge: boolean = false;

  public checkUserID() {
    return this.chatMessage.user_id === VueStore.state.userID;
  }

  /**
   * チャットメッセージのClassを切り替える
   * @param user_id
   */
  public checkMessgeClass() {
    if (this.checkUserID()) {
      return "my-message";
    } else {
      return "others-message";
    }
  }

  public changeDisplayDeleteBadge() {
    if (this.checkUserID()) {
      this.displayDeleteBadge = !this.displayDeleteBadge;
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
