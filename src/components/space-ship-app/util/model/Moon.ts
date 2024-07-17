import * as THREE from 'three';
import MoonColor from "../../../../asset/moon/moon_baseColor.jpeg";
import MoonNormal from "../../../../asset/moon/moon_normal.jpeg";
import MoonMetalRoughness from "../../../../asset/moon/moon_metallicRoughness.png";
import { loadTexture } from '../texture/loadTexture';

export const Moon = async (): Promise<THREE.Mesh> => {
    const moon = new THREE.SphereGeometry(25, 64, 64);
    const moonColor = await loadTexture(MoonColor);
    const moon_normal = await loadTexture(MoonNormal);
    const moon_metalRoughness = await loadTexture(MoonMetalRoughness);
    const material = new THREE.MeshStandardMaterial({
        map: moonColor,
        normalMap: moon_normal,
        normalScale: new THREE.Vector2(0.4, 0.4),
        roughnessMap: moon_metalRoughness,
        roughness: 0.9,
        metalness: 0
    });
    const mesh = new THREE.Mesh(moon, material);
    mesh.castShadow = true;
    return mesh;
}