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
const app_1 = require("./app");
const db_connection_1 = require("./connections/db.connection");
const collection_utils_1 = require("./utils/collection.utils");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_connection_1.Connection)();
    yield (0, collection_utils_1.collection)();
    const app = new app_1.App();
    yield app.listen();
});
main();
