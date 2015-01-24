function Editor(canvasId)
{
	this.canvasId = canvasId;
	this.canvas = $("#" + this.canvasId);
	this.canvas.attr({
		width: Config.viewport.width,
		height: Config.viewport.height,
	});
	this.context = this.canvas[0].getContext("2d");

	var that = this;
	this.canvas[0].addEventListener("mousemove", function(event){that.mouseMove(event)});
	this.canvas[0].addEventListener("mousedown", function(event){that.cursorDown = true;that.mouseMove(event)});
	this.canvas[0].addEventListener("mouseup", function(event){that.cursorDown = false;that.mouseMove(event)});

	this.tiles = [];
	this.cursor = {x:0, y:0}
	this.cursorDown = false;
}

Editor.prototype.mouseMove = function(event)
{
	this.cursor.x = event.offsetX;
	this.cursor.y = event.offsetY;

	this.render();

	if(this.cursorDown)
	{

		var x = Math.floor(this.cursor.x / 20);
		var y = Math.floor(this.cursor.y / 20);
		this.tiles[y * Config.map.width + x] = new Tile($("[name=block]:checked").val());
	}
}

var tileTexture = new Image();
tileTexture.src = "img/tiles.png";

Editor.prototype.render = function()
{
	this.context.clearRect(0, 0, Config.viewport.width, Config.viewport.height);
	var x = Math.floor(this.cursor.x / 20) * 20;
	var y = Math.floor(this.cursor.y / 20) * 20;
	this.context.beginPath()
	this.context.moveTo(x, y);
	this.context.lineTo(x + 20, y);
	this.context.lineTo(x + 20, y + 20);
	this.context.lineTo(x, y + 20);
	this.context.closePath();
	this.context.strokeStyle = "red";
	this.context.stroke();

	for(var i = 0; i < Config.map.width * Config.map.height; i++)
	{
		if(this.tiles[i] == undefined)
			continue;

		var tile = this.tiles[i];
		var x = i % Config.map.width;
		var y = Math.floor(i / Config.map.width);
		this.context.drawImage(
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

Editor.prototype.export = function()
{
	var data = "";

	data += String.fromCharCode(Config.map.width & 0xff);
	data += String.fromCharCode(Config.map.height & 0xff);
	
	for(var i = 0; i < Config.map.width * Config.map.height; i++)
	{
		if(this.tiles[i] == undefined)
			continue;

		data += String.fromCharCode((i & 0xff00) >> 8);
		data += String.fromCharCode(i & 0xff);
		data += String.fromCharCode(Util.findTileId(this.tiles[i].name));
	}

	return btoa(data);
}