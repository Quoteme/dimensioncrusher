hyperphysics = new (function(){
	// returns the difference in position between
	this.posDifference = (p,q) => Object.keys(p.position).map( n=> q.position[n]-p.position[n] );
	this.direction = (p,q) => {
		let d = this.distance(p,q);
		let pd = this.posDifference(p,q);
		return pd.map( n => n/d )
	};
	this.distance = (p,q) => Math.hypot( ...this.posDifference(p,q) );
	this.G = 1000, // universal gravitation constant
	this.gravity = (m1,m2,distance)=>(this.G * m1*m2)/(distance**2);
	this.pairwiseGravity = ( objs, masses ) => {
		// objs := THREE.Object3D
		// masses := the mass of each x in objs
		// iterate pairwise though all objects
		for (var i=0; i<objs.length-1; i++) {
			for (var j=i+1; j<objs.length; j++) {
				// let p,q be a pair of objects
					let p = objs[i];
					let q = objs[j];
				// let d be their distance relative to each other
					let d = this.distance(p,q);
				// let f be the gravitational force between them
					let f = this.gravity(masses[i],masses[j],d);
				//
				// add the force to p and q
					let pd = this.posDifference(p,q);
			}
		}
	};
	// updates physics of every element in l
	this.update = (l)=>l.forEach(e=>e.physics.update(l));
	//
	this.addPhysics = (e, mass=1, fixed=false)=>{
		// adds physics to mesh e
		e.physics = new (function(){
			// constants
				this.fixed = fixed;
				this.velocity = new THREE.Vector4(0,0,0,0);
				this.mass = mass;
			// functions
				this.posUpdate = ()=> Object.keys(e.position).forEach( n=> e.position[n] += this.velocity[n] );
				this.update = (m)=>{
					if(this.fixed)
						return;
					e.physics.posUpdate(m);
					e.physics.groupGravity(m);
					e.physics.groupCollisionStop(m);
					e.updateVertexColor();
				}
			// detect e - mesh collision
				this.collision = (p)=> p.uuid!=e.uuid?meshSimpleCollision(e,p):false;
			// detect ei - group of mesh collision
				this.groupCollision = (m)=>m.map( p=>e.physics.collision(p) );
			// stop e on collision with mesh collecion
				this.groupCollisionStop = (m)=>{
					let collisionCount = e.physics.groupCollision(m)
						.filter( x=>x==true)
						.length;
					if( collisionCount > 0)
						e.physics.velocity = new THREE.Vector4(0,0,0,0);
				}
			// gravitation
				this.gravity = (p) =>{
					// do not perform gravity on an element itself
						if(e == p)
							return;
					// calculate distance between e and p
						let d = hyperphysics.distance(e,p);
					// stop calculation if distance is too small
						if(d <= 2)
							return;
					// calculate the gravitation force between e and p
						let f = hyperphysics.gravity(e.physics.mass, p.physics.mass, d);
					// calculate acceleration
						let a = f/e.physics.mass;
					// calculate the direction the gravitational force drags e
						let dir = hyperphysics.direction(e,p);
					// add the directional acceleration to the velocity of e
						Object.keys(e.physics.velocity).forEach( (k,i)=>{
							e.physics.velocity[k] += dir[i]*a;
						})
				}
				this.groupGravity = (m)=> m.forEach( p=>this.gravity(p) );
		})();
	}
})();
