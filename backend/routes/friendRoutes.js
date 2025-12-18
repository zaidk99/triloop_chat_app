import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  sendFriendRequest,
  respondToFriendRequest,
  cancelFriendRequest,
  getFriendRequests,
  getFriends,
  searchUsers,
} from "../controllers/friendController.js";

export const friendRoutes = (io) => {
  const router = express.Router();

  router.use((req, res, next) => {
    req.io = io;
    next();
  });

  //   router.post("/request/:receiverId", verifyToken, sendFriendRequest);
  //   router.post("/respond/:requestId", verifyToken, respondToFriendRequest);
  //   router.post("/cancel/:requestId", verifyToken, cancelFriendRequest);

  router.post("/request/:receiverId", verifyToken, (req, res) =>
    sendFriendRequest(req, res, req.io)
  );
  router.post("/respond/:requestId", verifyToken, (req, res) =>
    respondToFriendRequest(req, res, req.io)
  );
  router.post("/cancel/:requestId", verifyToken, (req, res) =>
    cancelFriendRequest(req, res, req.io)
  );

  router.get("/requests", verifyToken, getFriendRequests);
  router.get("/list", verifyToken, getFriends);
  router.get("/search", verifyToken, searchUsers);

  return router;
};

export default friendRoutes;
