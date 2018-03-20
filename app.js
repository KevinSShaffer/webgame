
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var usersTyping = [];
var connectedUsers = [];

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.render('index')
});

io.on('connection', (socket) => {
	connectedUsers.push({ id: socket.id, name: 'Guest' });
	socket.broadcast.emit('userJoined');

	socket.on('setBackground', (cell) => {
		io.emit('setBackground', cell);
	});

	socket.on('sendMessage', (message) => {
		if (message.text.substring(0, 3) === '/im') {
			var name = message.text.split(' ').filter(word => word !== '')[1];

			if (connectedUsers.some((user) => user.name === name)) {
				message.text = message.text.replace("/im", "hey");
				socket.broadcast.to(connectedUsers.find((user) => user.name === name).id).emit('sendMessage', message);
			} else {
				socket.broadcast.emit('sendMessage', message);
			}
		} else {
			socket.broadcast.emit('sendMessage', message);
		}

		usersTyping = usersTyping.filter(user => user.id !== socket.id);
		io.emit('userTyping', usersTyping);
	});

	socket.on('disconnect', () => {
		socket.broadcast.emit('userLeft');
		usersTyping = usersTyping.filter(user => user.id !== socket.id);
		connectedUsers = connectedUsers.filter(user => user.id !== socket.id);
		socket.broadcast.emit('userTyping', usersTyping);
	});

	socket.on('userTyping', (message) => {
		if (!message.text) {
			usersTyping = usersTyping.filter(user => user.id !== socket.id);
		} else if (!usersTyping.some((user) => user.id === socket.id)) {
			usersTyping.push({ id: socket.id, name: message.name });
		}

		socket.broadcast.emit('userTyping', usersTyping);
	});

	socket.on('changingName', (newName) => {
		connectedUsers.find(user => user.id === socket.id).name = newName;
	});
});

http.listen(3000, () => console.log('Example app listening on port 3000.'));