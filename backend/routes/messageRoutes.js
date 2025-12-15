import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getRecentChats,
  getMessages,
  sendMessage,
  getOrCreateDMRoom,
} from "../controllers/messageController.js";

import { predictNextWords } from "../controllers/messageController.js";
import { predictLimiter } from "../middleware/rateLimiter.js";

const messageRoutes = (io) => {
  const router = express.Router();

  router.use(verifyToken);
  // router.post("/send", (req, res) => {
  //    console.log("Route /send hit, calling sendMessage");
  //   sendMessage(req, res, io)
  // });

  router.post("/send", async (req, res) => {
  console.log("POST /send route hit");
  try {
    await sendMessage(req, res, io);
  } catch (error) {
    console.error("Error in send route handler:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to send message" });
    }
  }
});

  router.get("/recent", getRecentChats);
  router.get("/:roomId/predict", predictLimiter, predictNextWords);

  router.get("/:roomId", getMessages);

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
      console.error("Error creating / getting DM room ", error);
      res.status(500).json({ error: "Failed to create/get DM room " });
    }
  });
  return router;
};

export default messageRoutes;
