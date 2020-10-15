const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  refered_by : {
    type : String
  },
  password: {
    type: String,
    required: true
  },
 
  is_new_user : {
    type : Boolean
  },
  level : {
    type : Number
  },
  payment_method : {
    type : String
  },
  date: {
    type: Date,
    default: Date.now
  },
  amount : {
    type : Number
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
