"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readProfession = exports.readProvinces = void 0;
const fs_1 = __importDefault(require("fs"));
const readProvinces = () => {
    try {
        let readData = fs_1.default.readFileSync('src/constant/provinces.json', 'utf8');
        let data = JSON.parse(readData);
        return data;
    }
    catch (e) {
        console.log(e);
    }
};
exports.readProvinces = readProvinces;
const readProfession = () => {
    try {
        let readData = fs_1.default.readFileSync('src/constant/profession.json', 'utf8');
        return JSON.parse(readData);
    }
    catch (e) {
        console.log(e);
    }
};
exports.readProfession = readProfession;
//# sourceMappingURL=readProvinces.js.map