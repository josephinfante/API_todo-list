import { Task } from "./task.model";

export interface User {
  name: string;
  lastname: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  tasks: Task[];
}
