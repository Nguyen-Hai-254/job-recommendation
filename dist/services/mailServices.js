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
    const html = template_resetPassword(token);
    const res = await transporter.sendMail({
        from: process.env.MAILER_FROM,
        to: email,
        subject: 'Reset Password',
        html: html
    });
    return res;
};
exports.default = MailServices;
const template_resetPassword = (token) => {
    return (`
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Mã Xác Thực</title>
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
    }
    .container {
      display: table;
      width: 100%;
      height: 100vh;
    }
    .content {
      display: table-cell;
      vertical-align: middle;
      text-align: center;
    }
    .card {
      background-color: #fff;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      max-width: 500px;
      width: 90%;
      margin: 0 auto;
      padding: 40px;
      box-sizing: border-box;
    }
    .card h1 {
      font-size: 32px;
      font-weight: 600;
      margin-bottom: 10px;
      color: #333;
    }
    .card p {
      font-size: 18px;
      color: #666;
      margin-bottom: 30px;
    }
    .code {
      font-size: 48px;
      font-weight: 700;
      color: #4CAF50;
      margin-bottom: 20px;
    }
    .expires-in {
      font-size: 16px;
      color: #999;
      margin-bottom: 30px;
    }
    .footer {
      font-size: 14px;
      color: #999;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <div class="card">
        <h1>Mã Xác Thực</h1>
        <p>Đây là mã xác thực của bạn</p>
        <div class="code">${token}</div>
        <div class="expires-in">Mã này sẽ hết hạn trong 10 phút</div>
        <div class="footer">
          &copy; 2024 Verification Code. All rights reserved.
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`);
};
//# sourceMappingURL=mailServices.js.map