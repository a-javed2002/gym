import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    User_Name: { type: String, required: true },
    User_Email: { type: String, required: true },
    User_Password: { type: String, required: true },
    User_Status: { type: String, required: true },
    User_Role: { type: String, required: true },
    User_FatherName: { type: String, required: false },
    User_Image: { type: String, required: true },
    User_Phone: { type: String, required: true },
    Subcribtion: { type: String, required: false },
    gender: { type: String, enum: ['male', 'female', 'other'], required: false },
    age: { type: Number, min: 0, required: false },
    height: { type: Number, min: 0, required: false },
    weight: { type: Number, min: 0, required: false },
    UserTiming: {type: String, required: false },

}, { timestamps: true }); 
const UserModel = mongoose.model("User", userSchema);

export default UserModel;
