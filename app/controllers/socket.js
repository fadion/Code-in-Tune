var io = require('../container').resolve('io'),
	count = 0,
	users = {},
	editor = {};

exports.enterRoom = function(socket)
{
	return function(data)
	{
		var username = data,
			total = 0;

		// When a username isn't set by the client.
		// generate one based on the total number
		// of connected users
		if (! username)
		{
			count++;
			username = 'User'+count;
		}

		if (users[socket.room] === undefined) users[socket.room] = {};
		
		// Add the client to the users object
		users[socket.room][socket.id] = {username: username, manager: false};

		// Get the total number of connected clients in the room
		total = Object.keys(io.sockets.clients(socket.room)).length;

		socket.broadcast.to(socket.room).emit('userenter', {user: users[socket.room][socket.id], count: total, users: users[socket.room]});
		socket.emit('updateself', {user: users[socket.room][socket.id], count: total, users: users[socket.room]});

		// Push the editor state (if it exists) on a connected client
		if (editor[socket.room] !== undefined)
		{
			socket.emit('loadeditor', editor[socket.room]);
		}
	}
}

exports.disconnect = function(socket)
{
	return function(data)
	{
		var user = {username: 'User'},
			the_users = {},
			total = 0;

		// Errors would be thrown if the server would be restarted
		// with connected users, as the "users" variable would be reset.
		// It's checked here if it exists to surpress those errors
		if (users[socket.room] !== undefined && users[socket.room][socket.id] !== undefined)
		{
			user = users[socket.room][socket.id];
			the_users = users[socket.room];

			// Remove the disconnected user
			delete users[socket.room][socket.id];
		}

		// Get the total number of connected clients in the room
		total = Object.keys(io.sockets.clients(socket.room)).length - 1;

		// Prune the "users" and "editor" objects when the
		// room is empty
		if (total == 0)
		{
			delete users[socket.room];
			delete editor[socket.room];
		}

		socket.broadcast.to(socket.room).emit('userleave', {user: user, count: total, users: the_users});
		socket.emit('updateself', {user: user, count: total, users: the_users});
	}
}

exports.editorChanged = function(socket)
{
	return function(data)
	{
		socket.broadcast.to(socket.room).emit('broadcastchanges', data);

		// Add editor's deltas to the object, so they can
		// be pushed back when a client enters the room
		if (editor[socket.room] === undefined)
		{
			editor[socket.room] = [data];
		}
		else
		{
			editor[socket.room].push(data);
		}
	}
}

exports.sendMessage = function(socket)
{
	return function(data)
	{
		socket.broadcast.to(socket.room).emit('updatechat', {message: data, username: users[socket.room][socket.id].username});
	}
}

exports.changeUsername = function(socket)
{
	return function(data)
	{
		var total = Object.keys(io.sockets.clients(socket.room)).length;
		users[socket.room][socket.id].username = data;

		socket.emit('updateself', {user: users[socket.room][socket.id], count: total, users: users[socket.room]});
	}
}