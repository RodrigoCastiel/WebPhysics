function EditModeTool(parent) {
	this.parent = parent;
	this.active = false;
	this.busy = false;
	this.obj  = null;  // Selected object.

	this.ToggleActive = function () {
		this.active = !this.active;

		if (this.active) {
			this.parent.SetMessage("Hold mouse left button to move a" + 
								   "sphere!");
		}
	}

	this.MouseDown = function (which) {
		if (!this.active)
			return;

		if (which == Mouse.LFT) {
			if (!this.busy) {
				this.obj = system.GetObjectMouse(mouse.x, mouse.y);
				if (this.obj != null) {
					this.obj.SetController(mouse);
					this.busy = true;
				}
			}
		}
	}

	this.MouseMove = function (which) {
		if (!this.active)
			return;

		if (this.busy && this.obj != null) {  // Currently editing an object.
			this.obj.SetPosition(mouse.x, mouse.y);
		}
	}

	this.MouseUp = function (which) {
		if (!this.active)
			return;

		if (this.busy) {
			this.obj.SetController(null);
			this.busy = false;
			this.obj = null;
		}
	}

	this.Draw = function (canvas) {
		if (!this.active)
			return;
	}

	this.KeyboardDown = function (which) {
		if (!this.active)
			return;

	}

}