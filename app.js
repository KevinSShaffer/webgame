
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var usersTyping = [];

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.render('index')
});

io.on('connection', (socket) => {
	socket.broadcast.emit('userJoined');

	socket.on('setBackground', (cell) => {
		io.emit('setBackground', cell);
	});

	socket.on('sendMessage', (message) => {
		usersTyping = usersTyping.filter(user => user !== message.name);
		socket.broadcast.emit('sendMessage', message);
		io.emit('userTyping', usersTyping);
	});

	socket.on('disconnect', () => {
		socket.broadcast.emit('userLeft');
	});

	socket.on('userTyping', (message) => {
		if (!message.text) {
			usersTyping = usersTyping.filter(user => user !== message.name);
		} else if (!usersTyping.includes(message.name)) {
			usersTyping.push(message.name);
		}

		socket.broadcast.emit('userTyping', usersTyping);
	});
});

http.listen(3000, () => console.log('Example app listening on port 3000.'));