const UserModel = require('../../models/User');
const addFriend = async (socket, friendName, cb) => {
	try {
		if (friendName === socket.user.username) {
			cb({ done: false, errorMsg: 'Cannot add self!' });
			return;
		}
		const friend = await UserModel.findOne({ username: friendName }).exec();
		const user = await UserModel.findOne({ username: socket.user.username });
		const isUserAlreadyHasFriend = user.friendList.filter((friend) => {
			if (friend.username === friendName) return true;
			else return false;
		})[0];

		if (!friend?._id && !friend) {
			cb({ done: false, errorMsg: "User doesn't exist!" });
			return;
		}
		if (isUserAlreadyHasFriend) {
			console.log('user has friend');
			cb({ done: false, errorMsg: 'Friend already added!' });
			return;
		}

		await UserModel.findOneAndUpdate(
			{ username: socket.user.username },
			{
				friendList: [
					...user.friendList,
					{
						username: friendName,
						_id: friend._id,
					},
				],
			}
		);

		const newFriend = {
			username: friendName,
			connected: friend.connected,
			_id: friend._id,
			logoutTime: friend.logoutTime,
		};
		cb({ done: true, newFriend });
	} catch (err) {
		cb({ done: false, errorMsg: 'something goes wrong...' });
	}
};

module.exports = addFriend;
