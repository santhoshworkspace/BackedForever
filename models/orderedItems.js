import mongoose from "mongoose";

const OrderItem = new mongoose.Schema({
    OrderItemId : {type:mongoose.Schema.Types.ObjectId,
        ref:"AllProduct",
        require:true
    },
    size:{type:String},
    first_name:{type:String},
    last_name:{type:String},
    email:{type:String},
    street:{type:String},
    city:{type:String},
    state:{type:String},
    zipcode:{type:Number},
    country:{type:String},
    phonenumber :{type:Number},
    createdAt:{
        type:Date,
        default:Date.now
    }
})

export default mongoose.model("orderitems",OrderItem)