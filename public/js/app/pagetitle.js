var PageTitle = {

	window_focus: true,
	dirty: false,
	original: null,
	interval: false,
	time: 1500,

	init: function()
	{
		this.original = document.title;
		this.windowFocus();
	},

	change: function(title)
	{
		var that = this,
			count = 0;

		// Don't change the title if the window has
		// focus or the inverval has already begun
		if (this.window_focus || this.interval) return;

		this.reset();
		this.dirty = true;

		this.interval = setInterval(function()
		{
			// Set the title to the changed or
			// original value, depending on it's
			// actual value
			document.title = (document.title == that.original) ? title : that.original;
			
			// Change it only 6 times
			if (count == 5)
			{
				that.reset();
			}

			count++;
		}, this.time);
	},

	reset: function()
	{
		document.title = this.original;
		clearInterval(this.interval);
		this.interval = false;
	},

	windowFocus: function()
	{
		var that = this;

		$(window).on('focus', function()
		{
			that.window_focus = true;

			// When marked as changed, reset
			// it on focus
			if (that.dirty)
			{
				that.reset();
				that.dirty = false;
			}
		})
		.on('blur', function()
		{
			that.window_focus = false;
		});
	}

};

PageTitle.init();