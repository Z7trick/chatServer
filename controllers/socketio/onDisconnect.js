const parseFriendList = require('./parseFriendList');
const UserModel = require('../../models/User');
const onDisconnect = async (socket) => {
	console.log('disconnection');
	await UserModel.findByIdAndUpdate(socket.user._id, {
		connected: false,
		logoutTime: new Date().toLocaleString('ru', { timeZone: 'Europe/Moscow' }),
	});
	const user = await UserModel.findOne({ username: socket.user.username });
	const userFriendList = user?.friendList;
	const friendRooms = await parseFriendList(userFriendList).then((friends) => friends.map((friend) => friend.username));
	socket.to(friendRooms).emit('friendConnected', 'false', socket.user.username, user.logoutTime);
};

module.exports = onDisconnect;
