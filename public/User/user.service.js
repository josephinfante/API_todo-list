"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const mongodb_1 = require("mongodb");
const connection_utils_1 = require("../utils/connection.utils");
const hash_utils_1 = require("../utils/hash.utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
class UserService {
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, connection_utils_1.openConnection)();
                let db = yield (0, connection_utils_1.database)();
                let userCollection = db.collection("User");
                let result = yield userCollection
                    .find()
                    .project({ _id: new mongodb_1.ObjectId(id), name: 1, lastname: 1, email: 1 })
                    .toArray();
                yield (0, connection_utils_1.closeConnection)();
                if (result[0]) {
                    return result[0];
                }
                return { error: `User with ID ${id} not found` };
            }
            catch (error) {
                yield (0, connection_utils_1.closeConnection)();
                return { error: "There is an error getting the user, try again later" };
            }
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let hashedPassword = yield (0, hash_utils_1.encrypt)(user.password);
                yield (0, connection_utils_1.openConnection)();
                let db = yield (0, connection_utils_1.database)();
                let userCollection = db.collection("User");
                let newUser = {
                    name: user.name,
                    lastname: user.lastname,
                    email: user.email,
                    password: hashedPassword,
                    created_at: new Date(),
                    updated_at: new Date(),
                    tasks: [],
                };
                yield userCollection.insertOne(newUser);
                yield (0, connection_utils_1.closeConnection)();
                return { message: "User account created" };
            }
            catch (error) {
                yield (0, connection_utils_1.closeConnection)();
                return { error: "There is an error creating a user, try again later" };
            }
        });
    }
    updateUser(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //check if the user ID exists
                let search = yield this.getUser(id);
                //If user with that ID don't exists, we return an error
                if (search.error) {
                    return search;
                }
                //If user was found, we proceed by updating the user
                yield (0, connection_utils_1.openConnection)();
                let db = yield (0, connection_utils_1.database)();
                let userCollection = db.collection("User");
                yield userCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                    $set: {
                        name: user.name,
                        lastname: user.lastname,
                        updated_at: new Date(),
                    },
                });
                yield (0, connection_utils_1.closeConnection)();
                return { message: "User updated" };
            }
            catch (error) {
                yield (0, connection_utils_1.closeConnection)();
                return { error: "There is an error updating the user, try again later" };
            }
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //check if the user ID exists
                let search = yield this.getUser(id);
                //If user with that ID don't exists, we return an error
                if (search.error) {
                    return search;
                }
                //If user was found, we proceed to remove it
                yield (0, connection_utils_1.openConnection)();
                let db = yield (0, connection_utils_1.database)();
                let userCollection = db.collection("User");
                yield userCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
                yield (0, connection_utils_1.closeConnection)();
                return { message: "User deleted!" };
            }
            catch (error) {
                yield (0, connection_utils_1.closeConnection)();
                return { error: "There is an error deleting the user, try again later" };
            }
        });
    }
    login(login) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //check if the email is registered
                yield (0, connection_utils_1.openConnection)();
                let db = yield (0, connection_utils_1.database)();
                let userCollection = db.collection("User");
                let result = yield userCollection.find({ email: login.email }).toArray();
                yield (0, connection_utils_1.closeConnection)();
                //send error status if user with that email don't exist
                if (result.length === 0) {
                    return { error: "There isn't an account with that email" };
                }
                //compare hashed password with the password provided by the user
                let passwordMatch = yield (0, hash_utils_1.decrypt)(login.password, result[0].password);
                //if the password match we send a token to the user, if it doesn't we send him an error message
                if (passwordMatch === false) {
                    return { error: "password is incorrect" };
                }
                let token = jsonwebtoken_1.default.sign(result[0]._id.toString(), process.env.JWT_TOKEN ? process.env.JWT_TOKEN : "1234");
                return { token: token };
            }
            catch (error) {
                yield (0, connection_utils_1.closeConnection)();
                return {
                    error: "There is an error login into the account, try again later",
                };
            }
        });
    }
}
exports.UserService = UserService;
