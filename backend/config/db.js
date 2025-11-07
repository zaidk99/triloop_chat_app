import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async ()=>{
    try {
        console.log("Connecting : ",process.env.MONGODB_URI);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connection: ${conn.connection.host}`);

    } catch (err) {
        console.error("DB connection Error : ",err.message);
        process.exit(1);
    }
};

export default connectDb;