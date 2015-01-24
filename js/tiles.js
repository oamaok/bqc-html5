var Tiles = [
	{
		name: "normal",
		texture: [0,0],
		collides: true,
		movable: true,
		friction: 0.3,
		onHit: function(player, side)
		{

		},
	},
	{
		name: "gravity",
		texture: [1,0],
		collides: true,
		movable: true,
		friction: 1,
		onHit: function(player, side)
		{
			if(player.gravity > 0 && side == Physics.directions.UP)
			{
				player.switchGravity();
			}

			if(player.gravity < 0 && side == Physics.directions.DOWN)
			{
				player.switchGravity();
			}

		},
	},
	{
		name: "spawn",
		texture: [2,0],
		collides: false,
		movable: false,
		friction: 1,
		onHit: function(player, side)
		{

		},
	},
	{
		name: "goal",
		texture: [3,0],
		collides: false,
		movable: false,
		friction: 1,
		onHit: function(player, side)
		{

		},
	},
];