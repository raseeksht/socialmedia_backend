import jwt from "jsonwebtoken";

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


export { makeResponse, generateJwt };