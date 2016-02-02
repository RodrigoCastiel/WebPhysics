function Mesh1dTool(parent) {
	this.parent = parent;
	this.active = false;
	this.busy = false;

	this.obj = null;
	this.fst_end = {x: 0, y: 0};
	this.snd_end = {x: 0, y: 0};
	this.fst_type = EndType.FREE;
	this.snd_type = EndType.FREE;
	this.mesh1d = null;
	this.connector_type  = ConnectorType.ROPE;

	this.ToggleActive = function () {
		this.active = !this.active;

		if (this.active) {
			this.parent.SetMessage("Left click on a particle or at a" + 
								   "random point and drag to create " +
								   "a string. Use right click to    " +
								   "create attached strings.");
		}
	}

	this.MouseDown = function (which) {
		if (!this.active)
			return;

		if (!this.busy) {
			this.fst_end.x = mouse.x;
			this.fst_end.y = mouse.y;
			this.fst_type = EndType.FREE;
			if (which == Mouse.LFT) {
				this.obj = system.GetObjectMouse(mouse.x, mouse.y);
				if (this.obj != null) {
					this.fst_end  = this.obj;
					this.fst_type = EndType.PARTICLE;
				}
			} else if (which == Mouse.RGT) {
				this.fst_type = EndType.ATTACHED;
			}

			this.busy = true;
		}
		
	}

	this.MouseMove = function (which) {
		if (!this.active)
			return;
	}

	this.MouseUp = function (which) {
		if (!this.active)
			return;

		if (this.busy) {
			if (this.fst_type == EndType.ATTACHED) {
				if(which == Mouse.RGT ) {
			 		this.snd_end.x = mouse.x;
			 		this.snd_end.y = mouse.y;
					this.snd_type = EndType.ATTACHED;

					if (this.CheckLength()) {
						var mesh1d = Mesh1d(this.fst_end, this.fst_type, 
												 this.snd_end, this.snd_type,
												 this.connector_type);
						system.AddMesh1d(this.mesh1d);
					}

					this.fst_end = {x: 0, y: 0};
					this.snd_end = {x: 0, y: 0};
					this.busy = false;
					this.obj = null;
				}
			} else {
				if (which == Mouse.LFT) {
					this.snd_end.x = mouse.x;
			 		this.snd_end.y = mouse.y;
			 		this.snd_type = EndType.FREE;
					this.obj = system.GetObjectMouse(mouse.x, mouse.y);

					if (this.obj != null) {
						this.snd_end  = this.obj;
						this.snd_type = EndType.PARTICLE;
					} 
					
					if (this.CheckLength()) {
						var mesh1d = Mesh1d(this.fst_end, this.fst_type, 
												 this.snd_end, this.snd_type,
												 this.connector_type);
						system.AddMesh1d(mesh1d);
					}

					this.fst_end = {x: 0, y: 0};
					this.snd_end = {x: 0, y: 0};
					this.busy = false;
					this.obj = null;
				}
			}
		}

	}

	this.Draw = function (canvas) {
		if (!this.active)
			return;
		
		if (this.busy) {
			var ctx = canvas.getContext('2d');
			ctx.beginPath();
				ctx.lineWidth = 2;

				if (this.connector_type == ConnectorType.ROPE)
					ctx.strokeStyle = 'rgb(40, 0, 250)';
				else if (this.connector_type == ConnectorType.SPRING)
					ctx.strokeStyle = 'rgb(10, 250, 10)';

				ctx.moveTo(this.fst_end.x, this.fst_end.y);
				ctx.lineTo(mouse.x, mouse.y);
				ctx.stroke();
			ctx.closePath();
		}
	}

	this.KeyboardDown = function (which) {
		if (!this.active)
			return;

	}

	this.CheckLength = function() {
		var length = MathDist(this.fst_end.x, this.fst_end.y, 
							  this.snd_end.x, this.snd_end.y);
		return length > 45;
	}

}