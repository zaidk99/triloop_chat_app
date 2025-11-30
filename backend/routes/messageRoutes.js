import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getRecentChats,
  getMessages,
  sendMessage,
  getOrCreateDMRoom,
} from "../controllers/messageController.js";
import { predictNextWords } from "../controllers/messageController.js";
import { predictLimiter } from "../middleware/ratelimiter.js";


const router = express.Router();

// making sure all routes needs authentication here
router.use(verifyToken);

// get /api/messages/recent get recent chats for the user
router.get("/recent", getRecentChats);

router.get("/:roomId/predict", predictLimiter ,predictNextWords);

// /api/messages/:roomId - get messages for specific room
router.get("/:roomId", getMessages);

// POST /api/messages/send
router.post("/send", sendMessage);



// POST /api/messages/room/create - Create or get DM room between users
router.post("/room/create", async (req, res) => {
  try {
    const { otherUserId } = req.body;
    const currentUserId = req.userId;

    if (!otherUserId) {
      return res.status(400).json({ error: "otherUserId is required" });
    }

    const room = await getOrCreateDMRoom(currentUserId, otherUserId);
    res.status(200).json({ room });
  } catch (error) {
    console.error("Error creating/getting DM room:", error);
    res.status(500).json({ error: "Failed to create/get room" });
  }
});

export default router;
