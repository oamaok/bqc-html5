

function Player()
{
	this.local = true;
	this.position = {
		x: 0,
		y: 0,
	}
	this.velocity = {
		x: 0,
		y: 0,
	}
	this.gravity = 0.4;

	this.aabb = new AABB();
	this.aabb.min.x = 5;
	this.aabb.max.x = 13;
	this.aabb.min.y = 4;
	this.aabb.max.y = 20;

	this.onGround = false;
	this.onGroundTile = null;

	this.canJump = true;
}

Player.prototype.update = function(deltaTime, gameContext, frame)
{

	if(!gameContext.keys[Config.controls.moveLeft] && !gameContext.keys[Config.controls.moveRight] && this.onGround)
	{
		this.velocity.x *= Config.player.platformFriction;
	}

	if(gameContext.keys[Config.controls.moveLeft])
	{

		if(this.onGround)
			if(this.velocity < 0)
				this.velocity.x -= Config.player.runSpeedAcceleration * deltaTime;
			else
				this.velocity.x -= Config.player.runSpeedAcceleration * deltaTime;

		else
			this.velocity.x -= Config.player.airSpeedAcceleration * deltaTime;
	}
	if(gameContext.keys[Config.controls.moveRight])
	{
		if(this.onGround)
			if(this.velocity > 0)
				this.velocity.x += Config.player.runSpeedAcceleration * deltaTime;
			else
				this.velocity.x += Config.player.runSpeedAcceleration * deltaTime;
		else
			this.velocity.x += Config.player.airSpeedAcceleration * deltaTime;
	}
	this.velocity.x = this.velocity.x.clamp(-Config.player.runSpeed, Config.player.runSpeed);


	this.velocity.y += this.gravity * deltaTime;
	if(gameContext.keys[Config.controls.jump])
	{
		if(this.onGround)
			this.velocity.y += Config.player.jumpSpeed * -Math.sign(this.gravity);
	}
	this.velocity.y = this.velocity.y.clamp(-Config.player.airSpeed, Config.player.airSpeed);

	/*
	var deltaY = Math.floor(this.velocity.y * deltaTime);
	if(this.velocity.y < 0)
	{
		deltaY = Math.floor(this.velocity.y * deltaTime + 1);
	}
	
	var deltaX = Math.floor(this.velocity.x * deltaTime);
	if(this.velocity.x < 0)
	{
		deltaX = Math.floor(this.velocity.x * deltaTime + 0.5);
	}

	*/
	var deltaX = this.velocity.x * deltaTime;
	var deltaY = this.velocity.y * deltaTime;

	this.onGround = false;
	this.onGroundTile = null;

	for(var i = 0; i < Config.map.width * Config.map.height; i++)
	{
		if(gameContext.map.tiles[i] == undefined)
			continue;

		var tile = gameContext.map.tiles[i];

		if(tile.collides == false)
			continue;


		var tileX = i % Config.map.width;
		var tileY = Math.floor(i / Config.map.width);
		var tileAABB = new AABB();

		tileAABB.min.x = 0;
		tileAABB.max.x = 20;
		tileAABB.min.y = 0;
		tileAABB.max.y = 20;

		tileAABB = tileAABB.move({
			x: tileX * 20,
			y: tileY * 20
		});

		
		var playerAABB = null;
		var intersects = false;

		var lerpX = 0;
		var lerpY = 0;
		for(var lerp = 1; lerp <= 20; lerp++)
		{
			lerpX = deltaX * (lerp / 20);
			lerpY = deltaY * (lerp / 20);
			playerAABB = this.aabb.move({
				x: this.position.x + lerpX,
				y: this.position.y + lerpY,
			});
			if(Physics.intersects(playerAABB, tileAABB))
			{
				intersects = true;
				break;
			}
		}
		if(intersects)
		{
			var translation = Physics.minimumTranslation(playerAABB, tileAABB);
			var side = translation.x == 0 ? (translation.y < 0 ? Physics.directions.UP : Physics.directions.DOWN) : (translation.x < 0 ? Physics.directions.LEFT : Physics.directions.RIGHT);


			switch(side)
			{
				case Physics.directions.LEFT:
					var neighbour = gameContext.map.getTile(tileX - 1, tileY);
					if(neighbour !== undefined && neighbour.collides)
					{
						continue;
					}
				break;
				case Physics.directions.RIGHT:
					var neighbour = gameContext.map.getTile(tileX + 1, tileY);
					if(neighbour !== undefined && neighbour.collides)
						continue;
				break;
				case Physics.directions.UP:
					var neighbour = gameContext.map.getTile(tileX, tileY - 1);
					if(neighbour !== undefined && neighbour.collides)
						continue;
				break;
				case Physics.directions.DOWN:
					var neighbour = gameContext.map.getTile(tileX, tileY + 1);
					if(neighbour !== undefined && neighbour.collides)
					{
						continue;
					}
				break;
			}


			tile.onHit(this, side);
			if(translation.y != 0)
			{
				deltaY = lerpY;
				deltaY += translation.y;

				if(Math.sign(translation.y) == -Math.sign(this.gravity) && Math.sign(this.velocity.y) == Math.sign(this.gravity))
				{
					this.velocity.y = 0;
					this.onGround = true;
					this.onGroundTile = tile;
				}
				if(Math.sign(translation.y) != Math.sign(this.velocity.y))
				{
					this.velocity.y = 0;
				}
			}
			if(translation.x != 0)
			{
				deltaX = lerpX;
				deltaX += translation.x;
				if(this.velocity.x * translation.x < 0)
				{
					this.velocity.x = 0;
				}
			}
		}
	}
	this.position.y += deltaY;
	this.position.x += deltaX;

	//this.position.y = Math.ceil(this.position.y);
	//this.position.x = Math.ceil(this.position.x);
}

var playerTexture = new Image();
playerTexture.src = "img/player.png";

Player.prototype.switchGravity = function()
{
	if(this.gravity < 0)
	{
		this.aabb.min.x = 5;
		this.aabb.max.x = 13;
		this.aabb.min.y = 4;
		this.aabb.max.y = 20;
	}
	else
	{
		this.aabb.min.x = 5;
		this.aabb.max.x = 13;
		this.aabb.min.y = 0;
		this.aabb.max.y = 16;
	}

	this.gravity = -this.gravity;
	this.velocity.y = -this.velocity.y;
}

Player.prototype.render = function(context, frame)
{
	var offsetY = this.gravity < 0 ? 20 : 0;
	if(this.velocity.x < 0)
	{
		offsetY += 40;
	}
	if(Math.abs(this.velocity.x) < 2)
	{
		offsetX = 0;
	}
	else
	{	
		var animFrame = Math.floor(frame / 4) % 8;
		switch(animFrame)
		{
			case 0:
				offsetX = 0;
			break;
			case 1:
				offsetX = 60;
			break;
			case 2:
				offsetX = 20;
			break;
			case 3:
				offsetX = 60;
			break;
			case 4:
				offsetX = 0;
			break;
			case 5:
				offsetX = 80;
			break;
			case 6:
				offsetX = 40;
			break;
			case 7:
				offsetX = 80;
			break;
		}
	}
	context.drawImage(
		playerTexture, 
		offsetX, 
		offsetY, 
		20, 20, 
		Math.floor(this.position.x), 
		Math.floor(this.position.y), 
		20, 20
	);

	

	
}