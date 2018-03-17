
var socket = io();

function toggleBackground(x, y) {
	var element = document.getElementById(x + ',' + y);
	if (element.style.backgroundColor === 'blue') {
		element.style.backgroundColor = 'white';
	} else {
		element.style.backgroundColor = 'blue';
	}

	socket.emit('setBackground', { x: x, y: y, color: element.style.backgroundColor });
}

socket.on('userLeft', () => {
	$('#chat_messages').append($('<li>').text('A user left.'));
});

socket.on('userJoined', () => {
	$('#chat_messages').append($('<li>').text('A user joined.'));
});

socket.on('setBackground', (cell) => {
	document.getElementById(cell.x + ',' + cell.y).style.backgroundColor = cell.color;
});

socket.on('sendMessage', (message) => {
	$('#chat_messages').append($('<li>').text(message.name + ': ' + message.text));
});

socket.on('userTyping', (users) => {
	$('#isTyping').text(users.filter(user => user.id !== socket.id)
		.map(user => user.name + ' is typing...')
		.join(' '));
});

$(function () {
	$('form').submit(function() {
		socket.emit('sendMessage', { name: $('#name').val(), text: $('#message').val() });
		$('#chat_messages').append($('<li>').text('You: ' + $('#message').val()));		
		$('#message').val('');
		return false;
	});

	$('#message').on('input', () => {
		socket.emit('userTyping', { name: $('#name').val(), text: $('#message').val() });
	});
});