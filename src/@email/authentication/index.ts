import { Email, email_address } from '../index';
import { AUTHENTICATION } from './template';

interface Authentication {
    email: string,
    url: string,
    code: string,
    host: string
};

export const EMAIL_SIGNUP = async (data: Authentication) => {
    const transporter = Email();
    const mailOptions = {
        from: `${email_address} <${email_address}>`,
        to: data.email,
        subject: "Confirm Email",
        html: AUTHENTICATION({
            des: "Confirm Email",
            url: data.url,
            host: data.host,
            code: data.code,
        })
    }
    await transporter.sendMail(mailOptions);
};

export const EMAIL_LOGIN = async (data: Authentication) => {
    const transporter = Email();

    const mailOptions = {
        from: `${email_address} <${email_address}>`,
        to: data.email,
        subject: `Magic Link ${data.code}`,
        html: AUTHENTICATION({
            des: "Login link",
            url: data.url,
            code: data.code,
            host: data.host
        })
    };
    await transporter.sendMail(mailOptions);
};