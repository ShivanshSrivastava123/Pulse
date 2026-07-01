import mongoose from "mongoose";
import dns from "dns";

// Force Node.js to use Google's Public DNS, bypassing your ISP
dns.setServers(['8.8.8.8', '8.8.4.4']);

export const connectDB = async() => {
    try {
        mongoose.connection.on('connected', ()=> console.log("Database Connected!!"))
        await mongoose.connect(`${process.env.MONGODB_URI}`)
    } catch (error) {
        console.log(error.message)
    }
}