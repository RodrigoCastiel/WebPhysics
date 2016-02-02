canvas.addEventListener('mousedown', 	onMouseDown, false);
canvas.addEventListener('mouseup',   	onMouseUp,   false);
canvas.addEventListener('mousemove', 	onMouseMove, false);
canvas.addEventListener('contextmenu', function(e) {
	if (e.button == 2) {
		e.preventDefault();
		return false;
	}
}, false);

var mouse = {
	x: 0,
	y: 0,
	dx: 0,
	dy: 0,
	mode: 0,
	has_particle: false,
	has_rope: false,
	under_particle: -1,
	rope: -1
};

var MouseClick = {
	LFT : 1,
	RGT : 3
};

function MouseInteraction() {
	var info = system.NearestParticle(mouse.x, mouse.y);

	if (info) {
		if (mouse.has_particle) {
			var p = mouse.under_particle;
			var np = system.particles[info.index];
			var curr_dist = MathDist(mouse.x, mouse.y, p.x, p.y);
			//mouse.under_particle.Draw(canvas);
			
			// There is no particles anymore.
			if ((np == p) && (curr_dist > 3*p.radius)) {
				mouse.under_particle.highlighted = false;
				mouse.has_particle = false;
				mouse.under_particle = -1;
			} else if ((np != p) && (info.dist < curr_dist)) { // There is another nearest particle.
				mouse.under_particle.highlighted = false;
				system.particles[info.index].highlighted = true;
				mouse.under_particle = system.particles[info.index];
				mouse.has_particle = true;
				//mouse.under_particle.Draw(canvas);			
			}
			
		} else {
			if (info.index >= 0) { // There is valid particle.
				if (info.dist < system.particles[info.index].radius*3) {  // Inside the area.
					if (system.particles[info.index] != mouse.under_particle) {
						system.particles[info.index].highlighted = true;
						mouse.under_particle = system.particles[info.index];
						mouse.has_particle = true;
						//mouse.under_particle.Draw(canvas);
					}
				}
			}	
		}
	}
}

function onMouseMove(event) {
	canvas = document.getElementById("canvas");
	var rect = canvas.getBoundingClientRect();
	var px = mouse.x;
	var py = mouse.y;
	mouse.x = event.clientX - rect.left;
	mouse.y = event.clientY - rect.top;
	mouse.dx = (mouse.x - px)/4;
	mouse.dy = (mouse.y - py)/4;
	selection_tool.MouseMove(event.which);
}

function onMouseDown(event) {
	selection_tool.MouseDown(event.which);
}

function onMouseUp(event) {
	selection_tool.MouseUp(event.which);
}

var prev_x = mouse.x, prev_y = mouse.y;

function UpdateMouseSpeed() {
	// var new_x = mouse.x, new_y = mouse.y;

	// mouse.dx = (new_x - prev_x);
	// mouse.dy = (new_x - prev_y);

	// console.log(prev_x + ", " + prev_y);
	// console.log(new_x + ", " + new_y);
	// console.log(mouse.dx + ", " + mouse.dy);
	// console.log("---------------------");
	// prev_x = new_x;
	// prev_y = new_y;
}



