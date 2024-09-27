import mongoose from "mongoose";
const basicInfoSchema = new mongoose.Schema({
    gender: { type: String, enum: ['male', 'female', 'other'], required: false },
    age: { type: Number, min: 0, required: false },
    height: { type: Number, min: 0, required: false },
    weight: { type: Number, min: 0, required: false },
});

export default basicInfoSchema;
