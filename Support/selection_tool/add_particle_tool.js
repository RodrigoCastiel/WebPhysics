function AddParticleTool(parent) {
	this.parent = parent;
	this.active = false;
	this.busy = false;
	this.pos_x = -1;
	this.pos_y = -1;

	this.ToggleActive = function () {
		this.active = !this.active;

		if (this.active) {
			this.parent.SetMessage("Click, drag and release the left" +
								   "button of mouse to add a sphere " + 
								   "with speed!                     " );
		}
	}

	this.MouseDown = function (which) {
		if (!this.active)
			return;

		if (which == Mouse.LFT) {  // Mouse clicked - Start adding particle.
			if (!this.busy) {
				this.pos_x = mouse.x;
				this.pos_y = mouse.y;
				this.busy = true;
			} 

		} else if (which == Mouse.RGT) {
			if (which == Mouse.LFT) {  // Mouse released.
				var dx = (mouse.x - this.pos_x)/10;
				var dy = (mouse.y - this.pos_y)/10;
				this.busy = false;
				system.AddParticle(this.pos_x, this.pos_y, dx, dy);
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

		if (which == Mouse.LFT) {  // Mouse released.
			var dx = (mouse.x - this.pos_x)/10;
			var dy = (mouse.y - this.pos_y)/10;
			this.busy = false;
			system.AddParticle(this.pos_x, this.pos_y, dx, dy);
		} else if (which == Mouse.RGT) {

		}
	}

	this.Draw = function (canvas) {
		if (!this.active)
			return;

		if (this.busy) {
			var ctx = canvas.getContext('2d');
			ctx.beginPath();
				ctx.lineWidth = 2;
				ctx.strokeStyle = 'rgb(255, 0, 040)';
				ctx.moveTo(this.pos_x, this.pos_y);
				ctx.lineTo(mouse.x, mouse.y);
				ctx.stroke();
			ctx.closePath();
			ctx.beginPath();

			if (!bolado_mode) {
				ctx.lineWidth = 25/6;
				ctx.arc(this.pos_x, this.pos_y, 25*(5/6), 0, 2*Math.PI, false);
				ctx.fillStyle = '#DDDD00';
				ctx.fill();
				ctx.shadowBlur = 20;
				ctx.shadowColor = this.highlighted ? "#FFFFFF" : "#0000AA";
				ctx.strokeStyle = "#999900";
				ctx.stroke();
			} else {
				var radius = 25;
				ctx.drawImage(bolado_img, this.pos_x-radius, this.pos_y-radius,
										  radius*2.1,  		 radius*2.1);
			}

			ctx.closePath();
		}
	}

	this.KeyboardDown = function (key) {
		if (!this.active)
			return;
	}
}




