
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.render('index')
});

io.on('connection', (socket) => {
	console.log('a user connected');

	socket.on('setBackground', (cell) => {
		io.emit('setBackground', cell);
	});

	socket.on('disconnect', () => {
		console.log('a user disconnected');
	});
});

http.listen(3000, () => console.log('Example app listening on port 3000.'));