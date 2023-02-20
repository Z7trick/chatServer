const bcrypt = require('bcrypt');
const { jwtSign } = require('../jwt/jwtAuth');
const UserModel = require('../../models/User');
const attemptRegister = async (req, res) => {
	try {
		// const existedUser = await UserModel.findOne({ username: req.body.username }).exec();
		// if (existedUser) return res.json({ loggedIn: false, status: 'Username taken' });
		const password = req.body.password;
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const doc = new UserModel({
			username: req.body.username,
			passwordHash: hash,
		});

		const user = await doc.save();

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
				const { username } = user._doc;
				res.json({ loggedIn: true, token, username });
			})
			.catch((err) => {
				console.log(err);
				res.json({ loggedIn: false, status: 'Try again later' });
			});
	} catch (error) {
		res.json({ loggedIn: false, status: 'Username has taken' });
		console.log(error);
	}
};

module.exports = attemptRegister;
