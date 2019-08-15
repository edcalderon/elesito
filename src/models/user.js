const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		match: [/.+@.+\..+/, 'Please enter a valid e-mail address'],
		unique: true,
		lowercase: true,
	},
	user: {
		type: String,
		required: true,
		trim: true,
		unique: true,
		lowercase: true,
	},
	sede: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
	},
	firstname: {
		type: String,
		required: 'name is Required',
		trim: true,
		lowercase: true,
	},
	lastname: {
		type: String,
		required: 'lastname is Required',
		trim: true,
		lowercase: true,
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minlength: 6,
	},
	phone: {
		type: Number,
		required: true,
		trim: true,
	},
	cc: {
		type: Number,
		required: true,
		trim: true,
		unique: true,
	},
	roll: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
	},
	avatar: {
		type: Buffer,
	},
	esiPuntos: {
		type: Number,
		default: 0,
	},
});

// create mongoose model
const User = mongoose.model('User', userSchema);

module.exports = User;
