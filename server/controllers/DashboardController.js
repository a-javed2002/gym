import mongoose from "mongoose";
import WorkoutModel from '../models/WorkoutModel.js'
import UserModel from '../models/UserModel.js'
import FeeModel from "../models/FeeModel.js"; // Import your Fee model
import OrderModel from "../models/OrderModel.js";
import NutritionModel from "../models/NutritionModel.js";
import TrainerModel from "../models/TrainerModel.js";
class DashboardController {

  static getData = async (req, res) => {
    try {
      // If no user ID is provided, get aggregate data
      if (!req.params.id) {
        const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const nextMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
  
        // Aggregate fees
        const fees = await FeeModel.aggregate([
          {
            $match: {
              createdAt: {
                $gte: currentMonthStart,
                $lt: nextMonthStart,
              },
            },
          },
          {
            $group: {
              _id: null,
              totalFees: { $sum: "$Monthly_Fees" },
            },
          },
        ]);
  
        // Aggregate orders
        const orders = await OrderModel.aggregate([
          {
            $match: {
              createdAt: {
                $gte: currentMonthStart,
                $lt: nextMonthStart,
              },
            },
          },
          {
            $group: {
              _id: null,
              totalOrderAmount: { $sum: "$totalAmount" },
            },
          },
        ]);
  
        const totalFees = fees.length > 0 ? fees[0].totalFees : 0;
        const totalOrderAmount = orders.length > 0 ? orders[0].totalOrderAmount : 0;
        const totalSales = totalFees + totalOrderAmount;
  
        const totalUser = await UserModel.countDocuments({ User_Role: "User" });
        const totalTrainer = await UserModel.countDocuments({ User_Role: "Trainer" });
  
        const result = {
          totalUser,
          totalTrainer,
          totalSales,
        };
  
        return res.send(result);
      } else {
        const userId = req.params.id;
  
        if (!userId) {
          return res.status(400).json({ error: "User ID is required" });
        }
  
        const user = await UserModel.findById(userId);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
  
        let trainerClientCount = 0;
  
        if (user.User_Role === "Trainer") {
          const trainerData = await TrainerModel.findOne({ User_id_Fk: userId });
          trainerClientCount = trainerData ? trainerData.Client_id_Fk.length : 0;
        }
  
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
  
        // Get total calories for the user
        const logs = await NutritionModel.aggregate([
          {
            $match: {
              user_id: new mongoose.Types.ObjectId(userId),
              date: {
                $gte: startOfMonth,
                $lt: endOfMonth,
              },
            },
          },
          {
            $unwind: "$foods",
          },
          {
            $group: {
              _id: null,
              totalCalories: { $sum: { $toInt: "$foods.calories" } },
            },
          },
        ]);
  
        const totalCalories = logs.length > 0 ? logs[0].totalCalories : 0;
  
        const calorieLogs = await WorkoutModel.aggregate([
          {
            $match: {
              user_id_Fk: new mongoose.Types.ObjectId(userId),
              date: {
                $gte: startOfMonth,
                $lt: endOfMonth,
              },
            },
          },
          {
            $addFields: {
              Calorie_Burn: {
                $cond: {
                  if: { $eq: ["$Calorie_Burn", ""] },
                  then: "0",  // Set empty strings to "0"
                  else: "$Calorie_Burn",
                },
              },
            },
          },
          {
            $addFields: {
              Calorie_Burn: { $toDouble: "$Calorie_Burn" }  // Convert to number
            },
          },
          {
            $group: {
              _id: null,
              totalCalorieBurn: { $sum: "$Calorie_Burn" },
            },
          },
        ]);
        
        const totalCaloriesBurned = calorieLogs.length > 0 ? calorieLogs[0].totalCalorieBurn : 0;
        
        return res.send({
          totalCalories,
          trainerClientCount,
          totalCaloriesBurned: totalCaloriesBurned || 0,
        });
        
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
  };
  






}


export default DashboardController