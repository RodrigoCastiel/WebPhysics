// const_k  - elastic constant when L > Lo. 				Ranges between 0.01 and 10.0
// Lo       - natural natural_length						Ranges between 0.01 and SCREEN_DIAG
// particle - the particle that the rope is attached to 	..............
function Rope (const_k, Lo, particle) {
	// Physical attributes.
	this.natural_length = Lo;
	this.length = 100.0;
	this.const_k = const_k;
	this.p1 = particle;
	this.p2 = -1;
	this.in_mesh = false;
	
	this.x = 0;
	this.y = 0;

	// User interaction attributes.
	this.connected_mouse = true;
	this.connected_attachpoint = false;
	
	this.SetPosition = function(x, y) {
		this.x = x;
		this.y = y;
	}

	this.AddEnd = function (end) {
		if (end instanceof Particle)
			this.AttachParticle(end);
		else if (end instanceof AttachPoint)
			this.AddPoint(end);
	}

	// User interaction methods.
	this.AttachParticle = function(particle2) {
		this.p2 = particle2;
		this.connected_mouse = false;
	}
	
	this.AddPoint = function(attachpoint) {
		this.p2 = attachpoint;
		this.connected_mouse = false;
		this.connected_attachpoint = true;
	}
	
	// Update and draw functions.
	this.Update = function () {
		if (this.connected_mouse) {  // Connected to mouse.
			var delta = MathDist(this.p1.x, this.p1.y, mouse.x, mouse.y);
			var dx = (mouse.x - this.p1.x), dy = (mouse.y - this.p1.y);
			this.length = delta;
			
			if (this.length > this.natural_length) {
				var fx = (dx/delta)*(this.const_k)*(delta-this.natural_length)/100.0;
				var fy = (dy/delta)*(this.const_k)*(delta-this.natural_length)/100.0;
				this.p1.ApplyForce(fx, fy);
			} 
		
		} else if (this.connected_attachpoint) {
			var delta = MathDist(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
			var dx = (this.p2.x - this.p1.x), dy = (this.p2.y - this.p1.y);
			this.length = delta;
			
			if (this.length > this.natural_length) { 
				var fx = (dx/delta)*(this.const_k)*(delta-this.natural_length)/100.0;
				var fy = (dy/delta)*(this.const_k)*(delta-this.natural_length)/100.0;
				this.p1.ApplyForce(fx, fy);
			} 
			
		} else {
			var delta = MathDist(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
			var dx = (this.p2.x - this.p1.x), dy = (this.p2.y - this.p1.y);
			this.length = delta;
			
			if (this.length > this.natural_length) { 
				var fx = (dx/delta)*(this.const_k)*(delta-this.natural_length)/100.0;
				var fy = (dy/delta)*(this.const_k)*(delta-this.natural_length)/100.0;
				this.p1.ApplyForce(+fx, +fy);
				this.p2.ApplyForce(-fx, -fy);
			}
		}
	}
	
	this.Draw = function(canvas) {
		ctx = canvas.getContext('2d');
		ctx.beginPath();
			ctx.lineWidth = this.in_mesh ? 4 : 3;
			var xs = this.connected_mouse ? mouse.x : this.p2.x;
			var ys = this.connected_mouse ? mouse.y : this.p2.y;
			
			var d = this.length - this.natural_length;
			var dmax = Math.sqrt(canvas.width*canvas.width + canvas.height*canvas.height);
			ctx.moveTo(xs, ys);
			ctx.lineTo(this.p1.x, this.p1.y);
			ctx.strokeStyle = 'rgb(50, 0, 240)';

			if (this.in_mesh) {
				var density = (this.p1.density+this.p2.density)/2;
				var coeff = (density-MIN_DENSITY)/(MAX_DENSITY-MIN_DENSITY);
				var r = Math.floor(155*coeff) + 100;
				var b = 240 - Math.floor(240*coeff);
				ctx.strokeStyle = 'rgb(' + r + ', 0, ' + b + ')';
			}
				
			ctx.stroke();
		ctx.closePath();
		
		if (this.connected_attachpoint) {
			this.p2.Draw(canvas);
		}
		
	}	
}