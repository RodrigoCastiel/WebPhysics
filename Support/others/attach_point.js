function AttachPoint(x, y) {
	this.x = x;
	this.y = y;
	this.radius = 5;
	this.color  = '#AAAAAA';
	
	this.Draw = function (canvas) {
		var ctx = canvas.getContext('2d');
		ctx.save();
		ctx.beginPath();

		ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
		ctx.fillStyle = this.color;
		ctx.fill();		
		ctx.shadowBlur = 20;
		ctx.shadowColor = '#FFFFFF';
		ctx.closePath();
		ctx.restore();		
	}
	
}