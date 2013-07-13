var Editor = {

	allow_change: true,
	follow_cursor: false,

	init: function()
	{
		this.loadData();
		this.change();
		this.listenForChanges();
	},

	loadData: function()
	{
		var that = this;

		Socket.get().on('loadeditor', function(data)
		{
			// Block the editor's "change" event until
			// data is pushed to it
			that.allow_change = false;

			if (data.length)
			{
				for (var changes in data)
				{
					that.applyChanges(data[changes].data);
				}
			}

			// Reset the Ace.get()'s "change" event
			that.allow_change = true;
		});
	},

	change: function()
	{
		var that = this;

		Ace.get().getSession().on('change', function(e)
		{
			// Stop the editor from going on
			// a "change" event loop
			if (! that.allow_change) return;

			that.pushChanges(e.data);
		});
	},

	pushChanges: function(data)
	{
		Socket.get().emit('editorchanged', {data: data});
	},

	listenForChanges: function()
	{
		var that = this;

		// Listen for changes
		Socket.get().on('broadcastchanges', function(data)
		{
			// Block the editor's "change" event until
			// data is pushed to it
			that.allow_change = false;

			if (data.data)
			{
				that.applyChanges(data.data);
				
				// Notify users for changed data by changing
				// the window title
				PageTitle.change('Modified');
			}

			// Reset the Ace.get()'s "change" event
			that.allow_change = true;
		});
	},

	applyChanges: function(data)
	{
		var editor_doc = Ace.get().getSession().getDocument(),
			range = data.range,
			cursor = {row: 0, column: 0};

		// "action" is returned from Ace's delta and
		// contains the operation that triggered the change
		switch(data.action)
		{
			// Triggered when text is inserted.
			// Changes are inserted to the starting row and column
			case 'insertText':
				editor_doc.insert(range.start, data.text);
				cursor.row = range.end.row; cursor.column = range.end.column;
				break;

			// Triggered when 1 or more lines are inserted.
			// Lines are inserted starting from the range start
			case 'insertLines':
				editor_doc.insertLines(range.start.row, data.lines);
				cursor.row = range.end.row; cursor.column = range.end.column;
				break;

			// Triggered when a single character, selection
			// or 1 or more lines are deleted.
			// Text or lines are removed by range:
			// Range(firstRow, firstCol, endRow, endCol)
			case 'removeText':
			case 'removeLines':
				var Range = ace.require('ace/range').Range,
					selection = new Range(range.start.row, range.start.column, range.end.row, range.end.column);

				editor_doc.remove(selection);

				// A higher endCol means same line deletion.
				// Otherwise, the whole line was deleted and
				// the cursor should be move to the new one
				if (range.end.column > range.start.column)
				{
					cursor.row = range.end.row; cursor.column = range.end.column;
				}
				else
				{
					cursor.row = range.start.row; cursor.column = range.start.column;
				}
				break;
		}

		// Move the listeners cursor if they chose to
		if (this.follow_cursor) Ace.get().moveCursorToPosition(cursor);

		// Reset history
		/*var UndoManager = require("ace/undomanager").UndoManager,
			history = new UndoManager();

			console.log(history);

		history.execute({data, editor.getSession().getDocument()});
		editor.getSession().setUndoManager(history);*/
	}

};

Editor.init();