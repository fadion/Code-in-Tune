var sock = require('./socket.js'),
	io = require('../container').resolve('io'),
	room = 0;

exports.index = function(req, res)
{
	room = req.param('room');
	res.render('room', {room: room});
}

// Sockets
io.sockets.on('connection', function(socket)
{
	// Set the room and join
	socket.room = room;
	socket.join(room);

	// User enters room
	socket.on('enteroom', sock.enterRoom(socket));

	// User leaves room
	socket.on('disconnect', sock.disconnect(socket));

	// Code editor is changed
	socket.on('editorchanged', sock.editorChanged(socket));

	// Message is sent
	socket.on('sendmessage', sock.sendMessage(socket));

	// Username is changed
	socket.on('changeusername', sock.changeUsername(socket));
});