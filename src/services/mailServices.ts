import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD
    }
});

export default class MailServices {
    static sendEmailForUsers = async (emails, subject, html) => {
        const res = await transporter.sendMail({
            from: process.env.MAILER_FROM,
            to: emails,
            subject: subject,
            html: html
        })
        return res;
    }
    static sendTokenForResetPassword = async (email, token) => {

        const res = await transporter.sendMail({
            from: process.env.MAILER_FROM,
            to: email,
            subject: 'Reset Password',
            html: `Mã xác thực của bạn là: <b>${token}</b>`
        })
        return res;
    }
}

