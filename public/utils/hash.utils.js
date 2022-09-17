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
exports.decrypt = exports.encrypt = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const encrypt = (password) => __awaiter(void 0, void 0, void 0, function* () {
    let salt = yield bcrypt_1.default.genSalt(10);
    let hashedPassword = yield bcrypt_1.default.hash(password, salt);
    return hashedPassword;
});
exports.encrypt = encrypt;
const decrypt = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    let match = yield bcrypt_1.default.compare(password, hashedPassword);
    return match;
});
exports.decrypt = decrypt;
