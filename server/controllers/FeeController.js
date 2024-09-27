import FeeModels from '../models/FeeModel.js';
import UserModel from '../models/UserModel.js';
import nodemailer from 'nodemailer';
class FeeController {
  static createFee = async (req, res) => {
    try {
      const { User_Id_Fk, Monthly_Fees } = req.body;
      const fee = new FeeModels({ User_Id_Fk, Monthly_Fees });
      await fee.save();

      const user = await UserModel.findById( User_Id_Fk);
      const result = await UserModel.updateOne(
        { _id: User_Id_Fk },
        {
          $set: {
            User_Status: '1',
            updatedAt: new Date()
          }
        }
      );
      if (result.modifiedCount === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      const pdfPath = req.file.path;

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
        text: 'Please find your fee receipt attached..',
        attachments: [
          {
            filename: 'FeeReceipt.pdf',
            path: pdfPath,
          },
        ],
      };


      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');

      res.status(201).json({ success: true, data: fee });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static SearchData = async (req, res) => {
    const query = req.query.query || '';
    try {
      const users = await UserModel.find({
        $or: [
          { User_Name: { $regex: query, $options: 'i' } },
          { User_Email: { $regex: query, $options: 'i' } }
        ]
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

// Controller method
static getFeeByuserId = async (req, res) => {
  const userId = req.params.userId; // Extract userId from request parameters
  console.log(`Fetching fees for userId: ${userId}`);
  try {
    const fees = await FeeModels.find({ User_Id_Fk: userId }) // Find fees by User_Id_Fk
      .populate('User_Id_Fk', 'User_Name User_Email User_FatherName Subcribtion User_Status User_Image User_Phone createdAt updatedAt');

    if (fees.length === 0) {
      return res.status(404).json({ success: false, message: 'No fees found for this user' });
    }

    res.status(200).json({ success: true, data: fees });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}
  static getFeeById = async (req, res) => {
    try {
      const fee = await FeeModels.findById(req.params.id).populate('User_Id_Fk');
      if (!fee) {
        return res.status(404).json({ success: false, message: 'Fee not found' });
      }
      res.status(200).json({ success: true, data: fee });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
  static getAllFees = async (req, res) => {
    try {
      const { year, month } = req.query;
      const query = {};
  
      if (year) {
        query.createdAt = { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) };
      }
  
      if (month) {
        query.createdAt = {
          $gte: new Date(`${year}-${month}-01`),
          $lte: new Date(`${year}-${month}-31`),
        };
      }
  
      const fees = await FeeModels.find(query)
        .populate('User_Id_Fk', 'User_Name User_Email User_FatherName Subcribtion User_Status User_Image User_Phone createdAt updatedAt');
      res.status(200).json({ success: true, data: fees });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
  
  static updateFee = async (req, res) => {
    try {
      const { User_Id_Fk, Monthly_Fees } = req.body;
      const fee = await FeeModels.findByIdAndUpdate(
        req.params.id,
        { User_Id_Fk, Monthly_Fees },
        { new: true, runValidators: true }
      );
      if (!fee) {
        return res.status(404).json({ success: false, message: 'Fee not found' });
      }
      res.status(200).json({ success: true, data: fee });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static deleteFee = async (req, res) => {
    try {
      const fee = await FeeModels.findByIdAndDelete(req.params.id);
      if (!fee) {
        return res.status(404).json({ success: false, message: 'Fee not found' });
      }
      res.status(200).json({ success: true, message: 'Fee deleted successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

export default FeeController;
