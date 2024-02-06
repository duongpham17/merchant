"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL_LOGIN = exports.EMAIL_SIGNUP = void 0;
const index_1 = require("../index");
const template_1 = require("./template");
;
const EMAIL_SIGNUP = async (data) => {
    const transporter = (0, index_1.Email)();
    const mailOptions = {
        from: `${index_1.email_address} <${index_1.email_address}>`,
        to: data.email,
        subject: "Confirm Email",
        html: (0, template_1.AUTHENTICATION)({
            des: "Confirm Email",
            url: data.url,
            host: data.host,
            code: data.code,
        })
    };
    await transporter.sendMail(mailOptions);
};
exports.EMAIL_SIGNUP = EMAIL_SIGNUP;
const EMAIL_LOGIN = async (data) => {
    const transporter = (0, index_1.Email)();
    const mailOptions = {
        from: `${index_1.email_address} <${index_1.email_address}>`,
        to: data.email,
        subject: `Magic Link ${data.code}`,
        html: (0, template_1.AUTHENTICATION)({
            des: "Login link",
            url: data.url,
            code: data.code,
            host: data.host
        })
    };
    await transporter.sendMail(mailOptions);
};
exports.EMAIL_LOGIN = EMAIL_LOGIN;
