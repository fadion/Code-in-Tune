exports.start = function()
{
	var app = require('./container').resolve('app'),
	
		home = require('./controllers/home'),
		room = require('./controllers/room');

	app.get('/', home.index);
	app.get('/:room', room.index);

	// 404
	app.get('*', function(req, res)
	{
		res.render('404');
	});
}