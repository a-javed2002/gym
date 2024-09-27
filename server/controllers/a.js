import MessageModel from '../models/Message.js';
import GroupModel from '../models/group.js';
import UserModel from '../models/UserModel.js';
import TrainerModel from '../models/TrainerModel.js'
import mongoose from 'mongoose';
class ChatController {
    static sendMessage = async (req, res) => {
        try {
            const { sender, receiver, group, text } = req.body;
            
            // Initialize attachments as null
            let attachments = null;
    
            // If files are uploaded, process them
            if (req.files && req.files.length > 0) {
                attachments = req.files.map(file => ({
                    filename: file.filename,
                    fileType: file.mimetype, // Store file's MIME type
                    url: `${file.filename}` // Optional: Store the file's URL or relative path
                }));
            }
    
            // Create the message object
            const newMessage = new MessageModel({
                sender,
                receiver,
                group,
                text,
                attachments // This will be either an array of files or null
            });
    
            // Save the message in the database
            await newMessage.save();
    
            // Respond with the newly created message
            res.status(201).json(newMessage); // Status 201 for resource creation
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    
    
    // Controller method for fetching direct messages
    static getDirectMessages = async (req, res) => {
        try {
            const { loggedInUserId, receiver } = req.params;
            console.log('LoggedInUserId:', loggedInUserId);
            console.log('Receiver:', receiver);

            if (!loggedInUserId) {
                return res.status(400).json({ error: 'LoggedInUserId is required' });
            }

            if (!receiver) {
                return res.status(400).json({ error: 'Receiver is required' });
            }

            const query = {
                $or: [
                    { sender: loggedInUserId, receiver },
                    { sender: receiver, receiver: loggedInUserId }
                ]
            };

            console.log('Query:', query);
            const messages = await MessageModel.find(query)
                .populate('sender', 'User_Name')
                .populate('receiver', 'User_Name')
                .exec();

            res.status(200).json(messages);
        } catch (error) {
            console.error('Error:', error.message);
            res.status(500).json({ error: error.message });
        }
    };


    // Controller method for fetching group messages
    static getGroupMessages = async (req, res) => {
        try {
            const { groupId } = req.params;
            console.log('GroupId:', groupId);

            if (!groupId) {
                return res.status(400).json({ error: 'GroupId is required' });
            }

            const query = { group: groupId };

            console.log('Query:', query);
            const messages = await MessageModel.find(query)
                .populate('sender', 'User_Name')
                .exec();

            res.status(200).json(messages);
        } catch (error) {
            console.error('Error:', error.message);
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
    static members = async (req, res) => {
        try {
            const userId = req.params.loginid; // Extract loginid from the route
            const groupId = req.params.groupid; // Extract groupid from the route
    
            if (!userId || !groupId) {
                return res.status(400).json({ error: "User ID and Group ID are required" });
            }
    
            // Find the group by groupId
            const group = await GroupModel.findById(groupId);
            const memberid=group.members
    
            if (!group) {
                return res.status(404).json({ error: 'Group not found' });
            }

    
            // Find all members not in the group
           const memberlist = await TrainerModel.find({
            Client_id_Fk: { $nin: memberid },
           User_id_Fk: userId
          });
    
            // Return the filtered list of group members
            res.status(200).json(memberlist);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    
    
    
    static createGroup = async (req, res) => {
        try {
            const { name, members } = req.body;
            const newGroup = new GroupModel({ name, members });
            await newGroup.save();
            res.status(201).json(newGroup); // Status 201 for resource creation
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // Get groups for a user
    static getUserGroups = async (req, res) => {
        try {
            const { userId } = req.params;
            const groups = await GroupModel.find({ members: userId }).exec();
            res.status(200).json(groups);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    
    // Get groups for a user
    static delete = async (req, res) => {
        const { messageIds } = req.body;
    try {
        await MessageModel.deleteMany({ _id: { $in: messageIds } });
        res.status(200).send('Messages deleted');
    } catch (error) {
        console.log(error)
        res.status(500).send('Error deleting messages');
    }
    };
    static deleteid = async (req, res) => {
        const { id } = req.params;
        const { type } = req.body; // 'contact' or 'group'
    
        try {
            if (type === 'contact') {
                // Delete all messages associated with the contact
                await MessageModel.deleteMany({
                    $or: [
                        { receiver: id },  // Messages where the contact is the receiver
                        { sender: id }      // Messages where the contact is the sender
                    ]
                });
    
                // Optionally, you might also want to delete the contact from user’s contact list
                // Assuming there's a User model with a contacts array
                await UserModel.updateMany(
                    { contacts: id },
                    { $pull: { contacts: id } }
                );
    
                res.status(200).send('Contact chat and related messages deleted');
    
            } else if (type === 'group') {
                // Delete all messages associated with the group
                await MessageModel.deleteMany({ group: id });
    
                // Delete the group itself
                await GroupModel.findByIdAndDelete(id);
    
                // Optionally, you might want to update the users’ group list
                // Assuming there's a User model with a groups array
                await UserModel.updateMany(
                    { groups: id },
                    { $pull: { groups: id } }
                );
    
                res.status(200).send('Group chat and related messages deleted');
    
            } else {
                res.status(400).send('Invalid chat type');
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
            res.status(500).send('Error deleting chat');
        }
    };
}
export default ChatController;