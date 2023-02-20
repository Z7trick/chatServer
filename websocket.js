require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");
mongoose
	.connect(process.env.MONGODB_URI || "")
	.then(() => {
		console.log("DB ok");
	})
	.catch((err) => console.log("DB error", err));

const app = express();
const http = require("http");
const server = http.createServer(app);
const port = 3000;
const { Server } = require("socket.io");
const { corsConfig } = require("./controllers/serverController");
const authRouter = require("./routers/authRouter");
const {
	initializeUser,
	addFriend,
	onDisconnect,
	authorizeUser,
	dm,
} = require("./controllers/socketController");
const io = new Server(server, {
	cors: corsConfig,
});

app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
app.use("/auth", authRouter);
app.set("trust proxy", 1);

io.use(authorizeUser);
io.on("connection", (socket) => {
	console.log("connected...");
	initializeUser(socket);
	socket.on("add_friend", (friendName, cb) => {
		addFriend(socket, friendName, cb);
	});
	socket.on("dm", (message) => dm(socket, message));
	socket.on("disconnecting", () => onDisconnect(socket));
});

server.listen(process.env.PORT || port, () => {
	console.log("listening on *:3000");
});
// module.exports = app;
