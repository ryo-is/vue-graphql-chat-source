export interface ChatMessagesType {
  user_id: string;
  create_time: string;
  message_body: string;
}

export interface TodoTaskType {
  user_id: string;
  task_id: string;
  title: string;
  status: string;
}

export interface ChatUsersType {
  user_id: string;
  last_login: string;
  display_name: string;
  todo_task_ids: string[];
  doing_task_ids: string[];
  check_task_ids: string[];
  done_task_ids: string[];
}
