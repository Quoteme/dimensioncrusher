var camera, scene, renderer;
var mesh, geometry, material;
init();
animate();
function init() {
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 400;
	scene = new THREE.Scene();
	// icosahedron
	geometry = new THREE.IcosahedronBufferGeometry( 200, 1 );
	material = new THREE.MeshBasicMaterial( { color: 0xffffff} );
	moveTo4D(geometry, material);
	mesh = new THREE.Mesh( geometry, material );
	meshBindingsFor4D( mesh );
	scene.add( mesh );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
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
	mesh.rotation.x += 0.005;
	mesh.rotation.y += 0.01;

geometry.applyMatrix([
	[Math.cos(0.005),0,0,-Math.sin(0.005)],
	[0,1,0,0],
	[0,0,1,0],
	[Math.sin(0.005),0,0,Math.cos(0.005)]
]);
mesh.updateVertexColor()

	renderer.render( scene, camera );
}

const chc = ()=>{
	count = geometry.attributes.position.count;
	for (var i=0; i<count; i++) {
		geometry.attributes.color.setXYZ( i, Math.random(), Math.random(), Math.random() );
		geometry.attributes.color.needsUpdate = true;
	}
}
