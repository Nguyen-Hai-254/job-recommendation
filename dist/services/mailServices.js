"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.MAILER_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD
    }
});
class MailServices {
}
_a = MailServices;
MailServices.sendEmailForUsers = async (emails, subject, html) => {
    const res = await transporter.sendMail({
        from: process.env.MAILER_FROM,
        to: emails,
        subject: subject,
        html: html
    });
    return res;
};
MailServices.sendTokenForResetPassword = async (email, token) => {
    const res = await transporter.sendMail({
        from: process.env.MAILER_FROM,
        to: email,
        subject: 'Reset Password',
        html: `Mã xác thực của bạn là: <b>${token}</b>`
    });
    return res;
};
exports.default = MailServices;
//# sourceMappingURL=mailServices.js.map