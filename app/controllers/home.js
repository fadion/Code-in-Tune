exports.index = function(req, res)
{
	res.render('index', {room: generateRoom()});
}

// Generate a random alphanumeric
function generateRoom()
{
	var room = '',
		letters = '123456789abcdefghjkmnpqrstuvwxyz123456789',
		nr_chars = 5,
		i = 0;

	while (i < nr_chars)
	{
		room += letters.charAt(Math.floor(Math.random() * letters.length));
		i++;
	}

	return room;
}