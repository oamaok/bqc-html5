window.requestAnimationFrame = 
	window.requestAnimationFrame ||
	window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

Math.sign = function(num)
{
	return num < 0 ? -1 : 1;
}