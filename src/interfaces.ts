export interface ChatMessagesType {
  user_id: string;
  create_time: string;
  message_body: string;
}

export interface TaskContentsType {
  room_id: string;
  tasks: {
    TODO: TaskType[];
    Doing: TaskType[];
    Check: TaskType[];
    Done: TaskType[];
  };
}

export interface TaskType {
  task_id: string;
  title: string;
  description: string;
  create_user: string;
}

export interface ChatUsersType {
  user_id: string;
  last_login: string;
  display_name: string;
}
