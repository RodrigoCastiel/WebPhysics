function Mesh2d(origin, width, height) {
	this.particles  = [];
	this.connectors = [];

	this.n_h = 0;
	this.n_w = 0;

	this.const_k = 1.0;
	this.const_c = 0.001;
	this.particle_dist = 20;

	Initialize(origin, width, height);

	function Initialize(origin, end) {
		var width  = end.x - origin.x;
		var height = end.y - origin.y; 

		var ideal_length = this.particle_dist;
		var n_w = Math.floor(width/ideal_length);
		var n_h = Math.floor(height/ideal_length);

		this.n_h = n_h;
		this.n_w = n_w;

		var length_w = width/n_w;
		var length_h = height/n_h;

		this.particles = NewArray2d(n_h+1, n_w+1);

		var const_k = this.const_k;
		var const_c = this.const_c;

		for (var i = 0; i <= n_h; i++) {
			for (var j = 0; j <= n_w; j++) {
				var x = origin.x + j*length_w;
				var y = origin.y + i*length_h;

				system.AddParticle(x, y, 0, 0);
				particle = system.particles[system.particles.length-1];
				particle.SetRadius(ideal_length/3);

				particle.in_mesh = false;
				particle.density = particle.density;
				particle.loss_factor = 0.04;
				this.coef_e  = 0.25; 
				this.particles[i][j] = particle;
			}
		}

		for (var i = 0; i < n_h; i++) {
			for (var j = 0; j <= n_w; j++) {
				var spring = new Spring(const_k, length_w, this.particles[i][j]);
				var damper = new Damper(const_k, length_w, this.particles[i][j]);

			
				spring.in_mesh = true;
				damper.in_mesh = true;

				spring.AddEnd(this.particles[i+1][j]);
				damper.AddEnd(this.particles[i+1][j]);
				damper.const_c = const_c;

				this.connectors.push(spring);
				this.connectors.push(damper);

				system.AddConnector(spring);
				system.AddConnector(damper);
			}
		}

		for (var i = 0; i <= n_h; i++) {
			for (var j = 0; j < n_w; j++) {
				var spring = new Spring(const_k, length_h, this.particles[i][j]);
				var damper = new Damper(const_k, length_h, this.particles[i][j]);

				spring.in_mesh = true;
				damper.in_mesh = true;

				spring.AddEnd(this.particles[i][j+1]);
				damper.AddEnd(this.particles[i][j+1]);
				damper.const_c = const_c;

				this.connectors.push(spring);
				this.connectors.push(damper);

				system.AddConnector(spring);
				system.AddConnector(damper);
			}
		}

		for (var i = 0; i < n_h; i++) {
			for (var j = 0; j < n_w; j++) {
				var length = MathVecNorm(length_h, length_w);
				var spring = new Spring(const_k, length, this.particles[i][j]);
				var damper = new Damper(const_k, length, this.particles[i][j]);

				spring.in_mesh = true;
				damper.in_mesh = true;

				spring.AddEnd(this.particles[i+1][j+1]);
				damper.AddEnd(this.particles[i+1][j+1]);
				damper.const_c = const_c;

				this.connectors.push(spring);
				this.connectors.push(damper);

				system.AddConnector(spring);
				system.AddConnector(damper);
			}
		}

		for (var i = 1; i <= n_h; i++) {
			for (var j = 0; j < n_w; j++) {
				var length = MathVecNorm(length_h, length_w);
				var spring = new Spring(const_k, length, this.particles[i][j]);
				var damper = new Damper(const_k, length, this.particles[i][j]);

				spring.in_mesh = true;
				damper.in_mesh = true;

				spring.AddEnd(this.particles[i-1][j+1]);
				damper.AddEnd(this.particles[i-1][j+1]);
				damper.const_c = const_c;

				this.connectors.push(spring);
				this.connectors.push(damper);

				system.AddConnector(spring);
				system.AddConnector(damper);
			}
		}
	}

	this.Draw = function(canvas) {
		var ctx = canvas.getContext('2d');
		ctx.save();
			ctx.fillStyle = 'rgb(180, 180, 180)';
			ctx.strokeStyle = 'rgb(10, 10, 10)';
			for (var i = 0; i < n_h; i++) {
				for (var j = 0; j < n_w; j++) {
					ctx.beginPath();
						ctx.moveTo(this.particles[ i ][ j ].x, this.particles[ i ][ j ].y);
						ctx.lineTo(this.particles[ i ][j+1].x, this.particles[ i ][j+1].y);
						ctx.lineTo(this.particles[i+1][j+1].x, this.particles[i+1][j+1].y);
						ctx.lineTo(this.particles[i+1][ j ].x, this.particles[i+1][ j ].y);
					
					ctx.fill();
					ctx.stroke();
					ctx.closePath();
				}
			}
		ctx.restore();
	}
}
