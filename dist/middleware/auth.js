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
exports.verifyToken = void 0;
require('dotenv').config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenFromHeader = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
};
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let key = process.env.JWT_SECRET;
    try {
        if (tokenFromHeader(req) || (req.cookies && req.cookies.jwt)) {
            let decoded = tokenFromHeader(req) ? jsonwebtoken_1.default.verify(tokenFromHeader(req), key) : jsonwebtoken_1.default.verify(req.cookies.jwt, key);
            if (decoded && decoded.userId && decoded.email && decoded.role) {
                req.user = { userId: decoded.userId, email: decoded.email, role: decoded.role };
                req.role = decoded.role;
                next();
            }
            else {
                return res.status(403).json({
                    message: 'You are not authorized to do this',
                    status: 403
                });
            }
        }
        else {
            return res.status(401).json({
                message: 'Token is valid',
                status: 401
            });
        }
    }
    catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 500,
            error: 'Internal Server Error',
        });
    }
});
exports.verifyToken = verifyToken;
//# sourceMappingURL=auth.js.map