import express from "express"

const route = express.Router()

route.post('/api/v1/post', (req, res) => {
    return res.status(200).json({
        Ok: 'OK'
    })
});

export default route