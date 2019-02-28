import { API, graphqlOperation } from "aws-amplify";
import VueStore from "@/store";
import dayjs from "dayjs";

export interface chatUsersType {
  user_id: string;
  last_login: string;
  join_channels: string[];
  friend_menbers: string[];
}

const chatUsersItems: string = `
user_id,
last_login,
join_channels,
friend_menbers
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

  // public static async listChatUser() {

  // }

  /**
   * ユーザー作成
   */
  public static async createChatUser() {
    const gqlParams: string = `
      mutation create {
        createChatUsers(
          input: {
            user_id: "${VueStore.state.userID}",
            last_login: "${dayjs().format("YYYY/MM/DD HH:mm:ss")}"
          }
        ) {
          ${chatUsersItems}
        }
      }
    `;
    await API.graphql(graphqlOperation(gqlParams));
  }

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
    await API.graphql(graphqlOperation(gqlParams));
  }
}
