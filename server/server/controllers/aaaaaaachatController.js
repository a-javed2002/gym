import MessageModel from '../models/Message.js';
import GroupModel from '../models/group.js';

class ChatController {
    static sendMessage = async (req, res) => {
        try {
            const { sender, receiver, group, text } = req.body;
            if (!sender || (!receiver && !group) || !text) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const newMessage = new MessageModel({ sender, receiver, group, text });
            await newMessage.save();
            res.status(201).json(newMessage); // Status 201 for resource creation
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    
    static getMessages = async (req, res) => {
        try {
            const { sender, receiver, group } = req.params;
            let query = {};
    
            if (receiver) {
                // Query for messages between two users
                query = {
                    $or: [
                        { sender, receiver },
                        { sender: receiver, receiver: sender }
                    ]
                };
            } else if (group) {
                // Query for messages in a group
                query = { group };
            } else {
                return res.status(400).json({ error: 'Missing required parameters' });
            }
    
            const messages = await MessageModel.find(query)
                .populate('sender', 'User_Name')  // Fetch only the User_Name of sender
                .populate('receiver', 'User_Name')  // Fetch only the User_Name of receiver
                .exec();
    
            res.status(200).json(messages);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    
    static getGroups = async (req, res) => {
        try {
            const groups = await GroupModel.find().exec();
            res.status(200).json(groups);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    static createGroup = async (req, res) => {
        try {
            const { name, members } = req.body;
            if (!name || !members) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const newGroup = new GroupModel({ name, members });
            await newGroup.save();
            res.status(201).json(newGroup); // Status 201 for resource creation
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    
    static getUserGroups = async (req, res) => {
        try {
            const { userId } = req.params;
            const groups = await GroupModel.find({ members: userId }).exec();
            res.status(200).json(groups);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}
export default ChatController;
