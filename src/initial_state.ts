import { ChatUsersType } from "@/interfaces";

interface initialStateType {
  userID: string;
  displayName: string;
  user: ChatUsersType | null;
}

const initialState: initialStateType = {
  userID: "",
  displayName: "",
  user: null
};

export default initialState;
