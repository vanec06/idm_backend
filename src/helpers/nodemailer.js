import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
        user: "idmsena2024@outlook.com",
        pass: "idmsena062024",
    },
});

