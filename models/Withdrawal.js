const mongoose = require('mongoose');

const WithdrawalSchema = new mongoose.Schema({
  withdrawn_by : {
    type: String
    
  },
  status : {
    type: Boolean
    
  },
  date : {
  	type : Date,
  	default : Date.now
  }
 
});

const Whatsapp = mongoose.model('Whatsapp', WhatsappSchema);

module.exports = Whatsapp;
