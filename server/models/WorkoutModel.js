import mongoose from "mongoose";

const WorkoutSchema = new mongoose.Schema({
    user_id_Fk: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now, required: true },
    exercise_id: [{ type: String, required: true }], // Changed to an array of strings
    Status: { type: String, required: false },
    Calorie_Burn: { type: String, required: false },
});

const WorkoutModel = mongoose.model('Workout', WorkoutSchema);

export default WorkoutModel;
