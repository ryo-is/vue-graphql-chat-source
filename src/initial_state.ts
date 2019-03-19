interface initialStateType {
  userID: string;
  displayName: string;
  todo_task_ids: string[];
  doing_task_ids: string[];
  check_task_ids: string[];
  done_task_ids: string[];
}

const initialState: initialStateType = {
  userID: "",
  displayName: "",
  todo_task_ids: [],
  doing_task_ids: [],
  check_task_ids: [],
  done_task_ids: []
};

export default initialState;
