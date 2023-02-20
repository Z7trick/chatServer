const bcrypt = require('bcrypt');
const { jwtSign } = require('../jwt/jwtAuth');
const UserModel = require('../../models/User');
const attemptLogin = async (req, res) => {
	try {
		const user = await UserModel.findOne({ username: req.body.username });

		if (!user) {
			return res.json({ loggedIn: false, status: 'User not found' });
		}

		const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

		if (!isValidPass) {
			return res.json({ loggedIn: false, status: 'Name or password incorrect' });
		}

		jwtSign(
			{
				_id: user._id,
				username: user.username,
			},
			'secret123',
			{
				expiresIn: '30d',
			}
		)
			.then((token) => {
				res.json({ loggedIn: true, token, username: user.username });
			})
			.catch((err) => {
				res.json({ loggedIn: false, status: 'Try again later' });
			});
	} catch (err) {
		res.status(500).json({
			message: 'Не удалось авторизоваться',
		});
	}
};

module.exports = attemptLogin;
