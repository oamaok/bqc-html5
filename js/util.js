var Util = {

	getTime: function()
	{
		return (new Date()).getTime();
	},

	findTileId: function(tileName)
	{
		for(var i = 0; i < Tiles.length; i++)
		{
			if(Tiles[i].name == tileName)
				return i;
		}
	},


};