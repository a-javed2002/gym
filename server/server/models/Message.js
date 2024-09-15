import mongoose from 'mongoose';
const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Only for direct messages
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },  // Only for group messages
    text: { type: String },
    attachments: [
        {
            filename: { type: String, required: false },
            fileType: { type: String, required: false },  // Optional, can be null
            url: { type: String, required: false }  // Optional, can be null
        }
    ],
    
    createdAt: { type: Date, default: Date.now }
});

const MessageModel = mongoose.model('Message', messageSchema);
export default MessageModel;
