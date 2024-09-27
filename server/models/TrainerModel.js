import mongoose from 'mongoose';

// Define the schema
const TrainerSchema = new mongoose.Schema({

  User_id_Fk: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },


  Client_id_Fk: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }],
  TrainerTimes: [{
    arrival: { type: String, required: true },
    departure: { type: String, required: true }
  }],
  SalaryDetails: [{
    Amount: { type: String, required: true },
    DateReceived: { type: String, required: false },
    Status: { type: String, required: false },
  }]
}, { timestamps: true });


// Create the model
const TrainerModel = mongoose.model('Trainer', TrainerSchema);

export default TrainerModel;
