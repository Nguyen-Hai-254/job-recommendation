"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.tokenFromCookie = exports.tokenFromHeader = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redisServices_1 = __importDefault(require("../services/redisServices"));
const httpException_1 = require("../exceptions/httpException");
const tokenFromHeader = async (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        const jwt = req.headers.authorization.split(' ')[1];
        const isBlockListed = await redisServices_1.default.getBlockedToken(jwt);
        if (isBlockListed)
            return null;
        return jwt;
    }
    return undefined;
};
exports.tokenFromHeader = tokenFromHeader;
const tokenFromCookie = async (req) => {
    var _a;
    if ((_a = req.cookie) === null || _a === void 0 ? void 0 : _a.jwt) {
        const isBlockListed = await redisServices_1.default.getBlockedToken(req.cookie.jwt);
        if (isBlockListed)
            return null;
        return req.cookie.jwt;
    }
    return undefined;
};
exports.tokenFromCookie = tokenFromCookie;
const verifyToken = async (req, res, next) => {
    let key = process.env.JWT_SECRET;
    try {
        const token1 = await (0, exports.tokenFromHeader)(req);
        const token2 = await (0, exports.tokenFromCookie)(req);
        if (token1 || token2) {
            let decoded = token1 ? jsonwebtoken_1.default.verify(token1, key) : jsonwebtoken_1.default.verify(token2, key);
            if (decoded && decoded.userId && decoded.email && decoded.role) {
                req.user = { userId: decoded.userId, email: decoded.email, role: decoded.role };
                req.role = decoded.role;
                next();
            }
            else {
                next(new httpException_1.HttpException(401, 'Token is invalid'));
            }
        }
        else if (token1 === null || token2 === null) {
            next(new httpException_1.HttpException(401, 'You have already logged out before.'));
        }
        else {
            next(new httpException_1.HttpException(401, 'Token is invalid'));
        }
    }
    catch (error) {
        next(error);
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=auth.js.map