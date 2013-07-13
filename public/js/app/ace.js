var Ace = {

	editor: null,

	init: function()
	{
		this.editor = ace.edit("editor");

		// Editor defaults
		this.editor.setShowPrintMargin(false);
		this.editor.getSession().setUseSoftTabs(true);
		this.editor.getSession().setTabSize(4);
		this.editor.setHighlightActiveLine(false);
	},

	get: function()
	{
		return this.editor;
	},

	setTheme: function(theme)
	{
		this.editor.setTheme('ace/theme/'+theme);
	},

	setMode: function(mode)
	{
		this.editor.getSession().setMode('ace/mode/'+mode);
	}

}

Ace.init();