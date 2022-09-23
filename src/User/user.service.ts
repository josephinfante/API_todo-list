import { Collection, Db, ObjectId } from "mongodb";
import { User } from "../models/user.model";
import {
  closeConnection,
  database,
  openConnection,
} from "../utils/connection.utils";
import { encrypt, decrypt } from "../utils/hash.utils";
import jwt from "jsonwebtoken";
import "dotenv/config";

export class UserService {
  async getUser(id: string) {
    try {
      await openConnection();
      let db: Db = await database();
      let userCollection: Collection = db.collection("User");
      let result = await userCollection
        .find({ _id: new ObjectId(id)})
        .project({ _id: 1, name: 1, lastname: 1, email: 1 })
        .toArray();
      await closeConnection();
      if (result[0]) {
        return result[0];
      }
      return { error: `User with ID ${id} not found` };
    } catch (error) {
      await closeConnection();
      return { error: "There is an error getting the user, try again later" };
    }
  }
  async createUser(user: User) {
    try {
      let hashedPassword = await encrypt(user.password);
      await openConnection();
      let db: Db = await database();
      let userCollection: Collection = db.collection("User");
      let newUser: User = {
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
        tasks: [],
      };
      await userCollection.insertOne(newUser);
      let result = await userCollection.find({ email: user.email }).toArray();
      await closeConnection();
      let token = jwt.sign(
        result[0]._id.toString(),
        process.env.JWT_TOKEN ? process.env.JWT_TOKEN : "1234"
      );
      return { token: token };
    } catch (error) {
      await closeConnection();
      return { error: "There is an error creating a user, try again later" };
    }
  }
  async updateUser(id: string, user: User) {
    try {
      //check if the user ID exists
      let search = await this.getUser(id);

      //If user with that ID don't exists, we return an error
      if (search.error) {
        return search;
      }

      //If user was found, we proceed by updating the user
      await openConnection();
      let db: Db = await database();
      let userCollection: Collection = db.collection("User");
      await userCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            name: user.name,
            lastname: user.lastname,
            updated_at: new Date(),
          },
        }
      );
      await closeConnection();
      return { message: "User updated" };
    } catch (error) {
      await closeConnection();
      return { error: "There is an error updating the user, try again later" };
    }
  }
  async deleteUser(id: string) {
    try {
      //check if the user ID exists
      let search = await this.getUser(id);

      //If user with that ID don't exists, we return an error
      if (search.error) {
        return search;
      }

      //If user was found, we proceed to remove it
      await openConnection();
      let db: Db = await database();
      let userCollection: Collection = db.collection("User");
      await userCollection.deleteOne({ _id: new ObjectId(id) });
      await closeConnection();
      return { message: "User deleted!" };
    } catch (error) {
      await closeConnection();
      return { error: "There is an error deleting the user, try again later" };
    }
  }
  async login(login: { email: string; password: string }) {
    try {
      //check if the email is registered
      await openConnection();
      let db: Db = await database();
      let userCollection: Collection = db.collection("User");
      let result = await userCollection.find({ email: login.email }).toArray();
      await closeConnection();
      //send error status if user with that email don't exist
      if (result.length === 0) {
        return { error: "There isn't an account with that email" };
      }

      //compare hashed password with the password provided by the user
      let passwordMatch = await decrypt(login.password, result[0].password);
      //if the password match we send a token to the user, if it doesn't we send him an error message
      if (passwordMatch === false) {
        return { error: "password is incorrect" };
      }
      let token = jwt.sign(
        result[0]._id.toString(),
        process.env.JWT_TOKEN ? process.env.JWT_TOKEN : "1234"
      );
      return { token: token };
    } catch (error) {
      await closeConnection();
      return {
        error: "There is an error login into the account, try again later",
      };
    }
  }
}
