import nodemailer from 'nodemailer';

export const email_address = process.env.EMAIL_ADDRESS;
export const email_password = process.env.EMAIL_PASSWORD;

export const Email = () => nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: email_address,
        pass: email_password,
    }
});
