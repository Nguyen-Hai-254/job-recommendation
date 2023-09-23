require('dotenv').config()
import jwt from "jsonwebtoken"

export const createToken = (payload) => {
    let key = process.env.JWT_SECRET
    let token = null
    try {
        token = jwt.sign(payload, key);
    } catch (e) {
        console.log(e)
    }

    return token
}

export const verifyToken = (token) => {
    let key = process.env.JWT_SECRET;
    try {
        let decoded = jwt.verify(token, key);
        return decoded
    } catch (err) {
        console.log(err);
        return null;
    }
}