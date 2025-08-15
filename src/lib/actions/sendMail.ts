"use server";

import nodemailer from "nodemailer";

const { EMAIL_ADDRESS, EMAIL_PASSWORD } = process.env;

export async function getEmailTransporter() {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL_ADDRESS,
            pass: EMAIL_PASSWORD,
        },
    });
}

export const sendMail = async (
    to: string,
    content: string,
    subject: string
) => {
    const transporter = await getEmailTransporter();
    await transporter.sendMail({
        from: '"Still In Prep" <stillinprep@gmail.com>',
        to,
        subject,
        text: content,
    });
};
