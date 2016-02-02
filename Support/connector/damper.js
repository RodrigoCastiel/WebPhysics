// const_k  - elastic constant when L > Lo. 				Ranges between 0.01 and 10.0
// Lo       - natural natural_length						Ranges between 0.01 and SCREEN_DIAG
// particle - the particle that the damper is attached to 	..............
function Damper (const_k, Lo, particle) {
	// Physical attributes.
	this.natural_length = Lo;
	this.length = 1.0;
	this.const_k = const_k;
	this.const_c = 0.01;
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
			var vx1 = this.p1.dx, vy1 = this.p1.dy;
			var vx2 = this.p2.dx, vy2 = this.p2.dy;

			var delta = MathDist(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
			var dx = (this.p2.x - this.p1.x)/delta, dy = (this.p2.y - this.p1.y)/delta;


			// Project v1 and v2 in (dx, dy)'. Then, compute the relative speed
			// and the force will be - c * abs(this speed).
			var v1 = MathDotProduct(vx1, vy1, dx, dy);
			var v2 = MathDotProduct(vx2, vy2, dx, dy);

			// console.log("1: " + v1      + "     2: " + v2     );
			// console.log("1: " + v1_sign + "     2: " + v2_sign);
			// console.log("------------");

			var dv = (v2 - v1);
			var dv_sign = MathSign(dv);
			var fx = dx * (this.const_c)*Math.abs(dv);
			var fy = dy * (this.const_c)*Math.abs(dv);
			
			this.p1.ApplyForce(+fx*dv_sign, +fy*dv_sign);
			this.p2.ApplyForce(-fx*dv_sign, -fy*dv_sign);
		}
	}
	
	this.Draw = function(canvas) {
		ctx = canvas.getContext('2d');
		ctx.beginPath();
			ctx.lineWidth = 5;
			var xs = this.connected_mouse ? mouse.x : this.p2.x;
			var ys = this.connected_mouse ? mouse.y : this.p2.y;
			
			var d = this.length - this.natural_length;
			var dmax = Math.sqrt(canvas.width*canvas.width + canvas.height*canvas.height);
			ctx.moveTo(xs, ys);
			ctx.lineTo(this.p1.x, this.p1.y);
			ctx.strokeStyle = 'rgb(250, 0, 15)';
				
			ctx.stroke();
		ctx.closePath();
		
		if (this.connected_attachpoint) {
			this.p2.Draw(canvas);
		}
		
	}	
}