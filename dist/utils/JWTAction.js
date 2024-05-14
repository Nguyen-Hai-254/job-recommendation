"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
require('dotenv').config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (payload) => {
    let key = process.env.JWT_SECRET;
    let token = null;
    try {
        token = jsonwebtoken_1.default.sign(payload, key);
    }
    catch (e) {
        console.log(e);
    }
    return token;
};
exports.createToken = createToken;
//# sourceMappingURL=JWTAction.js.map