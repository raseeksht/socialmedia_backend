import express from 'express';
import fieldValidator from '../middleware/fieldValidator.js';
import {
    createCommunity,
    addOrRemoveUserToCommunity
} from '../controllers/community.controllers.js';
import validateUser from '../middleware/validateUser.js';
import expressAsyncHandler from 'express-async-handler';

const router = express.Router();

// create a new community
router.post("/", fieldValidator(["name", "members"]), validateUser, createCommunity);

// add members
router.post("/addmembers", fieldValidator(['members', 'communityId']), validateUser, expressAsyncHandler(async (req, res) => {
    addOrRemoveUserToCommunity(req, res, "add")
}))


router.delete("/removemembers", fieldValidator(['members', 'communityId']), validateUser, expressAsyncHandler(async (req, res) => {
    addOrRemoveUserToCommunity(req, res, "remove")
}))

export default router;
