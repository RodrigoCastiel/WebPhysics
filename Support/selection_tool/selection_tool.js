function SelectionTool() {
	this.edit_mode_tool    = new EditModeTool(this);
	this.area_edit_tool    = null;
	this.add_particle_tool = new AddParticleTool(this);
	this.connector_tool    = new ConnectorTool(this);
	this.mesh1d_tool       = new Mesh1dTool(this);
	this.mesh2d_tool       = new Mesh2dTool(this);

	this.presentation_tool = new PresentationTool(this);

	this.current_tool = this.presentation_tool;
	this.selection_mode = SelectionMode.PRESENTATION;
	this.modes = ["1. Edit Mode", "2. Area Edit Mode", "3. Add Particle", 
				  "4. Add Connector", "5. Mesh - 1D", "6. Mesh - 2D"];
	this.hidden = true;

	this.xo = 0;
	this.yo = 0;
	this.message = "";
//		"Press a numerical key to change to the desired mode. Press H to show/hide this menu.";

	this.SetSelectionMode = function(selection_mode) {
		if (!this.current_tool.busy) {
			this.current_tool.ToggleActive();
			this.selection_mode = selection_mode;
			switch (selection_mode) {
				case SelectionMode.EDIT_OBJ:
					this.current_tool = this.edit_mode_tool;
					break;
				case SelectionMode.AREA_EDIT:
					this.current_tool = this.area_edit_tool;
					break;
				case SelectionMode.ADD_PARTICLE:
					this.current_tool = this.add_particle_tool;
					break;
				case SelectionMode.ADD_CONNECTOR:
					this.current_tool = this.connector_tool;
					break;
				case SelectionMode.MESH_1D:
					this.current_tool = this.mesh1d_tool;
					break;
				case SelectionMode.MESH_2D:
					this.current_tool = this.mesh2d_tool;
					break;
			}
			this.ClearMessage();
			this.current_tool.ToggleActive();
		}
	}

	this.ToggleHidden = function() {
		this.hidden = !this.hidden;
	}

	this.MouseDown = function(which) {
		this.current_tool.MouseDown(which);
	}

	this.MouseUp = function(which) {
		this.current_tool.MouseUp(which);
	}

	this.MouseMove = function(which) {
		this.current_tool.MouseMove(which);
	}

	this.Draw = function(canvas) {
		var ctx = canvas.getContext('2d');
		this.current_tool.Draw(canvas);

		if (!this.hidden) {
			ctx.beginPath();
			for (i = 0; i < this.modes.length; i++) {
				if (i != this.selection_mode) {
					ctx.fillStyle = "rgba(100, 100, 100, 10)";			
					ctx.font = "bold 14px Courier New";
					ctx.shadowBlur = 10;
					ctx.shadowColor = '#AA0000';
					ctx.fillText(this.modes[i], this.xo + canvas.width/30, 
								      	        this.yo + canvas.height/20 + i*20);
				} else {
					ctx.fillStyle = "rgba(255, 255, 255, 255)";			
					ctx.font = "bold 16px Courier New";
					ctx.shadowBlur = 10;
					ctx.shadowColor = '#FF0000';
					ctx.fillText(this.modes[i], this.xo + canvas.width/30 + 5, 
										        this.yo + canvas.height/20 + i*20);
				}
				
			}

			var line_length = 232;
			ctx.lineWidth = 2;
			ctx.shadowBlur = 10;
			ctx.shadowColor = '#FF0000';
			ctx.strokeStyle = '#FFFFFF';
			ctx.moveTo(this.xo + canvas.width/30,       		this.yo + canvas.height/20 - 20);
			ctx.lineTo(this.xo + canvas.width/30 + line_length, this.yo + canvas.height/20 - 20);
			ctx.moveTo(this.xo + canvas.width/30,   		    this.yo + canvas.height/20 + i*20);
			ctx.lineTo(this.xo + canvas.width/30 + line_length, this.yo + canvas.height/20 + i*20);
		
			this.DrawMessage(ctx);

			ctx.moveTo(this.xo + canvas.width/30,   		    this.yo + canvas.height/20 + (i+5)*20);
			ctx.lineTo(this.xo + canvas.width/30 + line_length, this.yo + canvas.height/20 + (i+5)*20);
			ctx.stroke();

			ctx.closePath();
		}
	}

	this.DrawMessage = function(ctx) {
		var L = 32;
		ctx.fillStyle = "#DDDDDD";			
		ctx.font = "bold 12px Courier New";
		ctx.shadowBlur = 10;
		ctx.shadowColor = '#FF0000';

		var lines = Math.floor(this.message.length/L)+1;
		for (var i = 0; i < lines; i++) {
			ctx.fillText(this.message.substring(i*L, (i+1)*L),  
						 this.xo + canvas.width/30, 
						 this.yo + canvas.height/20 + (this.modes.length+i+1)*20);
		}
	}

	this.ShowMessage = function (message, duration) {
		this.message = message;
		//setTimeout(this.ClearMessage, duration);
	}

	this.ClearMessage = function (message) {
		this.message = "";
	}

	this.SetMessage = function(message, time) {
		this.ShowMessage(message, time);
	}

	this.SetPosition = function(x, y) {
		this.xo = x;
		this.yo = y;
	}

	this.EndPresentation = function () {
		this.current_tool.busy = false;
		this.SetSelectionMode(SelectionMode.ADD_PARTICLE);
	}

	this.KeyboardDown = function(event) {
		//console.log(event.keyCode);
		this.current_tool.KeyboardDown(event.keyCode);

		switch (event.keyCode) {
			case Keys.KEY_h:
			case Keys.KEY_H:
				this.ToggleHidden();
				break;
			case Keys.KEY_1: 
				this.SetSelectionMode(SelectionMode.EDIT_OBJ);
				break;
			// case Keys.KEY_2:
			// 	this.SetSelectionMode(SelectionMode.AREA_EDIT);
			// 	break;
			case Keys.KEY_3:
				this.SetSelectionMode(SelectionMode.ADD_PARTICLE);
				break;
			case Keys.KEY_4:
				this.SetSelectionMode(SelectionMode.ADD_CONNECTOR);
				break;
			case Keys.KEY_5:
				this.SetSelectionMode(SelectionMode.MESH_1D);
				break;
			case Keys.KEY_6:
				this.SetSelectionMode(SelectionMode.MESH_2D);
				break;
			default:
				break;
		}
	}

}

var Mouse = {LFT: 1, RGT: 3};

var EndType = {
	PARTICLE : 0,
	ATTACHED : 1,
	FREE     : 2,
};

var ConnectorType = {
	ROPE   : 0,
	SPRING : 1,
	DAMPER : 2,
};

var SelectionMode = {
	PRESENTATION    : -1, // Opening.
	EDIT_OBJ 		: 0,  // Change/Move/Remove obj.
	AREA_EDIT 		: 1,  // Select multiples items over an area.
	ADD_PARTICLE 	: 2,  // Add particle.
	ADD_CONNECTOR 	: 3,  // Add conector (spring, rope, ...).
	MESH_1D         : 4,  // String.
	MESH_2D         : 5,  // Mesh 2d.
};
