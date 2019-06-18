var camera, scene, renderer;
var level, physicsList = [];
var controls, keyboard;

init();
animate();
async function init() {
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 400;
	scene = new THREE.Scene();
	// icosahedron
//	geometry = new THREE.IcosahedronGeometry( 200, 1 );
//	material = new THREE.MeshBasicMaterial( { color: 0xffffff} );
//	mesh = new THREE.Mesh( geometry, material );
//	moveTo4D(mesh, geometry, material);
//	loadModel("model/tesseract.json").then((m)=>{
//		mesh = m
//		scene.add( mesh );
//	});
	// load a level
	level = await loadLevel("usr/lvl/00.json");
	scene.add(level[1]);
	level[1].children.forEach(c=>physicsList.push(c.children[0]));

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	// debugging / instagram stuff
//		document.body.style.webkitTransform="rotate(-90deg)";
//		scene.background = new THREE.Color( 0x282828 );
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.enableKeys = false;
	document.body.appendChild( renderer.domElement );
	//
	window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
	requestAnimationFrame( animate );
//	mesh.rotation.x += 0.005;
//	mesh.rotation.y += 0.01;
	mesh = physicsList.filter(x=>x.name=="player1")[0];
//	if(mesh !=undefined){
//		mesh.geometry.applyMatrix([
//			[Math.cos(0.05),0,0,-Math.sin(0.05)],
//			[0,1,0,0],
//			[0,0,1,0],
//			[Math.sin(0.05),0,0,Math.cos(0.05)]
//		]);
//		mesh.updateVertexColor();
//	}

	keyboardUpdate(mesh);

	// apply physics to every element in phyicslist relative to physicslist
	physicsList.forEach( e=> e.physics.update(physicsList) );

	renderer.render( scene, camera );
}

const chc = ()=>{
	count = geometry.attributes.position.count;
	for (var i=0; i<count; i++) {
		geometry.attributes.color.setXYZ( i, Math.random(), Math.random(), Math.random() );
		geometry.attributes.color.needsUpdate = true;
	}
}
