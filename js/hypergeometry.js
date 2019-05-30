const moveTo4D = ( geo, mat, pos=(i,x,y,z)=>0 )=>{
	// geometry changes
		// attributes
			count = geo.attributes.position.count;
			geo.addAttribute( 'omega', new THREE.BufferAttribute( new Float32Array( count*1 ), 1));
			geo.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array( count*3 ), 3));
			for (var i=0; i<count; i++) {
				geo.attributes.omega.array[i]=pos(
					i,
					geo.attributes.position[i+0],
					geo.attributes.position[i+1],
					geo.attributes.position[i+2],
				);
				geo.attributes.color.setXYZ( i, 1, 1, 1 );
			}
		// methods
			geo.applyMatrix = (mat=[
				[1,0,0,0],
				[0,1,0,0],
				[0,0,1,0],
				[0,0,0,1],
			])=>{
				for (var i=0; i<geo.attributes.position.count; i++) {
					let x = geo.attributes.position.array[i*3+0];
					let y = geo.attributes.position.array[i*3+1];
					let z = geo.attributes.position.array[i*3+2];
					let w = geo.attributes.omega.array[i];
					let np = math.multiply(mat, [x,y,z,w]);
					geo.attributes.position.array[i*3+0] = np[0];
					geo.attributes.position.array[i*3+1] = np[1];
					geo.attributes.position.array[i*3+2] = np[2];
					geo.attributes.omega.array[i]				 = np[3];
					geometry.attributes.position.needsUpdate	= true;
					geometry.attributes.omega.needsUpdate		= true;
				}
			}
	geo.updateVertexColor = (base=0, arr=(i)=>geo.attributes.omega.array[i], r=10) => {
		let c = new THREE.Color();
		for (var i=0; i<geo.attributes.position.count; i++) {
			c.setHSL(
				(arr(i)+base)/r,
				1.0,
				(1/((arr(i)+base)**2+1)+1)/2
			);
			geo.attributes.color.setXYZ( i, c.r, c.g, c.b );
		}
		geo.attributes.color.needsUpdate = true;
	}
	geo.size = (axis=0)=> {
		let pos = geo.valuesOnAxis(axis)
		return Math.max(...pos)-Math.min(...pos);
	}
	geo.middle = (axis=0)=> geo.valuesOnAxis(axis).reduce( (x,y)=>x+y ) / geo.attributes.omega.count;
	geo.valuesOnAxis = (axis=0)=> new Array(geo.attributes.omega.count)
									.fill(0)
									.map( (x,i)=> axis<3? geo.attributes.position.array[3*i+axis] : geo.attributes.omega.array[i]);
//	geo.getVertexPositions = ()=>{
//		let count = geo.attributes.omega.count;
//		let pos = new Array( count ).fill(0)
//					.map( (x,i)=>{
//						let p = [];
//						p[0]= geo.attributes.position.array[3*i],
//						p[1]= geo.attributes.position.array[3*i+1],
//						p[2]= geo.attributes.position.array[3*i+2],
//						p[3]= geo.attributes.omega.array[i];
//						return p;
//					})
//		return pos;
//	}
	// material changes
		mat.vertexColors = THREE.VertexColors;
}

function meshBindingsFor4D (mesh){
	mesh.position.w = 0;
	mesh.updateVertexColor = ()=> mesh.geometry.updateVertexColor(mesh.position.w);
}

const loadModel = (URL, callback=(x)=>console.log(x))=>{
	fetch(URL)
	.then( x => x.json() )
	.then( x => callback( buildMeshFromJSON(x) ) );
}

const buildMeshFromJSON =(json)=>{
	let m = new THREE.MeshBasicMaterial( { color: json.mate.color} );
	let g = new THREE.Geometry();
	json.vert.forEach( v=> g.vertices.push( new THREE.Vector3( v[0],v[1],v[2] ) ) );
	json.face.forEach( f=> g.faces.push( new THREE.Face3( f[0],f[1],f[2] ) ) )

	let gb = new THREE.BufferGeometry().fromGeometry( g );

	moveTo4D(gb,m, (i)=>json.vert[i][3] );

	let mesh = new THREE.Mesh( gb,m );

	meshBindingsFor4D(mesh);

	return mesh;
}

// EXAMPLES:
//	geometry.applyMatrix([
//		[Math.cos(0.05),0,0,-Math.sin(0.05)],
//		[0,1,0,0],
//		[0,0,1,0],
//		[Math.sin(0.05),0,0,Math.cos(0.05)]
//	]);
//	meshBindingsFor4D( mesh );
