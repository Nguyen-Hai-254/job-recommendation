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