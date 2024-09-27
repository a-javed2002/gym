import NutritionModel from '../models/NutritionModel.js'; // Adjust the path as needed

class NutritionController {
  // Create a new nutrition log
  static async createNutritionLog(req, res) {
    try {
      const nutritionLog = new NutritionModel(req.body);
      await nutritionLog.save();
      res.status(201).json(nutritionLog);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get all nutrition logs
  static async getAllNutritionLogs(req, res) {
    try {
      const nutritionLogs = await NutritionModel.find().populate('user_id');
      res.status(200).json(nutritionLogs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static DateUpdate = async (req, res) => {
    const { id } = req.params;
    const { date } = req.body;

    try {
        // Validate date format
        if (!Date.parse(date)) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        const updatedWorkout = await NutritionModel.findByIdAndUpdate(id, { date: new Date(date) }, { new: true });
        if (!updatedWorkout) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        res.json(updatedWorkout);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
  // Get a nutrition log by ID
  static async getNutritionLogById(req, res) {
    try {
      const { id } = req.params;
      const nutritionLog = await NutritionModel.findById(id).populate('user_id');
      if (!nutritionLog) {
        return res.status(404).json({ message: 'Nutrition log not found' });
      }
      res.status(200).json(nutritionLog);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
// Get nutrition logs by user ID
static async getNutritionLogByUserId(req, res) {
  try {
    const { id } = req.params; // Extract user ID from route parameters
    
    // Find nutrition logs by user_id
    const nutritionLogs = await NutritionModel.find({ user_id: id }).populate('user_id');

    if (nutritionLogs.length === 0) {
      return res.status(404).json({ message: 'No nutrition logs found for this user' });
    }

    res.status(200).json(nutritionLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

  // Update a nutrition log by ID
  static async updateNutritionLog(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const options = { new: true };
      const updatedNutritionLog = await NutritionModel.findByIdAndUpdate(id, updates, options).populate('user_id');
      if (!updatedNutritionLog) {
        return res.status(404).json({ message: 'Nutrition log not found' });
      }
      res.status(200).json(updatedNutritionLog);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete a nutrition log by ID
  static async deleteNutritionLog(req, res) {
    try {
      const { id } = req.params;
      const deletedNutritionLog = await NutritionModel.findByIdAndDelete(id);
      if (!deletedNutritionLog) {
        return res.status(404).json({ message: 'Nutrition log not found' });
      }
      res.status(200).json({ message: 'Nutrition log deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default NutritionController;
