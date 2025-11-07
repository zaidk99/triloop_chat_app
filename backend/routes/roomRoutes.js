import express from "express";
import { createRoom , getAllrooms } from "../controllers/roomController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create",verifyToken,createRoom);
router.get("/public",verifyToken,getAllrooms);

export default router;



