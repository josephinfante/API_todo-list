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
exports.Connection = exports.client = void 0;
const mongodb_1 = require("mongodb");
require("dotenv/config");
const URI = process.env.DB_URL || 'mongodb://localhost:27017/todo-list_dev';
exports.client = new mongodb_1.MongoClient(URI);
const Connection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect the client to the server
        yield exports.client.connect();
        console.log(`Connected successfully to server: ${URI}`);
        // Establish and verify connection
        const db = exports.client.db(process.env.DB_NAME);
        console.log(`Connected to database: ${db.databaseName}`);
    }
    finally {
        //Ensures that the client will close when you finish/error
        yield exports.client.close();
    }
});
exports.Connection = Connection;
