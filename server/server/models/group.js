import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const GroupModel = mongoose.model('Group', groupSchema);
export default GroupModel;
