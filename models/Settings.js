const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  basic_link: {
    type: String,
    default : 'https://twitter.com'
    
  },
  premium_link : {
    type : String,
    default : 'https://facebook.com'
  },
  website : {
    type: String,
    default : 'GAZA Institute'
  }

 
});

const Settings = mongoose.model('Settings',SettingsSchema);

module.exports = Settings;
