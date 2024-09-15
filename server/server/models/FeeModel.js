import mongoose from 'mongoose';

const FeeSchema = new mongoose.Schema({
  User_Id_Fk: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  Monthly_Fees: {
    type: Number,
    required: true,
    min: [0, 'Fees must be a positive number']
  }
}, {
  timestamps: true
});

const FeeModels = mongoose.model('Fee', FeeSchema);

export default FeeModels;
