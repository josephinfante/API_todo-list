import { Collection, Db } from "mongodb";
import { User } from "../models/user.model";
import { closeConnection, database, openConnection } from "../utils/connection.utils";

export class UserService {
    async createUser(user: User) {
        try {
            await openConnection();
            let db: Db = await database();
            let collection: Collection = db.collection("User")
            let newUser: User = {
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                password: user.password,
                created_at: new Date(),
                updated_at: new Date(),
                tasks: [],
            }
            await collection.insertOne(newUser);
            await closeConnection();
            return newUser
        } catch (error) {
            await closeConnection();
            return error
        }
    }
    updateUser() {

    }
    deleteUser() {

    }
}