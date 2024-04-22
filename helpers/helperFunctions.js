import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { TOTP } from "totp-generator";

const makeResponse = (status, message, data) => {
    status = status == "s" ? "ok" : "failed";
    return {
        status,
        message,
        data
    }
}

const generateJwt = async (payload) => {
    const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })
    return token;
}

const verifyOtp = (userOtp, totpSecret) => {
    const currentTimestamp = Date.now();
    const validCodes = []
    console.log(userOtp)
    // otp based on timestamp for previous, current and next 30s 
    for (let i = -1; i <= 1; i++) {
        const timestamp = currentTimestamp + (i * 30000)
        const { otp } = TOTP.generate(totpSecret, { timestamp });
        validCodes.push(otp)
    }
    if (validCodes.includes(userOtp)) {
        return true;
    } else {
        return false;
    }
}

const decodeAuthHeaderToken = (req) => {
    const authToken = req.headers?.authorization
    if (!(authToken && authToken.startsWith("Bearer "))) {
        return { error: "Bearer Token Required" };
    }
    const token = authToken.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded) {
        console.log(decoded)
        return decoded
    } else {
        return { error: "Token Invalid or expired" }
    }
}


export { makeResponse, generateJwt, verifyOtp, decodeAuthHeaderToken };