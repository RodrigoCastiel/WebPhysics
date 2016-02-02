function ForceField(EvaluteFunc) {
	this.on = true;
	this.color = 'rgb(50, 50, 50)';
	this.EvaluteFunc = EvaluteFunc;
	
	this.Mag = function(x, y) {
		if (this.on) {
			var vec = this.EvaluteFunc(x, y);
			return vec;
		} else {
			return {mx: 0.0, my: 0.0};	
		}
	}
	
	this.Draw = function(canvas, detail) {
		if (this.on) {
			var ctx = canvas.getContext('2d');
			ctx.save();
			ctx.beginPath();
			ctx.lineWidth = 1;
			
			var aspect = canvas.width/canvas.height;
			var h = detail; 
			var w = Math.floor(h * aspect);
			var size_h = canvas.height/h;
			var size_w = canvas.width/w;
			
			for (i = 0; i < h; ++i) {
				for (j = 0; j < w; ++j) {
					var xc = j*size_w + size_w/2;
					var yc = i*size_h + size_h/2;
					var vector = this.Mag(xc, yc);
					var vx = vector.mx;
					var vy = vector.my;
					ctx.moveTo(xc - vx*size_w/2.5, yc - vy*size_h/2.5);
					ctx.lineTo(xc + vx*size_w/2.5, yc + vy*size_h/2.5);
				}		
			}
			
			ctx.strokeStyle = this.color;
			ctx.stroke();
			ctx.closePath();
			ctx.restore();		
		}
	}
	
}