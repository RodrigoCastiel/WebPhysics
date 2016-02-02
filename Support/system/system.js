/*
*  	Copyright by Rodrigo Castiel, December 18th.
*	
*	System gathers all other classes into a single one.
*   It contains particles, force fields and all auxiliar
*   connectors and objects.
*/

function System() {
	// Attributes.
	// Objects.
	this.particles    = [];
	this.force_fields = [];
	this.connectors   = [];
	this.meshes1d     = [];
	this.meshes2d     = [];
	
	// Physical properties.
	this.const_G = 0.001;
	this.friction_coefficient = 0.0;

	// Methods.
	this.ResultForceEval = function(x, y) {
		var sx = 0.0, sy = g.on ? 0.5 : 0.0;
		//for (i = 0; i < 1; i++) {
		//	var mag = this.force_fields[i].Mag(x, y);
		//	sx += mag.mx;
		//	sy += mag.my;
		//}
		return {mx: sx, my: sy};
	}

	this.result_force_field = new ForceField(this.ResultForceEval);
	
	this.AddParticle = function(x, y, dx, dy) {
		if (this.particles.length < 1000) {
			this.particles.push(new Particle(x, y, dx, dy));
		}
	}
	
	this.AddConnector = function(connector) {
		if (this.connectors.length < 1000) {
			this.connectors.push(connector);
			return true;	
		} else {
			return false;
		}
	}
	
	this.AddMesh1d = function(mesh1d) {
		if (this.meshes1d.length < 20) {
			this.meshes1d.push(mesh1d);
		}
	}

	this.AddMesh2d = function(mesh2d) {
		if (this.meshes2d.length < 20) {
			this.meshes2d.push(mesh2d);
		}
	}

	this.RemoveRope= function() {
		if (this.connectors.length > 0) {
			return ;
		}
	}
	
	this.AddForceField = function(force_field) {
		if (this.force_fields.length < 10) {
			this.force_fields.push(force_field);
		}
	}

	this.Update = function(canvas) {		
		for (i = 0; i < this.particles.length; ++i)
			this.particles[i].UpdateForce(this.result_force_field);
		
		for (i = 0; i < this.connectors.length; ++i)
			this.connectors[i].Update();
		
		for (i = 0; i < this.particles.length; ++i)
			this.particles[i].UpdateMotion(canvas);
	}
	
	this.Draw = function(canvas) {
		ctx = canvas.getContext('2d');
		this.result_force_field.Draw(canvas, 30);
		
		for (i = 0; i < this.connectors.length; ++i) {
			this.connectors[i].Draw(canvas);
		}
		for (i = 0; i < this.meshes2d.length; ++i) {
			this.meshes2d[i].Draw(canvas);
		}
		for (i = 0; i < this.particles.length; ++i) {
			this.particles[i].Draw(canvas);
		}
	}	

	this.GetObjectMouse = function(x, y) {
		var info = system.NearestParticle(x, y);
		if (info != null && 
			info.dist < system.particles[info.index].radius*3) {  // Inside the area.
			return system.particles[info.index];	
		} else {
			return null;
		}
	}
	
	this.NearestParticle = function(x, y) {
		var min_dist = 5000;
		var min_dist_i = -1;

		if (this.particles.length == 0) {
			return null;
		}

		for (i = 0; i < this.particles.length; ++i) {
			var dist = MathDist(x, y, this.particles[i].x, this.particles[i].y);
			if (dist < min_dist) {
				min_dist_i = i;
				min_dist = dist;
			}			
		}
		return {index: min_dist_i, dist: min_dist};
	}
}