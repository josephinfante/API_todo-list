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
exports.authenticateToken = exports.signUp = void 0;
const connection_utils_1 = require("../utils/connection.utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.name ||
        !req.body.lastname ||
        !req.body.email ||
        !req.body.password) {
        !req.body.name
            ? res.status(400).json({ Error_name: "Name can't be blank" })
            : !req.body.lastname
                ? res.status(400).json({ Error_lastname: "Lastname can't be blank" })
                : !req.body.email
                    ? res.status(400).json({ Error_email: "Email can't be blank" })
                    : !req.body.password
                        ? res.status(400).json({ Error_password: "Password can't be blank" })
                        : null;
        return;
    }
    if (req.body.name &&
        req.body.lastname &&
        req.body.email &&
        req.body.password) {
        //check if email is already registered
        yield (0, connection_utils_1.openConnection)();
        let db = yield (0, connection_utils_1.database)();
        let userCollection = db.collection("User");
        let result = yield userCollection.find({ email: req.body.email }).toArray();
        yield (0, connection_utils_1.closeConnection)();
        //If email is being used, throwing an error to change the email
        if (result.length === 1) {
            res.status(400).json({ Error_email: "Email is already being used" });
            return;
        }
        next();
    }
});
exports.signUp = signUp;
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let authHeader = req.headers.authorization;
    let token = authHeader ? authHeader : null;
    if (token === null) {
        res.status(401).json({ error: "No token was provided" });
        return;
    }
    try {
        let verifiedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_TOKEN ? process.env.JWT_TOKEN : '1234');
        res.locals.id = verifiedToken;
        next();
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            error.message === 'invalid token' ? res.status(403).json({ error: "Token is not valid" }) : res.status(400).send();
            return;
        }
    }
});
exports.authenticateToken = authenticateToken;
