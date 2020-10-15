const mongoose = require('mongoose');

const AffiliateSchema = new mongoose.Schema({
  refered_by: {
    type: String
    
  },
  referral : {
    type: String
    
  },
  status : {
  	type : Boolean
  },
  amount_paid : {
  	type : Number
  }
 
});

const Affiliate = mongoose.model('Affiliate', AffiliateSchema);

module.exports = Affiliate;
