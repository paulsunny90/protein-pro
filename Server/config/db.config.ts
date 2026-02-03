import mongoose from "mongoose"

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("connectDB")
        
    } catch (error) {
        console.log(" not connect DB")
        
    }

}

export default connectDB