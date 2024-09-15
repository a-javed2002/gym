import mongoose from "mongoose";

const NutritionLogSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now, required: true },
    meal_type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snacks'], required: true },
    foods: [{
        name: { type: String, required: true },
        quantity: { type: String,  required: true },
        calories: { type: String, required: true },
        macros: {
            protein: { type: String,  },
            carbs: { type: String,  },
            fat: { type: String, }
        }
    }]
});

const NutritionModel = mongoose.model('NutritionLog', NutritionLogSchema);

export default NutritionModel;


