function ConnectorTool(parent) {
	this.parent = parent;
	this.active = false;
	this.busy = false;
	this.particle1 = null;
	this.particle2 = null;
	this.connector = null;
	this.connector_type = ConnectorType.DAMPER;

	this.ToggleActive = function () {
		this.active = !this.active;

		if (this.active) {
			this.parent.SetMessage("Click on a particle and then try" + 
								   "to click on another particle or " +
								   "at some random point!           " +
								   "Press C to change connector type" );
		}
	}

	this.MouseDown = function (which) {
		if (!this.active)
			return;

		if (which == Mouse.LFT) {
			if (!this.busy) {
				this.particle1 = system.GetObjectMouse(mouse.x, mouse.y);
				if (this.particle1 != null && this.particle1 instanceof Particle) {
					if (this.connector_type == ConnectorType.ROPE)
						this.connector = new Rope(1.0, 1.0, this.particle1);
					else if (this.connector_type == ConnectorType.SPRING)
						this.connector = new Spring(1.0, 1.0, this.particle1);
					else if (this.connector_type == ConnectorType.DAMPER)
						this.connector = new Damper(1.0, 1.0, this.particle1);

					system.AddConnector(this.connector);
					this.busy = true;
				}

			} else {
				this.particle2 = system.GetObjectMouse(mouse.x, mouse.y);
				if (this.particle2 != null && this.particle1 != this.particle2
				 && this.particle2 instanceof Particle) {
					this.connector.AddEnd(this.particle2);
					this.connector = null;
					this.particle1 = null;
					this.particle2 = null;
					this.busy = false;
				} else if (this.particle2 == null) {
					this.connector.AddEnd(new AttachPoint(mouse.x, mouse.y));
					this.connector = null;
					this.particle1 = null;
					this.particle2 = null;
					this.busy = false;
				}
			}
		}
		
	}

	this.MouseMove = function (which) {
		if (!this.active)
			return;

	}

	this.MouseUp = function (which) {
		if (!this.active)
			return;

	}

	this.Draw = function (canvas) {
		if (!this.active)
			return;

		var ctx = canvas.getContext('2d');
		var types = ["<Rope>", "<Spring>", "<Damper>"];

		ctx.beginPath();
		ctx.fillStyle = "#DDDDDD";
		ctx.font = "bold 12px Courier New";
		ctx.shadowBlur = 10;
		ctx.shadowColor = '#FF0000';
		ctx.fillText(types[this.connector_type], mouse.x + 10, mouse.y + 10);
		ctx.closePath();
	}

	this.KeyboardDown = function (key) {
		if (!this.active)
			return;

		switch (key) {
			case Keys.KEY_C:
			case Keys.KEY_c:
				this.connector_type = (this.connector_type+1) % 3;
				break;
			default:
				// Bla.
		}		
	}
}