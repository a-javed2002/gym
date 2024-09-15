
import ExpenseModel from '../models/ExpenseModel.js'

class ExpenseController {

  static getData = async (req, res) => {
    try {
      const result = await ExpenseModel.find()
      res.send(result)
    } catch (error) {
      console.log(error)
    }
  }

  static addData = async (req, res) => {
    try {
      const { type, Dicided_Amount } = req.body;
   
      const existingExpense = await ExpenseModel.findOne({ type });

      // if (existingExpense) {
      //     return res.status(409).json({ error: "Expense type must be unique" });
      // }

      const newExpense = new ExpenseModel({
        type,
        Dicided_Amount,
      });
  
      await newExpense.save();
      res.status(201).json({ message: "Expense added successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

  static updateData = async (req, res) => {
    try {
      const ExpenseId = req.params.id;
      const { type, Dicided_Amount} = req.body;
      
      const updatedExpense = await ExpenseModel.findByIdAndUpdate(
        ExpenseId,
        {
          type, Dicided_Amount
        },
        { new: true }
      );
      if (!updatedExpense) {
        return res.status(404).json({ error: "Expense not found" });
      }
      res.status(200).json({ message: "Expense updated successfully", Expense: updatedExpense });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  static viewSingleData = async (req, res) => {
    try {
      const ExpenseId = req.params.id;
      const Expense = await ExpenseModel.findById(ExpenseId);
      if (!Expense) {
        return res.Expense_status(404).json({ error: "Expense not found" });
      }
      res.status(200).json(Expense);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }



  static deleteData = async (req, res) => {
    try {

      const ExpenseId = req.params.id;


      await ExpenseModel.findByIdAndDelete(ExpenseId);

      // Send a success response
      res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}


export default ExpenseController