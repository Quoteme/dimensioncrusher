//const moveTo4D = ( geo, mat, pos=(i,x,y,z)=>0 )=>{
//	// geometry changes
//		// attributes
//			count = geo.attributes.position.count;
//			geo.addAttribute( 'omega', new THREE.BufferAttribute( new Float32Array( count*1 ), 1));
//			geo.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array( count*3 ), 3));
//			for (var i=0; i<count; i++) {
//				geo.attributes.omega.array[i]=pos(
//					i,
//					geo.attributes.position[i+0],
//					geo.attributes.position[i+1],
//					geo.attributes.position[i+2],
//				);
//				geo.attributes.color.setXYZ( i, 1, 1, 1 );
//			}
//		// methods
//			geo.applyMatrix = (mat=[
//				[1,0,0,0],
//				[0,1,0,0],
//				[0,0,1,0],
//				[0,0,0,1],
//			])=>{
//				for (var i=0; i<geo.attributes.position.count; i++) {
//					let x = geo.attributes.position.array[i*3+0];
//					let y = geo.attributes.position.array[i*3+1];
//					let z = geo.attributes.position.array[i*3+2];
//					let w = geo.attributes.omega.array[i];
//					let np = math.multiply(mat, [x,y,z,w]);
//					geo.attributes.position.array[i*3+0] = np[0];
//					geo.attributes.position.array[i*3+1] = np[1];
//					geo.attributes.position.array[i*3+2] = np[2];
//					geo.attributes.omega.array[i]				 = np[3];
//					geometry.attributes.position.needsUpdate	= true;
//					geometry.attributes.omega.needsUpdate		= true;
//				}
//			}
//			geo.updateVertexColor = (base=0, arr=(i)=>geo.attributes.omega.array[i], r=10) => {
//				let c = new THREE.Color();
//				for (var i=0; i<geo.attributes.position.count; i++) {
//					c.setHSL(
//						(arr(i)+base)/r,
//						1.0,
//						(1/((arr(i)+base)**2+1)+1)/2
//					);
//					geo.attributes.color.setXYZ( i, c.r, c.g, c.b );
//				}
//				geo.attributes.color.needsUpdate = true;
//			}
//			geo.size = (axis=0)=> {
//				let pos = geo.valuesOnAxis(axis)
//				return Math.max(...pos)-Math.min(...pos);
//			}
//			geo.middle = (axis=0)=> geo.valuesOnAxis(axis).reduce( (x,y)=>x+y ) / geo.attributes.omega.count;
//			geo.valuesOnAxis = (axis=0)=> new Array(geo.attributes.omega.count)
//									.fill(0)
//									.map( (x,i)=> axis<3? geo.attributes.position.array[3*i+axis] : geo.attributes.omega.array[i]);
////	geo.getVertexPositions = ()=>{
////		let count = geo.attributes.omega.count;
////		let pos = new Array( count ).fill(0)
////					.map( (x,i)=>{
////						let p = [];
////						p[0]= geo.attributes.position.array[3*i],
////						p[1]= geo.attributes.position.array[3*i+1],
////						p[2]= geo.attributes.position.array[3*i+2],
////						p[3]= geo.attributes.omega.array[i];
////						return p;
////					})
////		return pos;
////	}
//	// material changes
//		mat.vertexColors = THREE.VertexColors;
//}

const moveTo4D = (mesh, geo, mat, pos=(i)=>0)=>{
	// INIT
		geo.omega = new Array(geo.vertices.length)
			.fill(0)
			.map( (x,i) => pos(i) )
		geo.faces.forEach( f=>{
			f.vertexColors[0] = new THREE.Color(0xffffff);
			f.vertexColors[1] = new THREE.Color(0xffffff);
			f.vertexColors[2] = new THREE.Color(0xffffff);
		})
	// FUNCTIONS
	geo.applyMatrix = (mat=[
		[1,0,0,0],
		[0,1,0,0],
		[0,0,1,0],
		[0,0,0,1],
	])=>{
		geo.vertices.forEach( (v,i)=>{
			let newPos = math.multiply(mat,
				[
					v.x, v.y, v.z,
					geo.omega[i]
				]
			)
			geo.omega[i] = newPos[3];
			geo.verticesNeedUpdate = true;
			v.x = newPos[0];
			v.y = newPos[1];
			v.z = newPos[2];
		})
	}
	geo.updateVertexColor = (
		// variable that allows for more easy change of the following function
			base=0,
		// color calculation function
			fun=(x,y,z,w) => [ (base+w)/20, 1, 1-Math.abs(Math.tanh(x))/2] // H,S,L
	)=> geo.faces.forEach( f=>{
		// calculate the colors for each vertex in each face
			f.vertexColors[0].setHSL(...fun(
				geo.vertices[f.a].x,
				geo.vertices[f.a].y,
				geo.vertices[f.a].z,
				geo.omega[f.a]
			));
			f.vertexColors[1].setHSL(...fun(
				geo.vertices[f.b].x,
				geo.vertices[f.b].y,
				geo.vertices[f.b].z,
				geo.omega[f.b]
			));
			f.vertexColors[2].setHSL(...fun(
				geo.vertices[f.c].x,
				geo.vertices[f.c].y,
				geo.vertices[f.c].z,
				geo.omega[f.c]
			));
		// send request to update vertex colors to three.js
			geo.colorsNeedUpdate = true;
	})

	// calculate the middle of the geometry on axis an axis
		geo.axisMiddle = (axis='x')=>['x','y','z'].indexOf(axis)!=-1?
			geo.vertices.map( v=>v[axis] ).reduce( (x,y)=>x+y )/geo.vertices.length:
			geo.omega.reduce( (x,y)=>x+y )/geo.omega.length;

	// calculate the highest and lowest point on an axis of the geometry
		geo.range = (axis='x')=>{
			if( ['x','y','z'].indexOf(axis)!=-1 ){
				let p = geo.vertices.map( v=>v[axis] );
				return [Math.min(...p),			Math.max(...p)];
			}else{
				return [Math.min(...geo.omega),	Math.max(...geo.omega)];
			}
		}

	// calculate the size of the geometry on an axis
		geo.axisSize = (axis='x')=> geo.range(axis).reduce( (x,y)=> Math.abs(x)+Math.abs(y) );

	geo.chngSize = (x,y,z,w)=>{
		geo.vertices.forEach( v=>{
			v.x = v.x*x;
			v.y = v.y*y;
			v.z = v.z*z;
		});
		geo.omega.map( i=> i*w);
	}

	mat.vertexColors = THREE.VertexColors;
	mesh.position.w = 0;
	mesh.setPosition = (x,y,z,w)=>{
		mesh.position.x = x!=undefined?x:mesh.position.x;
		mesh.position.y = y!=undefined?y:mesh.position.y;
		mesh.position.z = z!=undefined?z:mesh.position.z;
		mesh.position.w = w!=undefined?w:mesh.position.w;
		mesh.updateVertexColor();
	}
	mesh.updateVertexColor = ()=> geo.updateVertexColor(mesh.position.w);
	mesh.axisMiddle = (axis)=> geo.axisMiddle(axis)+mesh.position[axis];
	mesh.axisSize = (axis)=> geo.axisSize(axis);
}

async function loadModel (URL){
	let json = await fetch(URL).then( x => x.json() )
	return buildMeshFromJSON(json);
}

const buildMeshFromJSON =(json)=>{
	let m = new THREE.MeshBasicMaterial( { color: json.mate.color, side: THREE.DoubleSide,} );
	let g = new THREE.Geometry();
	json.vert.forEach( v=> g.vertices.push( new THREE.Vector3( v[0],v[1],v[2] ) ) );
	json.face.forEach( f=> g.faces.push( new THREE.Face3( f[0],f[1],f[2] ) ) )

	let mesh = new THREE.Mesh( g,m );

	moveTo4D(mesh, g ,m, (i)=>json.vert[i][3] );

	//meshBindingsFor4D(mesh);

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
