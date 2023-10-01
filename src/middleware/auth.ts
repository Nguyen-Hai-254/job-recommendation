require('dotenv').config()
import jwt from "jsonwebtoken"

const tokenFromHeader = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1]
    }
    return null
}

export const verifyToken = async (req, res, next) => {
    let key = process.env.JWT_SECRET;
    try {
        if (tokenFromHeader(req) || (req.cookies && req.cookies.jwt)) {
            let decoded = tokenFromHeader(req) ? jwt.verify(tokenFromHeader(req), key) : jwt.verify(req.cookies.jwt, key);
            if (decoded && decoded.userId && decoded.email) {
                req.user = { userId: decoded.userId, email: decoded.email };
                next()
            }
            else {
                return res.status(403).json({
                    message: 'You are not authorized to do this',
                    status: 403
                })
            }
        }
        else {
            return res.status(401).json({
                message: 'Token is valid',
                status: 401
            })
        }

    } catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 500,
            error: 'Internal Server Error',
        })
    }


}