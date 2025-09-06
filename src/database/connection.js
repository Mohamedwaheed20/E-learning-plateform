
import mongoose from "mongoose";

export const database_connect =async()=>{
    try {
        await mongoose.connect(process.env.database_url);
        console.log("database connected!");
        
    } catch (error) {
        console.log(error);
        
    }
}
