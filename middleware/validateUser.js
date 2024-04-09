import jwt from 'jsonwebtoken';
import { makeResponse } from '../helpers/helperFunctions.js';

const validateUser = (req, res, next) => {
    const auth = req.headers?.authorization
    if (!auth || !auth.startsWith("Bearer ")) {
        return res.status(401).json(makeResponse("f", "Authorization Header Invalid error"))
    }

    const token = auth.split(" ")[1]
    const decodedToken = jwt.decode(token, process.env.JWT_SECRET)
    if (decodedToken) {
        req.user = { _id: decodedToken._id }
        next()
    } else {
        return res.status(401).json(makeResponse("f", "Invalid or expired token"))
    }

}

export default validateUser