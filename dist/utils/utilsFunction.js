"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = exports.mergerTwoObject = exports.countCandidatesbyProfession = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const countCandidatesbyProfession = (professionCountList) => {
    const professionsList = professionCountList.map(item => item.profession.split(', ')).flat();
    const uniqueProfessions = [...new Set(professionsList)];
    const countMap = {};
    professionCountList.forEach(item => {
        uniqueProfessions.forEach(profession => {
            if (typeof profession === 'string' && item.profession.includes(profession)) {
                countMap[profession] = (countMap[profession] || 0) + parseInt(item.userCount);
            }
        });
    });
    return countMap;
};
exports.countCandidatesbyProfession = countCandidatesbyProfession;
const mergerTwoObject = (obj1, obj2) => {
    let result = Object.assign({}, obj1);
    for (let key in obj2) {
        if (result[key])
            result[key] += obj2[key];
        else
            result[key] = obj2[key];
    }
    return result;
};
exports.mergerTwoObject = mergerTwoObject;
exports.transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});
//# sourceMappingURL=utilsFunction.js.map