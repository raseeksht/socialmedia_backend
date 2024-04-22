import express from 'express';
import { getQR, set2fa } from '../controllers/2fa.controllers.js';
import fieldValidator from '../middleware/fieldValidator.js';
// import { verify2fa } from '../controllers/user.controllers.js';

const router = express.Router();

// /api/users/2fa/

router.get("/getqr", getQR);

router.post("/set2fa", fieldValidator(['otp', 'secretToken']), set2fa);

// router.post("/verify2fa", fieldValidator(['otp']), verify2fa);


export default router;

