var Toolbar = {

	selector: {
		toolbar: '.toolbar',
		settings: '.settings',
		settingsToggle: '.settings-toggle',
		chat: '.chat',
		chatToggle: '.chat-toggle',
		share: '.share',
		shareToggle: '.share-toggle',
		users: '.users',
		usersToggle: '.users-toggle'
	},

	init: function()
	{
		this.fade();
		
		this.toggleSettings();
		this.theme();
		this.mode();
		this.setUsername();
		this.changeUsername();

		this.toggleChat();
		this.sendMessage();
		this.listenForMessages();

		this.toggleShare();

		this.updateUsers();
		this.toggleUsers();
	},

	fade: function()
	{
		var that = this;

		// Set an initial opacity so the toolbar
		// doesn't get in the way
		$(this.selector.toolbar).fadeTo(0, .3)

		// Fade in on mouse over
		.on('mouseenter', function()
		{
			$(this).stop(true, true).fadeTo(100, 1);
		})

		// Fade out on mouse out
		.on('mouseleave', function()
		{
			$(this).stop(true, true).fadeTo(100, .3);
		});
	},

	toggleSettings: function()
	{
		var that = this;

		$(this.selector.toolbar+' '+this.selector.settingsToggle)
		.on('click', function()
		{
			var settings = $(that.selector.toolbar+' '+that.selector.settings);
			
			$(that.selector.toolbar+' > div').not(settings).slideUp(200);
			$(that.selector.toolbar+' > a').not($(this)).removeClass('hover');
			
			settings.slideToggle(200);
			$(this).toggleClass('hover');

			return false;
		});
	},

	theme: function()
	{
		var theme = 'ambiance';

		// Take theme if it was saved in localstorage
		if ($.totalStorage('theme'))
		{
			theme = $.totalStorage('theme');
		}

		Ace.setTheme(theme);

		// Select the correct theme
		$(this.selector.toolbar+' '+this.selector.settings)
		.find('select[name="theme"]').find('option[value="'+theme+'"]')
		.attr('selected', 'selected');

		// Change theme request
		$(this.selector.toolbar+' '+this.selector.settings)
		.find('select[name="theme"]').on('change', function()
		{
			Ace.setTheme($(this).val());
			$.totalStorage('theme', $(this).val());
		});
	},

	mode: function()
	{
		var mode = 'javascript';

		// Take mode if it was saved in localstorage
		if ($.totalStorage('mode'))
		{
			mode = $.totalStorage('mode');
		}

		Ace.setMode(mode);

		// Select the correct mode
		$(this.selector.toolbar+' '+this.selector.settings)
		.find('select[name="mode"]').find('option[value="'+mode+'"]')
		.attr('selected', 'selected');

		// Change mode request
		$(this.selector.toolbar+' '+this.selector.settings)
		.find('select[name="mode"]').on('change', function()
		{
			Ace.setMode($(this).val());
			$.totalStorage('mode', $(this).val());
		});
	},

	setUsername: function()
	{
		if ($.totalStorage('username'))
		{
			// Set the username in the settings toolbar
			$(this.selector.toolbar+' '+this.selector.settings).find('input[name="username"]')
			.val($.totalStorage('username'));
		}
	},

	changeUsername: function()
	{
		$(this.selector.toolbar+' '+this.selector.settings).find('input[name="username"]')
		.on('keyup', function()
		{
			var self = $(this);

			if (self.val() != '')
			{
				// Send a socket message and save the new username
				// in localStorage
				Socket.get().emit('changeusername', self.val());
				$.totalStorage('username', self.val());
			}
		});
	},

	toggleChat: function()
	{
		var that = this;

		$(this.selector.toolbar+' '+this.selector.chatToggle)
		.on('click', function()
		{
			var chat = $(that.selector.toolbar+' '+that.selector.chat);
			
			$(that.selector.toolbar+' > div').not(chat).slideUp(200);
			$(that.selector.toolbar+' > a').not($(this)).removeClass('hover');
			
			chat.slideToggle(200);
			$(this).toggleClass('hover').removeClass('active');

			return false;
		});
	},

	sendMessage: function()
	{
		var that = this;

		$(this.selector.toolbar+' '+this.selector.chat).find('textarea')
		.on('keypress', function(e)
		{
			var self = $(this);

			// When "enter" is pressed and message is not empty
			if (e.which == 13 && self.val() != '')
			{
				Socket.get().emit('sendmessage', self.val());

				// Add the message locally
				that.addMessage(Room.getUser().username, self.val());

				self.val('');
				return false;
			}
		});
	},

	listenForMessages: function()
	{
		var that = this;

		// Wait for new messages
		Socket.get().on('updatechat', function(data)
		{
			if (data.message != '')
			{
				// Add the message
				that.addMessage(data.username, data.message);

				// If the chat window is hidden, make the chat button red
				// and change the window title
				if ($(that.selector.toolbar+' '+that.selector.chat).is(':hidden'))
				{
					$(that.selector.toolbar+' '+that.selector.chatToggle).addClass('active');
				}

				// Notify user by changing the window title
				PageTitle.change(data.username+' sent a message');
			}
		});
	},

	addMessage: function(username, message)
	{
		var chat = $(this.selector.toolbar+' '+this.selector.chat).children('div'),
			messages = chat.html()+'<strong>'+username+'</strong>: '+message+'<br>';

		chat.html(messages);
		chat.scrollTop(chat.prop('scrollHeight'));
	},

	toggleShare: function()
	{
		var that = this;

		$(this.selector.toolbar+' '+this.selector.shareToggle)
		.on('click', function()
		{
			var share = $(that.selector.toolbar+' '+that.selector.share);

			$(that.selector.toolbar+' > div').not(share).slideUp(200);
			$(that.selector.toolbar+' > a').not($(this)).removeClass('hover');

			share.slideToggle(200).find('input').focus().select();
			$(this).toggleClass('hover');

			return false;
		});
	},

	updateUserCount: function(count)
	{
		$(this.selector.toolbar+' '+this.selector.usersToggle)
		.find('p').html(count).show();
	},

	updateUsers: function(users)
	{
		var content = '';

		// Take all connected usernames
		for (var user in users)
		{
			content += users[user].username+'<br>';
		}

		if (content != '')
		{
			$(this.selector.toolbar+' '+this.selector.users)
			.find('div').html(content);
		}
	},

	toggleUsers: function()
	{
		var that = this;

		$(this.selector.toolbar+' '+this.selector.usersToggle)
		.on('click', function()
		{
			var users = $(that.selector.toolbar+' '+that.selector.users);

			$(that.selector.toolbar+' > div').not(users).slideUp(200);
			$(that.selector.toolbar+' > a').not($(this)).removeClass('hover');
			
			users.slideToggle(200);
			$(this).toggleClass('hover');

			return false;
		});
	}

}

Toolbar.init();