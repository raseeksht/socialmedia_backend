import { makeResponse } from "../helpers/helperFunctions.js"



const fieldValidator = (requiredFields) => (req, res, next) => {
    const missingFields = requiredFields.filter(field => !req.body[field])
    if (missingFields.length > 0) {
        return res.status(400).json(makeResponse("f", `${missingFields.join(', ')} is requied`))
    }
    next()

}

export default fieldValidator