function Game(canvasId)
{
	this.canvasId = canvasId;
	this.canvas = null;
	this.context = null;

	this.map = null;

	this.players = [];

	this.eventQueue = new Array();

	this.lastTime = null;
	this.running = true;

	this.frame = 0;

	this.keys = [];
	for(var i = 0; i < 256; i++)
		this.keys[i] = false;
}

Game.prototype.eventListener = function(event)
{

	if(event instanceof KeyboardEvent)
	{
		if(event.which != 116)
			event.preventDefault();
		if(event.type == "keydown")
		{
			this.keys[event.which] = true;
		}
		else
		{
			this.keys[event.which] = false;
		}
	}
}

Game.prototype.init = function()
{
	this.canvas = $("#" + this.canvasId);
	this.canvas.attr({
		width: Config.viewport.width,
		height: Config.viewport.height,
	});
	this.context = this.canvas[0].getContext("2d");

	this.map = new Map();

	this.map.import("KCgABQAABgAABwAACAAACQAACgAACwAADAAADQAADgAADwAAEAAAEQAAEgAAEwAAFAAAFQAAFgAAFwAAGAAAGQAAGgAAGwAAHAAAHQAAHgAAHwAAIAAALQAALgAALwAAMAEAMQAAMgAAMwAANAAANQAANgEANwEAOAEAOQAAOgAAOwAAPAAAPQAAPgAAPwAAQAAAQQAAQgAAQwAARAAARQAARgAARwAASAAAVQAAVgAAVwAAWwAAXAAAXQAAYQAAYgAAYwAAZAAAZQAAZgAAZwAAaAAAaQAAagAAawAAbAAAbQAAbgAAbwAAcAAAfQAAfgAAfwAAgQAAgwAAhAAAhQAAiQAAigAAiwAAjAAAjQAAjgAAjwAAkAAAkQAAkgAAkwAAlAAAlQAAlgAAlwAAmAAApQAApgAApwAAqQAAqwAArAAArQAAsQAAsgAAswAAtAAAtQAAtgAAtwAAuAAAuQAAugAAuwAAvAAAvQAAvgAAvwAAwAAAzQAAzgAAzwAA0QAA4wAA5AAA5QAA5gAA5wAA6AAA9QAA9gAA9wAA+QAA+gAA+wABDQABDgABDwABEAABHQABHgABHwABIQABIgABIwABJAIBNgABNwABOAABRQABRgABRwABSQABSgABSwABXgABXwABYAABbQABbgABbwABcQABcgABcwABdAABdQABdgABdwABeAABeQABegABewABfwABgAABgQABggABgwABhAEBhQABhgABhwABiAABlQABlgABlwABmgABmwABnAABnQABngABnwABoAABoQABogABowABpwABqAABqgMBqwABrAABrQABrgABrwABsAABvQABvgABvwABwAABwgABwwABxAABxQABxgABxwAByAAByQABygABywABzwAB0AAB0gAB0wAB1AAB1QAB1gAB1wAB2AAB5QAB5gAB5wAB6gAB7gAB7wAB8AAB8QAB8gAB8wAB9AAB9QAB9gAB9wAB+gAB+wAB/AAB/QAB/gAB/wACAAACDQACDgACDwACEQACEgACFAACFgACFwACGAACGQACGgACGwACHAACHQACHgACHwACIQACIgACIwACJAACJQACJgACJwACKAACNQACNgACNwACPAACSQACSgACSwACTAACTQACTgACTwACUAACXQACXgACXwACYAACYQACYgACYwACZAACZQACZgACZwACaAACaQACagACawACbAACbQACbgACbwACcAACcQACcgACcwACdAACdQACdgACdwACeAAChQAChgAChwACiAACiQACigACiwACjAACjQACjgACjwACkAACkQACkgACkwAClAAClQAClgAClwACmAACmQACmgACmwACnAACnQACngACnwACoAACrQACrgACrwACsAACsQACsgACswACtAACtQACtgACtwACuAACuQACugACuwACvAACvQACvgACvwACwAACwQACwgACwwACxAACxQACxgACxwACyAAC1QAC1gAC1wAC2AAC2QAC2gAC2wAC3AAC3QAC3gAC3wAC4AAC4QAC4gAC4wAC5AAC5QAC5gAC5wAC6AAC6QAC6gAC6wAC7AAC7QAC7gAC7wAC8AAC/QAC/gAC/wADAAADAQADAgADAwADBAADBQADBgADBwADCAADCQADCgADCwADDAADDQADDgADDwADEAADEQADEgADEwADFAADFQADFgADFwADGAA=");
	var local = new Player();
	this.players.push(local);

	var spawn = this.map.getSpawn();
	local.position = spawn;

	local.aabb.move(spawn);

	var that = this;
	window.addEventListener("keydown", function(event){that.eventListener(event)});
	window.addEventListener("keyup", function(event){that.eventListener(event)});
}

Game.prototype.start = function()
{
	this.init();

	this.lastTime = Util.getTime();

	this.main();
}

Game.prototype.main = function()
{
	var newTime = Util.getTime();
	var deltaTime = newTime - this.lastTime;
	this.lastTime = newTime;

	this.update(1); // 1 for fixed timestep

	this.render(deltaTime);


	this.frame++;
	var that = this;
	if(this.running)
		requestAnimationFrame((function(){that.main()}));
}

Game.prototype.update = function(deltaTime)
{
	this.context.fillStyle = Config.viewport.clearColor;
	this.context.fillRect(0, 0, Config.viewport.width, Config.viewport.height);
	this.context.font = "12px Courier New";
	this.context.fillText(deltaTime, 5, 13)
	this.map.update();
	for(var i = 0; i < this.players.length; i++)
	{
		this.players[i].update(deltaTime, this, this.frame);
	}
}

Game.prototype.render = function(deltaTime)
{

	this.map.render(this.context);
	for(var i = 0; i < this.players.length; i++)
	{
		this.players[i].render(this.context, this.frame);
	}
}