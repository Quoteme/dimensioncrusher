const tesseractCollision = (
	p1=[0,0,0,0],s1=[1,1,1,1],
	p2=[0,0,0,0],s2=[1,1,1,1]
)=>{
	// p1 & p2 := positions of the center of tesseract 1 or 2
	// s1 & s2 := sizes of tesseact 1 or 2 ::	[0] : x-length
	//											[1] : y-length
	//											[2] : z-length
	//											[3] : w-length
	// check if any sides intersect and then return true it is more than one
	return p1.map( (x,i)=> p2[i]-s2[i]<=p1[i]+s1[i] && p2[i]+s2[i]>=p1[i]-s1[i] )
		.filter( x=> x==true )
		.length>1
}

const meshSimpleCollision = (a,b)=>{
	// a & b are meshes
	// properties of mesh a
		let p = {
			"s": [0,0,0,0].map( (x,i)=> a.geometry.size(i) ),
			"m": [0,0,0,0].map( (x,i)=> a.middle.size(i) ),
		}
		p.m[0]= a.position.x;
		p.m[1]= a.position.y;
		p.m[2]= a.position.z;
		p.m[3]= a.position.w || 0;
	// properties of mesh b
		let q = {
			"s": [0,0,0,0].map( (x,i)=> b.geometry.size(i) ),
			"m": [0,0,0,0].map( (x,i)=> b.middle.size(i) ),
		}
		q.m[0]= b.position.x;
		q.m[1]= b.position.y;
		q.m[2]= b.position.z;
		q.m[3]= b.position.w || 0;
	return tesseractCollision(p.m,p.s,q.m,q.s);
}
