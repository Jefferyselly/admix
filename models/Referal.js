const mongoose = require('mongoose');

const referalSchema = new mongoose.Schema({
  user_id: {
    type: String
    
  },
  referred_by_id : {
    type: String
    
  },
  payment_status : {
  	type : Boolean,
    default : false
  },
  withdrawal_status : {
    type : Boolean,
    default : false
  },
  earned : {
  	type : Number,
    default : 0
  }
 
});

const Referal = mongoose.model('Referal', referalSchema);

module.exports = Referal;
