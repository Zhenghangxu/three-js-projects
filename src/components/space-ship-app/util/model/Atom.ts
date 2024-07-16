import * as THREE from 'three';
export const AtomModel = (texture:THREE.CubeTexture) => {
    const ring1 = new THREE.SphereGeometry(4, 32, 32);
    const ring2 = new THREE.TorusGeometry(8, 1, 16, 100);
    const ring3 = new THREE.TorusGeometry(12, 1, 16, 100);
    const ring4 = new THREE.TorusGeometry(11, 1, 16, 100);
    // scale ring 3 to make it look like a oval
    ring3.scale(1, 2, 1);
    ring3.rotateX(2);
    ring3.rotateY(2);
    ring3.rotateZ(1); 
    ring2.rotateX(1);
    ring4.rotateX(-0.3);
    // group all rings
    const group = new THREE.Group();
    const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        envMap: texture,
        reflectivity: 1,
        shininess: 100,
        specular: 0xffffff,
      });   
    group.add(new THREE.Mesh(ring1,material));
    group.add(new THREE.Mesh(ring2,material));
    group.add(new THREE.Mesh(ring3,material));
    group.add(new THREE.Mesh(ring4,material));
    return group;
}

