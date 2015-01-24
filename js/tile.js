function Tile(id)
{
	var tile = null;
	if(typeof id == "number")
		tile = Tiles[id];
	if(typeof id == "string")
		tile = Tiles[Util.findTileId(id)];
	this.texture = tile.texture;
	this.collides = tile.collides;
	this.movable = tile.movable;
	this.friction = tile.friction;
	this.onHit = tile.onHit;
	this.name = tile.name;
	this.position = {
		x: 0,
		y: 0,
	};
	this.direction = -1;
}

Tile.prototype.update = function()
{
	switch(this.direction)
	{
		case 0:
			this.position.y -= 0.05;
			break;
		case 1:
			this.position.x += 0.05;
			break;
		case 2:
			this.position.y += 0.05;
			break;
		case 3:
			this.position.x -= 0.05;
			break;
	}
}