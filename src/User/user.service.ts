import { Collection, Db, ObjectId } from "mongodb";
import { User } from "../models/user.model";
import {
  closeConnection,
  database,
  openConnection,
} from "../utils/connection.utils";

export class UserService {
  async getUser(id: string) {
    try {
      await openConnection();
      let db: Db = await database();
      let userCollection: Collection = db.collection("User");
      let result = await userCollection
        .find()
        .project({ _id: new ObjectId(id), name: 1, lastname: 1, email: 1 })
        .toArray();
      await closeConnection();
      if (result[0]) {
        return result[0];
      }
      return { error: `User with ID ${id} not found` };
    } catch (error) {
      await closeConnection();
      return { error: `User with ID ${id} not found` };
    }
  }
  async createUser(user: User) {
    try {
      await openConnection();
      let db: Db = await database();
      let collection: Collection = db.collection("User");
      let newUser: User = {
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        password: user.password,
        created_at: new Date(),
        updated_at: new Date(),
        tasks: [],
      };
      await collection.insertOne(newUser);
      await closeConnection();
      return { message: "User account created" };
    } catch (error) {
      await closeConnection();
      return error;
    }
  }
  updateUser() {}
  deleteUser() {}
}
