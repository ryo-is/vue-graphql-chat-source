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
  priority: number;
}
