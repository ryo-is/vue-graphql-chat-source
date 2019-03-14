import { API, graphqlOperation } from "aws-amplify";
import VueStore from "@/store";
import dayjs from "dayjs";

export interface chatUsersType {
  user_id: string;
  last_login: string;
  display_name: string;
}

const chatUsersItems: string = `
user_id,
last_login,
display_name
`;

export class ChatUsers {
  /**
   * ユーザー取得
   */
  public static async getChatUsers() {
    const gqlParams: string = `
      query getUsers {
        getChatUsers(user_id: "${VueStore.state.userID}") {
          ${chatUsersItems}
        }
      }
    `;
    const result: any = await API.graphql(graphqlOperation(gqlParams));
    return result.data.getChatUsers;
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
