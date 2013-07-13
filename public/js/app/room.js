var Room = {

	user: null,

	init: function()
	{
		this.enter();
		this.userEnter();
		this.updateSelf();
		this.userLeave();
	},

	enter: function()
	{
		// Send a socket message upon entering the room
		// with the username from localStorage if it's set
		Socket.get().emit('enteroom', $.totalStorage('username'));
	},

	userEnter: function()
	{
		var that = this;

		// Notify once a user enters the room
		Socket.get().on('userenter', function(data)
		{
			// Update user count
			Toolbar.updateUserCount(data.count);
			Toolbar.updateUsers(data.users);

			// Notify user by changing the window title
			PageTitle.change(data.user.username+' joined');

			$('.message').html(data.user.username+' joined')
						 .stop(true, true)
						 .fadeIn(300).delay(1000).fadeOut(300);
		});
	},

	updateSelf: function()
	{
		var that = this;

		// Set the user and save the username in localStorage
		Socket.get().on('updateself', function(data)
		{
			that.user = data.user;

			// Update user count
			Toolbar.updateUserCount(data.count);
			Toolbar.updateUsers(data.users);

			$.totalStorage('username', that.user.username);
		});
	},

	userLeave: function()
	{
		var that = this;

		// Notify once a user leaves the room
		Socket.get().on('userleave', function(data)
		{
			// Update user count
			Toolbar.updateUserCount(data.count);
			Toolbar.updateUsers(data.users);

			$('.message').html(data.user.username+' left')
						 .stop(true, true)
						 .fadeIn(300).delay(1000).fadeOut(300);
		});
	},

	getUser: function()
	{
		return this.user;
	}

}

Room.init();