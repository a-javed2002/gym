import mongoose from "mongoose";

const progressLogSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now, required: true },
    weight: { type: Number, min: 0 },
    body_measurements: {
        chest: { type: Number, min: 0 },
        waist: { type: Number, min: 0 },
        hips: { type: Number, min: 0 }
    },
    performance_metrics: {
        run_times: { type: Number, min: 0 },
        lifting_weights: { type: Number, min: 0 }
    }
});

const ProgressLog = mongoose.model('ProgressLog', progressLogSchema);

export default ProgressLog;
