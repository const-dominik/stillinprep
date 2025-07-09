"use server";

import nodemailer from "nodemailer";

let cachedAccessToken: string | null = null;
let accessTokenExpiresAt = 0;

const {
    AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET,
    EMAIL_REFRESH_TOKEN,
    EMAIL_ADDRESS,
} = process.env;

const getAccessToken = async (): Promise<string> => {
    const now = Date.now();

    if (cachedAccessToken && now < accessTokenExpiresAt - 60 * 1000) {
        return cachedAccessToken;
    }

    const params = new URLSearchParams({
        client_id: AUTH_GOOGLE_ID!,
        client_secret: AUTH_GOOGLE_SECRET!,
        refresh_token: EMAIL_REFRESH_TOKEN!,
        grant_type: "refresh_token",
    });

    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(`Failed to refresh token: ${res.status} - ${error}`);
    }

    const data = await res.json();

    cachedAccessToken = data.access_token;
    accessTokenExpiresAt = now + data.expires_in * 1000;

    return cachedAccessToken!;
};

export async function getEmailTransporter() {
    const accessToken = await getAccessToken();

    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: EMAIL_ADDRESS,
            clientId: AUTH_GOOGLE_ID,
            clientSecret: AUTH_GOOGLE_SECRET,
            refreshToken: EMAIL_REFRESH_TOKEN,
            accessToken,
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
