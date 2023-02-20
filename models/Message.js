const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema(
	{
		message: {
			type: String,
			required: true,
		},
		from: {
			type: String,
			required: true,
		},
		to: {
			type: String,
			required: true,
		},
		date: {
			type: String,
		},
		chat: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Messages', MessageSchema);
