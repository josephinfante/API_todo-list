import { Collection, Db, ObjectId } from "mongodb";
import { Task } from "../models/task.model";
import { User } from "../models/user.model";
import {
  closeConnection,
  database,
  openConnection,
} from "../utils/connection.utils";

export class TaskService {
  async getTask(id: string) {
    try {
      await openConnection();
      let db: Db = await database();
      let userCollection = db.collection<User>("User");
      let result = await userCollection
        .aggregate([
          { $match: { "tasks._id": new ObjectId(id) } },
          {
            $project: {
              tasks: {
                $filter: {
                  input: "$tasks",
                  as: "tasks",
                  cond: { $eq: ["$$tasks._id", new ObjectId(id)] },
                },
              },
              _id: 0,
            },
          },
        ])
        .toArray();
      await closeConnection();

      //If task wasn't found, we let the user know.
      if (result.length === 0) {
        return { error: `Task with ID ${id}, wasn't found` };
      }

      //If task was found, we send the task info.
      return { task: result[0].tasks[0] };
    } catch (error) {
      await closeConnection();
      return { error: "There is an error getting the task, try again later" };
    }
  }
  async createTask(task: Task, user_id: string) {
    try {
      await openConnection();
      let db: Db = await database();
      let userCollection: Collection = db.collection("User");
      let user = await userCollection.findOne({ _id: new ObjectId(user_id) });
      let insertTask = {
        $push: {
          tasks: {
            _id: new ObjectId(),
            name: task.name,
            description: task.description,
            created_at: new Date(),
            updated_at: new Date(),
          },
        },
      };
      await userCollection.updateOne({ _id: user?._id }, insertTask);
      await closeConnection();
      return { message: "Task created" };
    } catch (error) {
      await closeConnection();
      return { error: "There is an error creating a task, try again later" };
    }
  }
  async updateTask(user_id: string, task: any) {
    try {
      // search for the task ID to remove it
      let search: any = await this.getTask(String(task._id));

      //If task wasn't found, we let the user know that there is no task with that ID
      if (search.error) {
        return { message: search.error };
      }

      //If task was found, we update the task
      await openConnection();
      let db: Db = await database();
      let userCollection: Collection = db.collection("User");
      await userCollection.updateOne(
        {
          _id: new ObjectId(user_id),
          "tasks._id": new ObjectId(task._id),
        },
        {
          $set: {
            "tasks.$.name": task.name,
            "tasks.$.description": task.description,
            "tasks.$.updated_at": new Date(),
          },
        }
      );
      await closeConnection();
      return { message: "Task updated" };
    } catch (error) {
      await closeConnection();
      return { error: "There is an error updating the task, try again later" };
    }
  }
  async deleteTask(user_id: string, id: string) {
    try {
      // search for the task ID to remove it
      let search: any = await this.getTask(id);

      //If task wasn't found, we let the user know that there is no task with that ID
      if (search.error) {
        return search;
      }

      //If task was found, we proceed to remove it
      await openConnection();
      let db: Db = await database();
      let userCollection: Collection = db.collection("User");
      await userCollection.updateOne(
        { _id: new ObjectId(user_id) },
        { $pull: { tasks: { _id: new ObjectId(id) } } }
      );
      await closeConnection();
      return { message: "Task deleted" };
    } catch (error) {
      await closeConnection();
      return { error: "There is an error deleting the task, try again later" };
    }
  }
}
