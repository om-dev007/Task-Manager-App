import dotenv from "dotenv";
dotenv.config();

if(!process.env.PORT || !process.env.MONGO_URI || !process.env.JWT_SECRET || !process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_SECRET_ID || !process.env.GOOGLE_REFRESH_TOKEN || !process.env.USER_EMAIL) {
    throw new Error("Missing required environment variables");
}

export const config = {
    port: process.env.PORT,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleSecretId: process.env.GOOGLE_SECRET_ID,
    googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    userEmail: process.env.USER_EMAIL
}