require('dotenv').config()
import jwt from "jsonwebtoken"

export const verifyToken = async (req, res, next) => {
    let key = process.env.JWT_SECRET;
    try {
        if (!req.cookies || !req.cookies.jwt) {
            return res.status(401).json({
                message: 'Token is valid',
                status: 401
            })
        }

        let decoded = jwt.verify(req.cookies.jwt, key);
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
    } catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 500,
            error: 'Internal Server Error',
        })
    }


}