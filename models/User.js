const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		passwordHash: {
			type: String,
			required: true,
		},
		connected: {
			type: String,
		},
		friendList: [
			{
				username: {
					type: String,
					required: true,
				},
				_id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
					required: true,
				},
			},
		],
		logoutTime: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('User', UserSchema);
