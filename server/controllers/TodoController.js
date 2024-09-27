
import TodoModel from '../models/TodoModel.js'

class TodoController {

  static getData = async (req, res) => {
    try {
      const userId = req.params.id;
      const result = await TodoModel.find({User_Id_Fk:userId})
      res.send(result)
    } catch (error) {
      console.log(error)
    }
  }

  static addData = async (req, res) => {
    try {
      const {  Todo ,userId } = req.body;
      const Todos = new TodoModel({
        Todo,
        completed: false,
        User_Id_Fk:userId 

      })
      await Todos.save();
      res.status(201).json({ message: "Todo addes succesfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Errror" });
    }
  }

  static updateData = async (req, res) => {
    const { completed } = req.body;
    const { id } = req.params;
  
    try {
      const updatedTodo = await TodoModel.findByIdAndUpdate(
        id,
        { completed: !!completed }, 
        { new: true }
      );
  
      if (!updatedTodo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
  
      res.json(updatedTodo);
    } catch (error) {
      console.error('Error updating todo:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  static viewSingleData = async (req, res) => {
    try {
      const TodoId = req.params.id;
      const Todo = await TodoModel.findById(TodoId);
      if (!Todo) {
        return res.Todo_status(404).json({ error: "Todo not found" });
      }
      res.status(200).json(Todo);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }



  static deleteData = async (req, res) => {
    try {

      const TodoId = req.params.id;


      await TodoModel.findByIdAndDelete(TodoId);


      res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}


export default TodoController