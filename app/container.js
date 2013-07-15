var objects = {};

exports.register = function(name, obj)
{
	objects[name] = obj;

	return this;
}

exports.resolve = function(name)
{
	if (objects[name] !== undefined)
	{
		return objects[name];
	}

	return false;
}