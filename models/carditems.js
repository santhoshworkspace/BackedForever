import mongoose, { connect } from "mongoose";

const CartItemStore = new mongoose.Schema({
    id:{type:mongoose.Schema.Types.ObjectId,
        ref:"AllProduct",
        require:true
    },
    price: { type: Number, required: true },
     quantity: { type: Number, default: 1 },
  total: { type: Number, required: true },
})

export default mongoose.model("CardItems",CartItemStore)