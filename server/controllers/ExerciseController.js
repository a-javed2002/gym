import FeeModels from '../models/FeeModel.js';
import UserModel from '../models/UserModel.js';

class ExerciseController {

  static getData = async (req, res) => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json');
      
      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Parse the JSON data
      const data = await response.json();
      
      // Send the data as a response
      res.send(data);
    } catch (error) {
      // Log the error and send a 500 status code
      console.error(error);
      res.status(500).send('Error fetching data');
    }
  }

  
  static createFee = async (req, res) => {
    try {
      const { User_Id_Fk, Monthly_Fees } = req.body;
      const fee = new FeeModels({ User_Id_Fk, Monthly_Fees });
      await fee.save();
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

  static getFeeById = async (req, res) => {
    try {
      // Fetch the data from the URL
      const response = await axios.get('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json');
      
      // Send the data as a response
      res.send(response.data);
    } catch (error) {
      // Log the error and send a 500 status code
      console.error(error);
      res.status(500).send('Error fetching data');
    }
  }



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

export default ExerciseController;
