function Mesh2dTool(parent) {
	this.parent = parent;
	this.active = false;
	this.busy = false;

	this.fst_end = {x: 0, y: 0};
	this.snd_end = {x: 0, y: 0};
	this.mesh2d = null;

	this.ToggleActive = function () {
		this.active = !this.active;

		if (this.active) {
			this.parent.SetMessage("ararararara");
		}
	}

	this.MouseDown = function (which) {
		if (!this.active)
			return;

		if (!this.busy) {
			if (which == Mouse.LFT) {
				this.fst_end = {x: mouse.x, y: mouse.y};
				this.busy = true;	
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

		if (this.busy) {
			if (which == Mouse.LFT) {
				this.snd_end = {x: mouse.x, y: mouse.y};
				var mesh2d = Mesh2d(this.fst_end, this.snd_end);
				system.AddMesh2d(mesh2d);
				this.busy = false;
			}
		}

	}

	this.Draw = function (canvas) {
		if (!this.active)
			return;
		
		if (this.busy) {
			var ctx = canvas.getContext('2d');
			ctx.save();
			ctx.beginPath();
				var xo = this.fst_end.x, yo = this.fst_end.y;
				var w  = (mouse.x - xo), h = (mouse.y - yo);
				ctx.lineWidth = 2;
				ctx.globalAlpha = 0.4;
				ctx.fillStyle   = 'rgb(255, 255, 255)';
				ctx.strokeStyle = 'rgb(255, 255, 255)';
				ctx.rect(xo, yo, w, h);
				ctx.stroke();
				ctx.fill();
			ctx.closePath();
			ctx.restore();
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