"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const readProvinces_1 = require("../utils/readProvinces");
const route = express_1.default.Router();
route.get('/api/v1/get-provinces', (req, res) => {
    try {
        let data = (0, readProvinces_1.readProvinces)();
        return res.status(200).json(data);
    }
    catch (e) {
        return res.status(500).json(e.message);
    }
});
route.get('/api/v1/get-profession', (req, res) => {
    try {
        let data = (0, readProvinces_1.readProfession)();
        return res.status(200).json(data);
    }
    catch (e) {
        return res.status(500).json(e.message);
    }
});
exports.default = route;
//# sourceMappingURL=utilsRoute.js.map