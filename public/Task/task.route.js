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
const express_1 = require("express");
const user_middleware_1 = require("../User/user.middleware");
const task_service_1 = require("./task.service");
const taskRouter = (0, express_1.Router)();
const taskService = new task_service_1.TaskService();
taskRouter
    .get("/:id", user_middleware_1.authenticateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield taskService.getTask(req.params.id);
        response.error ? res.status(400).send(response) : res.status(200).send(response);
    }
    catch (error) {
        res.status(400).send(error);
    }
    next();
}))
    .post("/", user_middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield taskService.createTask(req.body, res.locals.id);
        response.error ? res.status(400).send(response) : res.status(200).send(response);
    }
    catch (error) {
        res.status(400).send(error);
    }
}))
    .put("/:id", user_middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield taskService.updateTask(res.locals.id, req.params.id, req.body);
        response.error ? res.status(400).send(response) : res.status(200).send(response);
    }
    catch (error) {
        res.status(400).send(error);
    }
}))
    .delete("/:id", user_middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield taskService.deleteTask(res.locals.id, req.params.id);
        response.error ? res.status(400).send(response) : res.status(200).send(response);
    }
    catch (error) {
        res.status(400).send(error);
    }
}));
exports.default = taskRouter;
