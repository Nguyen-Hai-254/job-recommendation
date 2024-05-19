import jwt from "jsonwebtoken"
import RedisServices from "../services/redisServices"
import { HttpException } from "../exceptions/httpException"

export const tokenFromHeader = async(req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        const jwt = req.headers.authorization.split(' ')[1];
        const isBlockListed = await RedisServices.getBlockedToken(jwt);
        if (isBlockListed) return null;
        return jwt;
    }
    return undefined;
}

export const tokenFromCookie = async (req) => {
    if (req.cookie?.jwt) {
        const isBlockListed = await RedisServices.getBlockedToken(req.cookie.jwt);
        if (isBlockListed) return null;
        return req.cookie.jwt;
    }
    return undefined;
}

export const verifyToken = async (req, res, next) => {
    let key = process.env.JWT_SECRET;
    try {
        const token1 = await tokenFromHeader(req);
        const token2 = await tokenFromCookie(req);
        if (token1 || token2) {
            let decoded = token1 ? jwt.verify(token1, key) : jwt.verify(token2, key);
            if (decoded && decoded.userId && decoded.email && decoded.role) {
                req.user = { userId: decoded.userId, email: decoded.email, role: decoded.role };
                req.role = decoded.role;
                next()
            }
            else {
                next(new HttpException(401, 'Token is invalid'));
            }
        }
        else if (token1 === null || token2 === null) {
            next(new HttpException(401, 'You have already logged out before.'))
        }
        else {
            next(new HttpException(401, 'Token is invalid'));
        }

    } catch (error) {
        next(error);
    }


}