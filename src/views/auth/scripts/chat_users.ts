import { API, graphqlOperation } from "aws-amplify";
import VueStore from "@/store";
import dayjs from "dayjs";

const chatUsersItems: string = `
user_id,
last_login,
display_name,
todo_task_ids,
doing_task_ids,
check_task_ids,
done_task_ids,
`;

export class ChatUsers {
  /**
   * ユーザー取得
   */
  public static async getChatUsers() {
    try {
      const gqlParams: string = `
        query getUsers {
          getChatUsers(user_id: "${VueStore.state.userID}") {
            ${chatUsersItems}
          }
        }
      `;
      const result: any = await API.graphql(graphqlOperation(gqlParams));
      return result.data.getChatUsers;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * ユーザー作成
   */
  public static async createChatUser() {
    const gqlParams: string = `
      mutation create {
        createChatUsers(
          input: {
            user_id: "${VueStore.state.userID}",
            display_name: "${VueStore.state.displayName}"
            last_login: "${dayjs().format("YYYY/MM/DD HH:mm:ss")}"
          }
        ) {
          ${chatUsersItems}
        }
      }
    `;
    await API.graphql(graphqlOperation(gqlParams));
  }

  /**
   * ユーザー情報更新
   */
  public static async updateChatUser() {
    const gqlParams: string = `
      mutation update {
        updateChatUsers(
          input: {
            user_id: "${VueStore.state.userID}",
            last_login: "${dayjs().format("YYYY/MM/DD HH:mm:ss")}"
          }
        ) {
          ${chatUsersItems}
        }
      }
    `;
    const result: any = await API.graphql(graphqlOperation(gqlParams));
    return result.data.updateChatUsers;
  }
}
