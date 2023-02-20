const parseFriendList = require("./parseFriendList");
const UserModel = require("../../models/User");
const onDisconnect = async (socket) => {
	console.log("disconnection");
	// await redisClient.hset(`userid:${socket.user.username}`, 'connected', false);
	// const friendList = await redisClient.lrange(`friends:${socket.user.username}`, 0, -1);
	// const friendRooms = await parseFriendList(friendList).then((friends) => friends.map((friend) => friend.userid));
	// socket.to(friendRooms).emit('connected', false, socket.user.username);
	await UserModel.findByIdAndUpdate(socket.user._id, {
		connected: false,
		logoutTime: new Date().toLocaleString(),
	});
	// await UserModel.findOneAndUpdate(
	// 	{ username: socket.user._id },
	// 	{
	// 		connected: false,
	// 		logoutTime: new Date().toLocaleString(),
	// 	}
	// );
	const user = await UserModel.findOne({ username: socket.user.username });
	const userFriendList = user?.friendList;
	const friendRooms = await parseFriendList(userFriendList).then((friends) =>
		friends.map((friend) => friend.username)
	);
	socket
		.to(friendRooms)
		.emit("friendConnected", "false", socket.user.username, user.logoutTime);
};

module.exports = onDisconnect;
