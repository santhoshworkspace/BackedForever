import mongoose from 'mongoose'

export const Connectdb = async()=>{
    try{
        const Connectdata = await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB Connected")
    }
    catch{
        console.log("MongoDB NotConnected")
    }
}