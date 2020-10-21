const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
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
  },
  onine_reference : {
    type : String
  }
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
