import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();


export const dbConnect= async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI as string, {
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB");
    }
}


