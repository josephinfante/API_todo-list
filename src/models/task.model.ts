import { ObjectId } from "mongodb";

export interface Task {
  _id: ObjectId;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}
