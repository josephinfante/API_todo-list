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
const user_service_1 = require("./user.service");
const user_middleware_1 = require("./user.middleware");
const userRouter = (0, express_1.Router)();
const userService = new user_service_1.UserService();
userRouter
    .get("/", user_middleware_1.authenticateToken, (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield userService.getUser(res.locals.id);
        response.error
            ? res.status(400).send(response)
            : res.status(200).send(response);
        next();
    }
    catch (error) {
        res.status(400).send(error);
    }
}))
    .post("/", user_middleware_1.signUp, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield userService.createUser(req.body);
        response.error
            ? res.status(400).send(response)
            : res.status(200).send(response);
    }
    catch (error) {
        res.status(400).send(error);
    }
}))
    .put("/", user_middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield userService.updateUser(res.locals.id, req.body);
        response.error
            ? res.status(400).send(response)
            : res.status(200).send(response);
    }
    catch (error) {
        res.status(400).send(error);
    }
}))
    .delete("/", user_middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield userService.deleteUser(res.locals.id);
        response.error
            ? res.status(400).send(response)
            : res.status(200).send(response);
    }
    catch (error) {
        res.status(400).send(error);
    }
    console.log(req.params);
    res.status(200).json({ message: "User deleted" });
}))
    .post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield userService.login(req.body);
        response.error
            ? res.status(400).send(response)
            : res.status(200).send(response);
    }
    catch (error) {
        res.status(400).send(error);
    }
}));
exports.default = userRouter;
