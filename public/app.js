"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const task_route_1 = __importDefault(require("./Task/task.route"));
const user_route_1 = __importDefault(require("./User/user.route"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.settings();
        this.middlewares();
        this.routes();
    }
    settings() {
        this.app.set("port", process.env.PORT || 3000);
    }
    middlewares() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    routes() {
        this.app.use("/task", task_route_1.default);
        this.app.use("/user", user_route_1.default);
    }
    listen() {
        this.app.listen(this.app.get("port"), () => {
            console.log("Server on port ", this.app.get("port"));
        });
    }
}
exports.App = App;
