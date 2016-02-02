function PresentationTool(parent) {
	this.parent = parent;
	this.active = true;
	this.busy = true;

	this.state = PresentationState.START; 
	this.color = 255;

	this.tick  = 0;
	var dy = 0;

	this.ToggleActive = function () {
		this.active = !this.active;
	}

	this.MouseDown = function (which) {
		if (!this.active)
			return;

		if (this.state == PresentationState.START) {
			// START ANIMATION
			this.state = PresentationState.ANIMATION;
			this.parent.ToggleHidden();
			StartAnimation();
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
		ctx.beginPath();
		ctx.save();
		ctx.textAlign = "center"; 
		ctx.shadowBlur = 10;
		
		if (this.state == PresentationState.START) {
			var color = Math.floor(50*Math.cos(this.tick/50)) + 205;
			this.parent.SetPosition(canvas.width/2 - 180, canvas.height/4);
			
			ctx.textAlign="center"; 
			ctx.fillStyle = "rgb(" + color + "," + color + "," + color + ")";
			ctx.shadowColor = "rgb(255, 0, 0)";

			ctx.font = "bold 40px Courier New";
			ctx.fillText("Webphysics Playground", canvas.width/2, canvas.height/8 );
			ctx.font = "bold 20px Courier New";
			ctx.fillText("Click to start!", canvas.width/2, canvas.height/2);

		} else if (this.state == PresentationState.ANIMATION) {
			ctx.fillStyle = "rgb(" + this.color + "," + this.color + "," + this.color + ")";
			ctx.font = "bold 40px Courier New";
			ctx.shadowColor = "rgb(" + this.color + ", 0, 0)";
			ctx.fillText("Webphysics Playground", canvas.width/2, canvas.height/8 - dy);	
		}


		ctx.restore();
		ctx.closePath();
		this.tick++;
	}

	this.KeyboardDown = function (which) {
		if (!this.active)
			return;

	}

	function StartAnimation() {
		setTimeout(MenuMove, 1);
	}

	function MenuMove() {
		if (selection_tool.xo > 1 && selection_tool.yo > 1) {
			selection_tool.xo -= selection_tool.xo/50;
			selection_tool.yo -= selection_tool.yo/50;
			dy += 3;
			setTimeout(MenuMove, 10);

		} else {
			selection_tool.xo = 0;
			selection_tool.yo = 0;
			selection_tool.EndPresentation();
		}	
	}

}

var PresentationState = {
	START:  	0,
	ANIMATION: 	1,
	DONE:   	2,
}





