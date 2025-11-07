import express from "express";
import { signUp , logIn , logOut } from '../controllers/authController.js';
import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/signup",signUp);
router.post("/login",logIn);
router.get("/check" , verifyToken , (req,res)=>{
    res.json({authenticated:true});
});
router.post("/logout",logOut);

export default router;

