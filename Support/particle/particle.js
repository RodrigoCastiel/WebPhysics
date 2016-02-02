function Particle(x, y, dx, dy){
	// Physical Variables.
	this.x = x;
	this.y = y;
	
	this.dx = dx;//8*(Math.random() - 0.5);
	this.dy = dy;//8*(Math.random() - 0.5);

	this.fx = 0;
	this.fy = 0;
	
	// Physical Attributes.
	this.density = 1/1963.495; 
	this.radius  = 25;
	this.coef_e  = 0.95;
	this.loss_factor = 0.005;
	this.temperature = 1.0;
	
	// Interaction.
	this.in_mesh     = false;
	this.controller  = null; 
	this.highlighted = false;

	this.SetController = function(controller) {
		this.controller = controller;
	}
	
	this.SetPosition = function(x, y) {
		this.x = x;
		this.y = y;
	}

	this.UpdateMotion = function(canvas) {
		if (this.controller) {  // If it's controlled by a superior obj.
			this.x = this.controller.x;
			this.y = this.controller.y;

			this.dx = this.controller.dx;
			this.dy = this.controller.dy;

			//console.log("Mouse speed: " + this.dx + " and " + this.dy);
		} else {
			this.UpdateSpeed();
			this.UpdatePosition(canvas);
		}
	}
	
	this.ApplyForce = function (fx, fy) {
		this.fx += fx;
		this.fy += fy;
	}
	
	this.UpdateForce = function (result_force_field) {
		var mass = this.density * (Math.PI * this.radius*this.radius);
		var vec = result_force_field.Mag(this.x, this.y);
		this.fx = mass*vec.mx;
		this.fy = mass*vec.my;
	}
	
	this.UpdateSpeed = function () {
		var mass = this.density * (Math.PI * this.radius*this.radius);
		this.dx += this.fx/mass;
		this.dy += this.fy/mass;
		this.dx *= (1 - this.loss_factor);
		this.dy *= (1 - this.loss_factor);
	}
	
	this.UpdatePosition = function (canvas) {
		var newX = this.x + this.dx;
		var newY = this.y + this.dy;
		var top = this.radius;
		var left = this.radius;
		var bottom = canvas.height - this.radius;
		var right = canvas.width - this.radius;
		
		// Border collision.
		if (newX > right) {
			this.x   = right;
			this.dx *= -1 * this.coef_e;
		} else if (newX < left) {
			this.x   = left;
			this.dx  *= -1 * this.coef_e;
		} else {
			this.x = newX;
		}
		
		if (newY > bottom) {
			this.y   = bottom;
			this.dy *= -1 * this.coef_e;
		} else if (newY < top) {
			this.y   = top;
			this.dy  *= -1 * this.coef_e;
		} else {
			this.y = newY;
		}
	}

	this.Draw = function(canvas){
		var ctx = canvas.getContext('2d');
		ctx.save();
		ctx.beginPath();
		if (!bolado_mode) {
			if (!this.in_mesh || this.highlighted) {
				ctx.lineWidth = this.radius/6;
				ctx.arc(this.x, this.y, this.radius*(5/6), 0, 2*Math.PI, false);
				ctx.fillStyle = '#DDDD00';
				ctx.shadowBlur = 20;
				ctx.shadowColor = this.highlighted ? "#FFFFFF" : "#0000AA";
			}
			ctx.fill();						
			// ctx.strokeStyle = "#999900";
			// ctx.stroke();
			// ctx.moveTo(this.x, this.y);
			// ctx.lineTo(this.x + 10*this.dx, this.y + 10*this.dy);
			// ctx.strokeStyle = 'rgb(255, 255, 255)';				
			// ctx.stroke();
		} else {
			ctx.drawImage(bolado_img, this.x-this.radius, this.y-this.radius, this.radius*2.1, this.radius*2.1);
		}

		ctx.closePath();
		ctx.restore();
	}
	
	this.IncMass = function() {
		if (!this.in_mesh) {  // Cannot change size in a mesh.
			if (this.radius < MAX_RADIUS)
				this.radius+=2;
		} else {  // Change density in a mesh.
			if (this.density < MAX_DENSITY)
				this.density += (1/1963.495)/2;
		}		
	}
	
	this.DecMass = function() {
		if (!this.in_mesh) {  // Cannot change size in a mesh.
			if (this.radius > MIN_RADIUS)
				this.radius-=2;
		} else {  // Change density in a mesh.
			if (this.density > MIN_DENSITY) 
				this.density -= (1/1963.495)/2;
		}
	}

	this.SetColor = function (color) {
		this.color = color;
	}

	this.SetRadius = function (radius) {
		if (radius > 3 && radius < 50) {
			this.radius = radius;
		}
	}
}