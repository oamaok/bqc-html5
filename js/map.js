

function Map()
{
	this.tiles = new Array(Config.map.width * Config.map.height);

	this.spawn = null;

	for(i = 0; i< 20; i++)
		this.insertTile(new Tile("normal"), i, 10);
	for(i = 6; i< 20; i++)
		this.insertTile(new Tile("gravity"), i, 8);
	for(i = 6; i< 20; i++)
		this.insertTile(new Tile("gravity"), i, 6);
	/*
	for(i = 0; i< 20; i++)
	{
		tile = new Tile("gravity");
		tile.position.y = 10 * 20;
		tile.position.x = i * 20;
		tile.aabb.move(tile.position);
		this.tiles.push(tile);
	}
	for(i = 4; i< 20; i++)
	{
		tile = new Tile("gravity");
		tile.position.y = 2 * 20;
		tile.position.x = i * 20;
		tile.aabb.move(tile.position);
		this.tiles.push(tile);
	}
	*/
}

Map.prototype.import = function(mapString)
{
	this.tiles = new Array(Config.map.width * Config.map.height);

	var data = atob(mapString);

	if(data.charCodeAt(0) != Config.map.width || data.charCodeAt(1) != Config.map.height)
	{
		console.error("Map is of invalid resolution, try different map.");
		return;
	}

	for(var i = 2; i < data.length; i += 3)
	{
		var index = data.charCodeAt(i + 1);
		index |= data.charCodeAt(i) << 8;
		this.tiles[index] = new Tile(data.charCodeAt(i + 2))
	}
}

Map.prototype.insertTile = function(tile, x, y)
{
	this.tiles[y * Config.map.width + x] = tile;
}

Map.prototype.getTile = function(x, y)
{
	return this.tiles[y * Config.map.width + x];
}

var tileTexture = new Image();
tileTexture.src = "img/tiles.png";

Map.prototype.render = function(context)
{
	for(var i = 0; i < Config.map.width * Config.map.height; i++)
	{
		if(this.tiles[i] == undefined)
			continue;

		var tile = this.tiles[i];
		var x = i % Config.map.width;
		var y = Math.floor(i / Config.map.width);
		context.drawImage(
			tileTexture, 
			tile.texture[0] * 20, 
			tile.texture[1] * 20, 
			20, 20, 
			x * 20,
			y * 20, 
			20, 20
		);
	}
}

Map.prototype.getSpawn = function()
{
	if(this.spawn != null)
		return this.spawn;

	for(var i = 0; i < this.tiles.length; i++)
	{
		if(this.tiles[i] == undefined)
			continue;

		if(this.tiles[i].name == "spawn")
		{
			var x = (i % Config.map.width) * 20;
			var y = Math.floor(i / Config.map.width) * 20;
			this.spawn = {x:x, y:y}
			return this.spawn;
		}
	}

	return null;
}

Map.prototype.update = function()
{
	for(var i = 0; i < Config.map.width * Config.map.height; i++)
	{
		if(this.tiles[i] == undefined)
			continue;

		this.tiles[i].update();
	}
}