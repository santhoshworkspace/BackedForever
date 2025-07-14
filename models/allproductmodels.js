import mongoose from "mongoose";

const allProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: [{ type: String, required: true }],
});

export default mongoose.model("AllProduct", allProductSchema);
