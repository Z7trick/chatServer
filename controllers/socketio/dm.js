const MessageModel = require('../../models/Message');
const UserModel = require('../../models/User');
const dm = async (socket, message) => {
	message.from = socket.user.username;
	// // to.from.content
	// const messageString = [message.to, message.from, message.content].join('.');

	// await redisClient.lpush(`chat:${message.to}`, messageString);
	// await redisClient.lpush(`chat:${message.from}`, messageString);

	// socket.to(message.to).emit('dm', message);
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
