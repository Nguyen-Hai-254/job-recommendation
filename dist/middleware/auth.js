"use strict";
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
const verifyToken = async (req, res, next) => {
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
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=auth.js.map