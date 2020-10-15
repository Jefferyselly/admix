const express = require('express');
const router = express.Router();
const path = require('path');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Model init
const User = require('../models/User');
const Payment = require('../models/Payment');
const Settings = require('../models/Settings');

//serve router static files
router.use(express.static(path.join(__dirname, '../public')));

router.get('/', (req,res) => {

	User.find().limit(4).sort({date : 'desc'}).then((users) => {
		//Getting data for recently registered details.
		User.find().countDocuments().then((number_of_users) => {
				User.find({level : 0}).then((basic_users) => {
					res.render('index.ejs',{
			users : users || {},
			number_of_users : number_of_users || 0,
			basic_users : basic_users|| {}
				})
			})
				
		})

	})
   
})

router.get('/users', (req,res) => {
	//setting up pagination for viewing users.
	const res_per_page = 5;
	const page = req.query.page || 1; // Page 
	//Get all user details from the database.

	User.find().skip((res_per_page * page) - res_per_page).limit(res_per_page).sort({date : 'desc'}).then((users) => {

		User.find().countDocuments().then((total) => {
			
		//get user payment information.

		res.render('users.ejs',{
			users,
			current_page : page,
			pages: Math.ceil(total / res_per_page), 
			total
		});
		})

		
	})
    
})

router.get('/transactions', (req,res) => {
    res.render('transactions.ejs');
})

router.get('/settings', (req,res) => {
	//check if data is being saved, then save it or load the page normally.
	if(req.query.basic_link){
		//Update the details of the database 
		const body = {
			website : req.query.website,
			basic_link : req.query.basic_link,
			premium_link : req.query.premium_link
		}
		Settings.findOneAndUpdate({$set : body}).then((update) => {
			if(update == null){
				//create new settings.
				const settings = new Settings(body);

				settings.save().then((done) => {
					console.log(done);
				})
			}
		})
	}
	Settings.findOne().then((set_docs) => {
		
		if(set_docs == null){
			let set_docs = {}
			set_docs.website = "https://gaza.com";
			set_docs.basic_link = "https://gaza.com";
			set_docs.premium_link = "https://gaza.com";

			res.render('settings.ejs',{
			set_docs
		})

		}else{
			res.render('settings.ejs',{
			set_docs
		})
		}

			
	})
	
})

router.post('/add_user',(req,res)=> {
   const body = _.pick(req.body, ['username','password','email','payment_method','refered_by']);

   body.is_new_user = false;
   body.level = 1;

   

   User.findOne({email : body.email}).countDocuments().then((count) => {
   	if(count > 0){
   		//send error message
   		res.send({
   			message : 'account already exists',
   			code : 0
   		})
   	}else{
   		const newUser = new User(body);
   		bcrypt.genSalt(10,(err,salt) => {
   			bcrypt.hash(newUser.password,salt,(err,hash) => {
   				if (err) throw err;
   				newUser.password = hash;
   				newUser.save().then((user) => {
   					//send a success message to browser
   					res.send({
   						message : user.username + ' account created successfully',
   						code : 1
   					})
   				})
   			})
   		})
   	}
   })

})
module.exports = router;