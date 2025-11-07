import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { sendFriendRequest , respondToFriendRequest , cancelFriendRequest , getFriendRequests,getFriends,searchUsers } from "../controllers/friendController.js";

const router = express.Router();

router.post("/request/:receiverId" , verifyToken , sendFriendRequest);
router.post("/respond/:requestId" , verifyToken , respondToFriendRequest);
router.post("/cancel/:requestId" , verifyToken , cancelFriendRequest);
router.get("/requests" , verifyToken , getFriendRequests);
router.get("/list",verifyToken,getFriends);


//Users search 
router.get("/search" , verifyToken , searchUsers);

export default router;
