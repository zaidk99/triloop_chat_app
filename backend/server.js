import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import express from "express";
import rateLimit from "express-rate-limit";
import connectDb from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import http from "http";
import {Server} from "socket.io";
import { socketManager } from "./socket/socketManager.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import friendRoutes from "./routes/friendRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";


dotenv.config();
const app = express();


connectDb();


app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());


const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 1000 req/min in dev, 100 in prod
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);


const server = http.createServer(app);
const io = new Server(server,{
    cors : {
      origin : process.env.CORS_ORIGIN,
      credentials: true,
    },
});

socketManager(io);


app.use("/api/auth", authRoutes);
app.use("/api/rooms",roomRoutes);
app.use("/api/friends" , friendRoutes);
app.use("/api/messages",messageRoutes(io));
console.log("Message routes registered with io:", !!io);


app.post("/test", (req, res) => {
  res.json({ message: "Test route works" });
});


app.use((req, res, next) => {
  console.log("No route matched for:", req.method, req.url);
  next();
});




const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
