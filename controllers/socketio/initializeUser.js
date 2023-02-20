const parseFriendList = require('./parseFriendList');
const UserModel = require('../../models/User');
const MessageModel = require('../../models/Message');
const initializeUser = async (socket) => {
	try {
		socket.join(socket.user.username);

		await UserModel.findByIdAndUpdate(socket.user._id, {
			connected: true,
			logoutTime: new Date().toLocaleString('ru', {
				timeZone: 'Europe/Moscow',
			}),
		});

		const user = await UserModel.findOne({ username: socket.user.username });
		const userFriendList = user?.friendList;
		const parsedFriendList = await parseFriendList(userFriendList);
		const friendRooms = parsedFriendList.map((friend) => friend.username);
		if (friendRooms.length > 0) {
			socket.to(friendRooms).emit('friendConnected', 'true', socket.user.username);
		}

		socket.emit('friends', parsedFriendList);

		const usersMessages = await MessageModel.find({
			chat: socket.user._id,
		}).exec();

		if (usersMessages && usersMessages.length > 0) {
			socket.emit('messages', usersMessages);
		}
	} catch (e) {}
};

module.exports = initializeUser;
