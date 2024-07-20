import * as THREE from 'three';
import Jupiter from "../../../../asset/jupiter/Planeta_baseColor.jpg";
import JupiterNormal from "../../../../asset/jupiter/Planeta_normal.jpg";
import { loadTexture } from '../texture/loadTexture';

export const JupiterPlanet = async ({
    Px = 0,
    Py = 0,
    Pz = 0,
}): Promise<THREE.Mesh> => {
    const planet = new THREE.SphereGeometry(25, 64, 64);
    const planetColor = await loadTexture(Jupiter);
    const planet_normal = await loadTexture(JupiterNormal);
    const material = new THREE.MeshStandardMaterial({
        map: planetColor,
        normalMap: planet_normal ,
        normalScale: new THREE.Vector2(0.6, 0.6),
        roughness: 0.9,
        metalness: 0
    });
    const mesh = new THREE.Mesh(planet, material);
    mesh.position.set(Px, Py, Pz);
    return mesh;
}