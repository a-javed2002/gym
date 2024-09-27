
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
      const {  Expense_Name, } = req.body;
      const Expense = new ExpenseModel({
        Expense_Name,
      })
      await Expense.save();
      res.status(201).json({ message: "Expense addes succesfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Errror" });
    }
  }

  static updateData = async (req, res) => {
    try {
      const ExpenseId = req.params.id;
      const {    Expense_Name, } = req.body;
      const updatedExpense = await ExpenseModel.findByIdAndUpdate(
        ExpenseId,
        {
          Expense_Name,
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