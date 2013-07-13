var Socket = {

	socket: null,

	init: function()
	{
		this.connect();
		this.errors();
	},

	connect: function()
	{
		this.socket = io.connect('http://localhost:1337');
	},

	get: function()
	{
		return this.socket;
	},

	errors: function()
	{
		this.socket.on('error', function()
		{
			$('.message').html('An error occurred. Please try reconnecting.')
						 .stop(true, true)
						 .fadeIn(300).delay(1000).fadeOut(300);
		});

		this.socket.on('connect_failed', function()
		{
			$('.message').html("Couldn't connect to a socket transport.")
						 .stop(true, true)
						 .fadeIn(300).delay(1000).fadeOut(300);
		});

		this.socket.on('connect_failed', function()
		{
			$('.message').html('You were reconnected again to the server.')
						 .stop(true, true)
						 .fadeIn(300).delay(1000).fadeOut(300);
		});
	}

};

Socket.init();