var express = require('express')
	cons = require('consolidate'),
	swig = require('swig'),
	router = require('./app/router'),
	container = require('./app/container'),
	app = express(),
	port = 1337;

// Public folder and favicon.ico
app.use(express.static(__dirname+'/public'));
app.use(express.favicon(__dirname+'/public/img/favicon.ico'));

// Set view engine
app.engine('.html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname+'/views');

// Initialize Swig
swig.init({
	root: __dirname+'/views',
    allowErrors: true
});

var io = require('socket.io').listen(app.listen(port));
console.log('Listening on port '+port);

// Save app and io
container.register('app', app)
	  	 .register('io', io);

// Start routing
router.start();