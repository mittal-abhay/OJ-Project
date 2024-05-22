import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DBConnection = async () => {
    const MONGO_URI = process.env.MONGO_URI;
    try{
        await mongoose.connect(MONGO_URI, {useNewUrlParser: true});
        console.log("Connected to database!");
    }catch(err){
        console.log("Error connecting to database!", err);
    }
}

export default DBConnection;