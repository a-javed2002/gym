
import UserModel from '../models/UserModel.js'
import TrainerModel from '../models/TrainerModel.js'
import FeeModels from '../models/FeeModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import ReactDOMServer from 'react-dom/server';
import mongoose from 'mongoose';

class UserController {

  static getData = async (req, res) => {
    try {

      const result = await UserModel.find({ User_Role: 'User' });
      res.send(result)
    } catch (error) {
      console.log(error)
    }
  }

  static getcontact = async (req, res) => {
    try {

      const result = await UserModel.find();
      res.send(result)
    } catch (error) {
      console.log(error)
    }
  }

  static getTrainercontact = async (req, res) => {
    try {
      const userId = req.params.loginid;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      const trainer = await TrainerModel.findOne({ User_id_Fk: userId });
      if (!trainer) {
        return res.status(404).json({ error: "Trainer not found" });
      }
      const clientIds = trainer.Client_id_Fk;
      const admins = await UserModel.find({ User_Role: 'Admin' });
      const clients = await UserModel.find({ _id: { $in: clientIds } });
      admins.forEach(admin => clients.push(admin));
      res.json(clients);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' }); // Properly handle errors
    }
  }

  static getUsercontact = async (req, res) => {
    try {
      const userId = req.params.loginid;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
  
      // Find a trainer where the user is listed as a client
      const trainer = await TrainerModel.findOne({ Client_id_Fk: userId });
      if (!trainer) {
        return res.status(404).json({ error: "Trainer not found for this client" });
      }
  
      // Extract trainer's user ID
      const trainerUserId = trainer.User_id_Fk;
  
      // Find all admin users
      const admins = await UserModel.find({ User_Role: 'Admin' });
  
      // Find the trainer's user information
      const trainerUser = await UserModel.findOne({ _id: trainerUserId });
  
      // Combine admins and trainer user information
      const result = [trainerUser, ...admins];
  
      // Respond with the result in JSON format
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  };
  


  static getTrainer = async (req, res) => {
    try {
      const trainers = await TrainerModel.find()
        .populate({
          path: 'User_id_Fk',
          match: { User_Role: 'Trainer' }  // Filter users by User_Role = 'Trainer'
        })
        .populate('Client_id_Fk');  // Fetch all clients

      // Filter out any trainers that have no matching user with the 'Trainer' role
      const filteredTrainers = trainers.filter(trainer => trainer.User_id_Fk);

      res.status(200).json(filteredTrainers);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static getClient = async (req, res) => {
    try {
      const loggedInUserId = req.params.id;

      const clients = await TrainerModel.find({ User_id_Fk: loggedInUserId })
        .populate({
          path: 'Client_id_Fk',
          select: 'User_Name User_Email User_Role User_Status User_FatherName User_Phone User_Image Subcribtion'
        });


      // Send the fetched clients in the response
      res.status(200).json(clients);

    } catch (error) {
      console.error('Error fetching clients:', error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static getTrainerId = async (req, res) => {
    try {
      const selectedId = req.params.id;

      const trainer = await TrainerModel.findOne({ Client_id_Fk: selectedId })
        .populate({
          path: 'User_id_Fk',
          select: 'User_Name User_Email User_Role User_Status User_FatherName User_Phone User_Image Subcribtion'
        });

      res.status(200).json(trainer);
    } catch (error) {
      console.error('Error fetching trainer details:', error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static addData = async (req, res) => {

    try {

      const {
        User_Name,
        User_Email,
        User_Password,
        User_FatherName,
        User_Phone,
        User_Status,
        User_Role,
        Trainer_id_Fk,
        Subcribtion,
        TrainerTimes,
        SalaryDetails,
        UserTiming,
        gender, // New field
        age, // New field
        height, // New field
        weight, // New field
      } = req.body;
      const imageUrls = req.file.filename;

      // Check if user already exists

      const existingUser = await UserModel.findOne({
        $or: [{ User_Email }]
      });


      if (existingUser) {
        return res.status(409).json({ error: "User already exists" });
      }
      // Hash the password
      const hash = await bcrypt.hash(User_Password, 10);

      // Create new user
      const user = new UserModel({
        User_Name,
        User_Email,
        User_Password: hash,
        User_FatherName,
        User_Image: imageUrls,
        User_Phone,
        User_Status,
        User_Role,
        Subcribtion,
        UserTiming,
        gender, // New field
        age, // New field
        height, // New field
        weight, // New field
        UserTiming
      });

      await user.save();
      const userId = user._id;
      console.log('User ID:', userId);
      // Conditionally create Trainer model
      if (Subcribtion === 'Premium' && User_Role === 'User') {


        await TrainerModel.findOneAndUpdate(
          { User_id_Fk: Trainer_id_Fk },
          { $addToSet: { Client_id_Fk: userId } },
          { new: true } // Options: return the updated document
        );
      } else if (User_Role === 'Trainer') {
        const trainer = new TrainerModel({
          TrainerTimes,
          User_id_Fk: userId,
          SalaryDetails,        
        });

        await trainer.save();
      }
      const emailHtml = `
      <div style="font-family: Arial, sans-serif; background-color: white; padding: 20px; text-align: center;">
        <div style="background-color: #7571f9; color: #ffffff; padding: 10px 0; font-size: 24px; font-weight: bold;">
          Welcome to Gym Portal!
        </div>
        <div style="background-color: #ffffff; margin: 20px auto; padding: 20px; border-radius: 5px; max-width: 600px;">
          <p style="font-size: 16px; color: #333333;">
            Hi ${User_Name},
          </p>
          <p style="font-size: 16px; color: #333333;">
            Thank you for registering with us. We're thrilled to have you on board. Click the button below to start exploring our features.
          </p>
          <a href="https://example.com/dashboard" style="display: inline-block; padding: 10px 20px; margin-top: 20px; font-size: 16px; font-weight: bold; color: #ffffff; background-color: #7571f9; text-decoration: none; border-radius: 5px;">
            Go to Dashboard
          </a>
          <p style="margin-top: 20px; font-size: 14px; color: #666666;">
            If you have any questions, feel free to <a href="mailto:support@example.com">contact our support team</a>.
          </p>
        </div>
      </div>
    `;

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'mhuzaifa05302@gmail.com',
          pass: 'alpu ngqj ouox zesk'
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'mhuzaifa0530@gmail.com',
        subject: 'Your Fee Recipt',
        html: emailHtml,

      };


      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
      // Respond with success message
      res.status(201).json({
        message: "User added successfully",
        id: userId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt // Mongoose will automatically set these
      });
    } catch (error) {
      console.log(error); 
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }    
  }
  static updateData = async (req, res) => {
    try {
      const userId = req.params.id;
      const {
        User_Name,
        User_FatherName,
        User_Phone,
        gender,
        age,
        height,
        weight,
      } = req.body;

      let imageUrl = null;

      // Check if a file was uploaded
      if (req.file) {
        imageUrl = req.file.filename; // or req.file.path depending on multer configuration
      }

      // Construct update object
      const updateFields = {
        User_Name,
        User_FatherName,
        User_Phone,
        gender,
        age,
        height,
        weight,
      };

      // Include the image URL if a file was uploaded
      if (imageUrl) {
        updateFields.User_Image = imageUrl;
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        updateFields,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }


  static viewSingleData = async (req, res) => {
    try {
      const userId = req.params.id;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };





  static viewSingleTrainer = async (req, res) => {
    try {
      const id = req.params.id;
      const trainer = await TrainerModel.findOne({ User_id_Fk: id })
        .populate({
          path: 'User_id_Fk',
          select: 'User_Name User_Email User_Role User_Status User_FatherName User_Phone User_Image Subcribtion'
        });

      if (!trainer) {
        return res.status(404).json({ error: "Trainer not found" });
      }

      res.status(200).json(trainer);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  // UserController.js or TrainerController.js

  static updateTrainerTimeSlots = async (req, res) => {
    try {
      const id = req.params.id;
      const { TrainerTimes,SalaryDetails } = req.body;

      console.log( req.body)
      if (!Array.isArray(TrainerTimes) || !Array.isArray(SalaryDetails)) {
        return res.status(400).json({ error: "Invalid data format" });
      }
  
      // Update the trainer's time slots
      const updatedTrainer = await TrainerModel.findOneAndUpdate(
        { User_id_Fk: id },
        { $set: { TrainerTimes, SalaryDetails } },
        { new: true }
      );

      if (!updatedTrainer) {
        return res.status(404).json({ error: "Trainer not found" });
      }

      res.status(200).json(updatedTrainer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


























  static updateUserData = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        User_Role,
        Trainer_id_Fk,
        Subcribtion,
        TrainerTimes,
        UserTiming
      } = req.body;

      if (!id || !User_Role || !Trainer_id_Fk) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const updateFields = {
        User_Role,
        Trainer_id_Fk,
        Subcribtion,
        TrainerTimes,
        UserTiming
      };

      const updatedUser = await UserModel.findByIdAndUpdate(id, updateFields, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const trainers = await TrainerModel.find();

      if (!trainers || trainers.length === 0) {
        console.log(`No trainers found.`);
        return res.status(404).json({ error: "No trainers found" });
      }

      const userObjectId = updatedUser._id;
      console.log('User Object ID:', userObjectId);

      for (const trainer of trainers) {
        if (Subcribtion === 'Premium' && User_Role === 'User') {
          const clientIdExists = trainer.Client_id_Fk && trainer.Client_id_Fk.some(id => id.equals(userObjectId));
          console.log('Client IDs in Trainer:', trainer.Client_id_Fk);
          console.log('Client ID Exists:', clientIdExists);

          if (clientIdExists) {
            await TrainerModel.updateOne(
              { _id: trainer._id },
              { $pull: { Client_id_Fk: userObjectId } },
              { new: true }
            );
            console.log('Client ID removed from Trainer.');

            // Verify update
            const updatedTrainer = await TrainerModel.findById(trainer._id);
            console.log('Client IDs after removal:', updatedTrainer.Client_id_Fk);
          }

          await TrainerModel.updateOne(
            { User_id_Fk: Trainer_id_Fk },
            { $addToSet: { Client_id_Fk: userObjectId } },
            { new: true }
          );
          console.log('Client ID added to Trainer.');

          // Verify update
          const updatedTrainer = await TrainerModel.findById(trainer._id);
          console.log('Client IDs after addition:', updatedTrainer.Client_id_Fk);
        } else if (User_Role === 'Trainer') {
          await TrainerModel.updateOne(
            { _id: trainer._id },
            { $set: { TrainerTimes } },
            { new: true, upsert: true }
          );
          console.log('TrainerTimes updated successfully.');
        }
      }

      res.status(200).json({
        message: "User updated successfully",
        id: updatedUser._id,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      });
    } catch (error) {
      console.error('Error updating user data:', error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }














































  static updateStatus = async (req, res) => {
    try {
      const userId = req.params.id;
      const { User_Status } = req.body;

      // Only update the User_Status field
      const updateduser = await UserModel.findByIdAndUpdate(
        userId,
        { User_Status },
        { new: true }
      );

      if (!updateduser) {
        return res.status(404).json({ error: "user not found" });
      }

      res.status(200).json({ message: "user updated successfully", user: updateduser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static deleteData = async (req, res) => {
    try {
      const userId = req.params.id;

      // Find the user by ID to check their role
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if the user is a trainer
      if (user.User_Role === "Trainer") {
        // Delete the associated Trainer document
        await TrainerModel.findOneAndDelete({ User_id_Fk: userId });
      }

      // Delete the user
      await UserModel.findByIdAndDelete(userId);

      // Send a success response
      res.status(200).json({ message: "User and associated trainer data deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }





  static login = async (req, res) => {
    try {
      const { User_Email, User_Password } = req.body;
      const db_user = await UserModel.findOne({ User_Email });
      if (!db_user) {
        return res.status(404).json({ error: "Invalid Email And Password" });
      }
      if (db_user.User_Status !== '1') {
        return res.status(403).json({ error: "User account is not active" });
      }
      const fee = await FeeModels.findOne({ User_Id_Fk: db_user._id });
      if (fee) {

        const feeDate = new Date(fee.createdAt);
        const currentDate = new Date();

        // Check if the feeDate is in the future
        if (feeDate > currentDate) {
          return res.status(400).json({ error: "Fee date is in the future. Please check the data." });
        }

        // Calculate day difference
        const dayDifference = Math.floor((currentDate - feeDate) / (1000 * 60 * 60 * 24));

        if (dayDifference > 30) {
          db_user.User_Status = '0';
          await db_user.save();
          return res.status(401).json({ error: "Your Fees Is Due" });
        }


      }
      const passwordMatch = await bcrypt.compare(User_Password, db_user.User_Password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid Email And Password" });
      }
      const token = jwt.sign(
        {
          user: db_user._id,
        },
        process.env.JWT_SECRET
      );
      res.status(200).json({
        token,
        role: db_user.User_Role,
        id: db_user._id,
        username: db_user.User_Name,
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };





}


export default UserController