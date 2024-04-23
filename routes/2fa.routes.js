import express from 'express';
import { getQR, set2fa, remove2fa } from '../controllers/2fa.controllers.js';
import fieldValidator from '../middleware/fieldValidator.js';

const router = express.Router();

// /api/users/2fa/

router.get("/getqr", getQR);

router.post("/set2fa", fieldValidator(['otp', 'secretToken']), set2fa);

router.post("/remove2fa", fieldValidator(['otp']), remove2fa);



export default router;

