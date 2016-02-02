// Mesh1d is the generalization of a slender structure.
// It has two ends and a connector type.

function Mesh1d(end0, type0, end1, type1, connector_type) {
	this.end0 = null;
	this.end1 = null;
	this.joints  = [];
	this.connectors = [];
	this.connector_type = connector_type;

	Initialize(end0, type0, end1, type1);


	function Initialize(end0, type0, end1, type1) {
		this.end0 = end0;
		this.end1 = end1;
		var xo = this.end0.x;
		var yo = this.end0.y;
		var x  = this.end1.x;
		var y  = this.end1.y;
		var length = MathDist(xo, yo, x, y);
		var connector_length = 15;
		var n = Math.floor(length/connector_length);
		connector_length = length/n;

		console.log(this.joints);

		var i = 0, last = n;
		if (type0 == EndType.ATTACHED) {
			this.joints.push(new AttachPoint(xo, yo));
			i = 1;
		} else if (type0 == EndType.PARTICLE) {
			this.joints.push(this.end0);
			i = 1;
		}

		if (type1 == EndType.ATTACHED || type1 == EndType.PARTICLE)
			last = n-1;

		// Create multiple particles.
		for (; i <= last; i++) {
			var t = i/n;
			var xt = xo*(1-t) + x*t;
			var yt = yo*(1-t) + y*t;
			system.AddParticle(xt, yt, 0, 0);
			particle = system.particles[system.particles.length-1];
			particle.SetRadius(connector_length/3);
			particle.in_mesh = true;
			particle.density = particle.density/4;
			particle.loss_factor = 0.04;
			this.coef_e  = 0.25;
			this.joints.push(particle);
		}

		if (type1 == EndType.ATTACHED)
			this.joints.push(new AttachPoint(x, y));
		else if (type1 == EndType.PARTICLE)
			this.joints.push(this.end1);
			
		// Connect them all.
		for (i = 0; i < n; i++) {
			var connector = null;
			var a = ((i == 0) ? 1 : i);
			var b = ((i == 0) ? 0 : i+1);

			if (this.connector_type == ConnectorType.ROPE) {
				if (type0 == EndType.ATTACHED && type1 == EndType.ATTACHED)
					connector = new Rope(0.45, connector_length/8, this.joints[a]);
				else 
					connector = new Rope(0.25, connector_length, this.joints[a]);

			} else if (this.connector_type == ConnectorType.SPRING) {
				if (type0 == EndType.ATTACHED && type1 == EndType.ATTACHED)
					connector = new Spring(1.0, connector_length, this.joints[a]);
				else 
					connector = new Spring(0.25, connector_length, this.joints[a]);	

			} else if (this.connector_type == ConnectorType.DAMPER) {

			}

			connector.in_mesh = true;
			connector.AddEnd(this.joints[b]);
			this.connectors.push(connector);
			system.AddConnector(connector);
		}
	}
}