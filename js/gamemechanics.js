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
			obj.name = keys[i];
			hyperphysics.addPhysics(obj,data.attributes.mass,data.attributes.fixed)
			grp.add( obj );
		}
	}
	return grp;
}

async function buildOBJ (data){
	let out;
	if( data.geometry.type == "basic" ){
		out = await loadModel(data.geometry.url)
		out.geometry.chngSize(...data.geometry.arg);
		out.setPosition(...data.attributes.position);
	}
	return out;
}
