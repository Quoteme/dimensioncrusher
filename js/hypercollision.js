const tesseractCollision = (
	p1=[0,0,0,0],s1=[1,1,1,1],
	p2=[0,0,0,0],s2=[1,1,1,1]
)=>{
	// p1 & p2 := positions of the center of tesseract 1 or 2
	// s1 & s2 := axisSizes of tesseact 1 or 2 ::	[0] : x-length
	//											[1] : y-length
	//											[2] : z-length
	//											[3] : w-length
	// check if any sides intersect and then return true it is more than one
	return p1.map( (x,i)=> p2[i]-s2[i]/2<=p1[i]+s1[i]/2 && p2[i]+s2[i]/2>=p1[i]-s1[i]/2 )
		.filter( x=> x==false )
		.length==0
}

const meshSimpleCollision = (a,b)=>{
	// a & b are meshes
	// properties of mesh a
		let p = {
			"s": ['x','y','z','w'].map( n => a.geometry.axisSize(n) ),
			"m": ['x','y','z','w'].map( n => a.geometry.axisMiddle(n) ),
		}
		p.m[0] += a.position.x;
		p.m[1] += a.position.y;
		p.m[2] += a.position.z;
		p.m[3] += a.position.w || 0;
	// properties of mesh b
		let q = {
			"s": ['x','y','z','w'].map( n => b.geometry.axisSize(n) ),
			"m": ['x','y','z','w'].map( n => b.geometry.axisMiddle(n) ),
		}
		q.m[0] += b.position.x;
		q.m[1] += b.position.y;
		q.m[2] += b.position.z;
		q.m[3] += b.position.w || 0;
	return tesseractCollision(p.m,p.s,q.m,q.s);
}
