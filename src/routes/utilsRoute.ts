import express from "express"
import { readProfession, readProvinces } from "../utils/readProvinces";

const route = express.Router()


// Get All option of Provinces
route.get('/get-provinces', (req, res) => {
    try {
        let data = readProvinces();
        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).json(e.message)
    }
});

// Get all option of profession
route.get('/get-profession', (req, res) => {
    try {
        let data = readProfession();
        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).json(e.message)
    }
});

export default route