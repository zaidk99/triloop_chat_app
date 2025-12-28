import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async ()=>{
    try {
        console.log("connecting to MongoDB");
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connection: ${conn.connection.host}`);

    } catch (err) {
        console.error("DB connection Error : Database Connection Failed ");
        process.exit(1);
    }
};

export default connectDb;