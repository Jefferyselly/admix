const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
 amount : {
     type : Number
 },
  payment_method : {
    type : String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
