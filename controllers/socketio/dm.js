const MessageModel = require('../../models/Message');
const UserModel = require('../../models/User');
const dm = async (socket, message) => {
	message.from = socket.user.username;
	const chatId = await UserModel.findOne({ username: message.to }).exec();
	const doc = new MessageModel({
		message: message.message,
		from: message.from,
		to: message.to,
		chat: socket.user._id,
		date: message.date,
	});
	const doc2 = new MessageModel({
		message: message.message,
		from: message.from,
		to: message.to,
		chat: chatId._id,
		date: message.date,
	});
	const user = await doc.save();
	await doc2.save();
	const { chat, ...userData } = user._doc;

	socket.to(message.to).emit('dm', userData);
};

module.exports = dm;
