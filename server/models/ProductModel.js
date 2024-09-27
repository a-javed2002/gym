import mongoose from "mongoose";

// Define the schema
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String, required: false },
  weight: { type: String, required: true },
}, { timestamps: true });

// Create the model
const ProductModel = mongoose.model('Product', ProductSchema);

export default ProductModel;
