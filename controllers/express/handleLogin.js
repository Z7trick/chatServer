const { jwtVerify, getJwt } = require('../jwt/jwtAuth');
const UserModel = require('../../models/User');
const handleLogin = async (req, res) => {
	const token = JSON.parse(getJwt(req));
	if (!token) {
		res.json({ loggedIn: false });
		return;
	}

	jwtVerify(token, 'secret123')
		.then(async (decoded) => {
			const potentialUser = await UserModel.findOne({ _id: decoded._id });

			if (potentialUser.length === 0) {
				res.json({ loggedIn: false, token: null });
				return;
			}

			res.json({ loggedIn: true, token });
		})
		.catch(() => {
			res.json({ loggedIn: false });
		});
};

module.exports = handleLogin;
