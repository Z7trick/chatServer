const UserModel = require('../../models/User');
const parseFriendList = async (friendList) => {
	const newFriendList = [];
	for (let friend of friendList) {
		const friendConnected = await UserModel.findOne({ username: friend.username }).exec();
		newFriendList.push({
			username: friendConnected.username,
			_id: friendConnected._id,
			connected: friendConnected.connected,
			logoutTime: friendConnected.logoutTime,
		});
	}
	return newFriendList;
};

module.exports = parseFriendList;
