// Keyboard.

var Keys = {
	KEY_1: 49, KEY_2: 50,  KEY_3: 51, KEY_4: 52, KEY_5: 53,
	KEY_6: 54, KEY_7: 55,  KEY_8: 56, KEY_9: 57, KEY_0: 48,
	KEY_H: 72, KEY_h: 104, KEY_C: 67, KEY_c: 99, 
	KEY_B: 66, KEY_b: 98,
	KEY_SPACE: 32,
	};

window.addEventListener('keypress',  onKeyboardDown, false);

function onKeyboardDown(event) {
	if (event.keyCode == Keys.KEY_SPACE) {  // Pause.
		if (!selection_tool.presentation_tool.busy)
			paused = !paused;
	} else if (event.keyCode == Keys.KEY_B || event.keyCode == Keys.KEY_b) {
		bolado_mode = !bolado_mode;
	} else if (event.keyCode == 71 || event.keyCode == 103) {  // G
		g.on = !g.on;
	} else if (event.keyCode == 43 || event.keyCode == 61) { // +/=
		if (mouse.has_particle && !mouse.has_spring) {
			mouse.under_particle.IncMass();
		} 
	} else if (event.keyCode == 45) { // -
		if (mouse.has_particle && !mouse.has_spring) {
			mouse.under_particle.DecMass();
		} 
	} 

	selection_tool.KeyboardDown(event);
}

bolado_img = new Image();
bolado_img.src = "Images/bolado.png";