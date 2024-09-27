import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
    User_Id_Fk: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    Todo: { type: String, required: true },
    completed: { type: Boolean, required: false },
})

const TodoModel = mongoose.model("Todo", TodoSchema)

export default TodoModel