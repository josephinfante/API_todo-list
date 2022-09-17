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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const mongodb_1 = require("mongodb");
const connection_utils_1 = require("../utils/connection.utils");
class TaskService {
    getTask(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, connection_utils_1.openConnection)();
                let db = yield (0, connection_utils_1.database)();
                let userCollection = db.collection("User");
                let result = yield userCollection
                    .aggregate([
                    { $match: { "tasks._id": new mongodb_1.ObjectId(id) } },
                    {
                        $project: {
                            tasks: {
                                $filter: {
                                    input: "$tasks",
                                    as: "tasks",
                                    cond: { $eq: ["$$tasks._id", new mongodb_1.ObjectId(id)] },
                                },
                            },
                            _id: 0,
                        },
                    },
                ])
                    .toArray();
                yield (0, connection_utils_1.closeConnection)();
                //If task wasn't found, we let the user know.
                if (result.length === 0) {
                    return { error: `Task with ID ${id}, wasn't found` };
                }
                //If task was found, we send the task info.
                return { task: result[0].tasks[0] };
            }
            catch (error) {
                yield (0, connection_utils_1.closeConnection)();
                return { error: "There is an error getting the task, try again later" };
            }
        });
    }
    createTask(task, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, connection_utils_1.openConnection)();
                let db = yield (0, connection_utils_1.database)();
                let userCollection = db.collection("User");
                let user = yield userCollection.findOne({ _id: new mongodb_1.ObjectId(user_id) });
                if (user === null || user === undefined) {
                    yield (0, connection_utils_1.closeConnection)();
                    return ({ error: "User don't exist, the task can't get created" });
                }
                let insertTask = {
                    $push: {
                        tasks: {
                            _id: new mongodb_1.ObjectId(),
                            name: task.name,
                            description: task.description,
                            created_at: new Date(),
                            updated_at: new Date(),
                        },
                    },
                };
                yield userCollection.updateOne({ _id: user === null || user === void 0 ? void 0 : user._id }, insertTask);
                yield (0, connection_utils_1.closeConnection)();
                return { message: "Task created" };
            }
            catch (error) {
                yield (0, connection_utils_1.closeConnection)();
                return { error: "There is an error creating a task, try again later" };
            }
        });
    }
    updateTask(user_id, id, task) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // search for the task ID to remove it
                let search = yield this.getTask(id);
                //If task wasn't found, we let the user know that there is no task with that ID
                if (search.error) {
                    return search;
                }
                //If task was found, we update the task
                yield (0, connection_utils_1.openConnection)();
                let db = yield (0, connection_utils_1.database)();
                let userCollection = db.collection("User");
                yield userCollection.updateOne({
                    _id: new mongodb_1.ObjectId(user_id),
                    "tasks._id": new mongodb_1.ObjectId(id),
                }, {
                    $set: {
                        "tasks.$.name": task.name,
                        "tasks.$.description": task.description,
                        "tasks.$.updated_at": new Date(),
                    },
                });
                yield (0, connection_utils_1.closeConnection)();
                return { message: "Task updated" };
            }
            catch (error) {
                yield (0, connection_utils_1.closeConnection)();
                return { error: "There is an error updating the task, try again later" };
            }
        });
    }
    deleteTask(user_id, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // search for the task ID to remove it
                let search = yield this.getTask(id);
                //If task wasn't found, we let the user know that there is no task with that ID
                if (search.error) {
                    return search;
                }
                //If task was found, we proceed to remove it
                yield (0, connection_utils_1.openConnection)();
                let db = yield (0, connection_utils_1.database)();
                let userCollection = db.collection("User");
                yield userCollection.updateOne({ _id: new mongodb_1.ObjectId(user_id) }, { $pull: { tasks: { _id: new mongodb_1.ObjectId(id) } } });
                yield (0, connection_utils_1.closeConnection)();
                return { message: "Task deleted" };
            }
            catch (error) {
                yield (0, connection_utils_1.closeConnection)();
                return { error: "There is an error deleting the task, try again later" };
            }
        });
    }
}
exports.TaskService = TaskService;
