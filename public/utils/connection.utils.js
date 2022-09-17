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
exports.closeConnection = exports.database = exports.openConnection = void 0;
const db_connection_1 = require("../connections/db.connection");
require("dotenv/config");
const openConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_connection_1.client.connect();
});
exports.openConnection = openConnection;
const database = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_connection_1.client.db(process.env.DB_NAME);
});
exports.database = database;
const closeConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_connection_1.client.close();
});
exports.closeConnection = closeConnection;
