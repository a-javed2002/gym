import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
    type: { type: String, enum: ['Premium', 'Basic'], required: false },
    Dicided_Amount: {
        type: String,
        required: true
    }
});

const ExpenseModel = mongoose.model("Expense", ExpenseSchema);

export default ExpenseModel;
