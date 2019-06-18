async function loadLevel (URL){
	let json = await fetch(URL)
					.then( x => x.json() )
	return [json,await buildLevel(json)];

}

async function buildLevel (json){
	let grp = new THREE.Group();
	let keys = Object.keys(json.obj);
	for( var i=0; i<keys.length; i++){
		let data = json.obj[keys[i]];
		if(data.geometry!=undefined){
			let obj = await buildOBJ(data)
			obj.name = obj.children[0].name = keys[i];
			hyperphysics.addPhysics(obj.children[0],data.attributes.mass,data.attributes.fixed)
			grp.add( obj );
		}
	}
	return grp;
}

async function buildOBJ (data){
	let grp = new THREE.Group();
	let mesh, light;
	if( data.geometry.type == "basic" ){
		mesh = await loadModel(data.geometry.url)
		mesh.material.color = new THREE.Color(data.material.color)
		mesh.geometry.chngSize(...data.geometry.arg);
		mesh.setPosition(...data.attributes.position);
		grp.add( mesh );
	}
	if (data.attributes.light == true) {
		light = new THREE.PointLight(
			data.attributes.lightColor,
			data.attributes.intensity,
			data.attributes.distance
		)
		light.position.set(...data.attributes.position.splice(0,3));
		grp.add( light );
		let plh = new THREE.PointLightHelper( light, 20 );
		grp.add(plh);
	}
	return grp;
}
