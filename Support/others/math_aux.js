function MathDist(xo, yo, x, y) {
	return Math.sqrt((x-xo)*(x-xo) + (y-yo)*(y-yo));
}

function MathVecNorm(vx, vy) {
	return Math.sqrt(vx*vx + vy*vy);
}

function MathDotProduct(a1, a2, b1, b2) {
	return a1*b1 + a2*b2;
}

function MathSign(n) {
	return (n >= 0) ? 1 : -1;
}

const MAX_RADIUS = 50.0;
const MIN_RADIUS = 5;

const MAX_DENSITY = 8.00 * 1/1963.495;
const MIN_DENSITY =  0.50 * 1/1963.495;

Array.prototype.swap = function (x, y) {
	var b = this[x];
	this[x] = this[y];
	this[y] = b;
	return this;
}

function NewArray2d(rows, columns) {
   var array = new Array(rows);
   for (var i = 0; i < rows; i++) {
       array[i] = new Array(columns);
   }
   return array;
}
