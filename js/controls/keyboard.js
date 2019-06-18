const keyboardinit = () => {
	keyboard = new THREEx.KeyboardState();
}

const keyboardUpdate = (e)=>{
	// X
		if (keyboard.pressed("a")) {
			e.physics.velocity.x = -1;
		}
		if (keyboard.pressed("d")) {
			e.physics.velocity.x = 1;
		}
	// Y
		if (keyboard.pressed("up")) {
			e.physics.velocity.y = 1;
		}
		if (keyboard.pressed("down")) {
			e.physics.velocity.y = -1;
		}
	// Z
		if (keyboard.pressed("w")) {
			e.physics.velocity.z = -1;
		}
		if (keyboard.pressed("s")) {
			e.physics.velocity.z = 1;
		}
	// W
		if (keyboard.pressed("left")) {
			e.physics.velocity.w = 1;
		}
		if (keyboard.pressed("right")) {
			e.physics.velocity.w = -1;
		}
}

keyboardinit();
