const { jwtVerify } = require('../jwt/jwtAuth');

const authorizeUser = (socket, next) => {
	const token = JSON.parse(socket.handshake.auth.token);
	jwtVerify(token, 'secret123')
		.then((decoded) => {
			socket.user = { ...decoded };
			next();
		})
		.catch((err) => {
			console.log('Bad request!', err);
			next(new Error('Not authorized'));
		});
};

module.exports = authorizeUser;
