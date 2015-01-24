var Physics = {
	intersects: function(a,b)
	{
		return !(a.max.x < b.min.x ||
			a.max.y < b.min.y ||
			a.min.x > b.max.x ||
			a.min.y > b.max.y);
	},
	minimumTranslation: function(a,b)
	{
		var amin = a.min;
        var amax = a.max;
        var bmin = b.min;
        var bmax = b.max;

        var mtd = {x:0, y:0};

        var left = (bmin.x - amax.x);
        var right = (bmax.x - amin.x);
        var top = (bmin.y - amax.y);
        var bottom = (bmax.y - amin.y);

        // box dont intersect   
        if (left > 0 || right < 0) return false;
        if (top > 0 || bottom < 0) return false;

        // box intersect. work out the mtd on both x and y axes.
        if (Math.abs(left) < right)
            mtd.x = left;
        else
            mtd.x = right;

        if (Math.abs(top) < bottom)
            mtd.y = top;
        else
            mtd.y = bottom;

        // 0 the axis with the largest mtd value.
        if (Math.abs(mtd.x) < Math.abs(mtd.y))
            mtd.y = 0;
        else
            mtd.x = 0; 
        return mtd;
	},
	directions: 
	{
		UP: 0,
		RIGHT: 1,
		DOWN: 2,
		LEFT: 3,
	}
};

function AABB()
{
	this.min = {
		x: 0,
		y: 0,
	}
	this.max = {
		x: 0,
		y: 0,
	}
}

AABB.prototype.move = function(vec2)
{
	var a = new AABB();
	a.min.x = this.min.x + vec2.x;
	a.max.x = this.max.x + vec2.x;
	a.min.y = this.min.y + vec2.y;
	a.max.y = this.max.y + vec2.y;
	return a;
}