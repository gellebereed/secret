require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const userSchema = mongoose.Schema({
	email: String,
	password: String
});

//Level 2 security

userSchema.plugin(encrypt, {
	secret: process.env.SECRET,
	encryptedFields: [
		'password'
	]
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
	res.render('home');
});
app.get('/login', (req, res) => {
	res.render('login');
});
app.get('/register', (req, res) => {
	res.render('register');
});

app.post('/register', (req, res) => {
	const newUser = new User({
		email: req.body.username,
		password: req.body.password
	});
	newUser.save((err) => {
		if (err) {
			console.log(err);
		} else {
			res.render('secrets');
		}
	});
});

app.post('/login', (req, res) => {
	const email = req.body.username;
	const password = req.body.password;
	//Level 1 security
	User.findOne({ email: email }, (err, foundItem) => {
		if (err) {
			console.log(err);
		} else {
			if (foundItem) {
				if (foundItem.password === password) {
					res.render('secrets');
				}
			}
		}
	});
});

app.listen(process.env.PORT || 3000, () => {
	console.log('Server has Started on Port 3000');
});
