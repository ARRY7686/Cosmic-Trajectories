import * as THREE from "three";
import { getFresnelMat } from "../../utils/getFresnelMat.js";

export function createEarth(loader) {
  const detail = 12;
  const geometry = new THREE.IcosahedronGeometry(1, detail);

  // Earth mesh
  const material = new THREE.MeshPhongMaterial({
    map: loader.load("../../assets/textures/earth/earthmap1k.png"),
    specularMap: loader.load("../../assets/textures/earth/earthspec1k.png"),
    bumpMap: loader.load("../../assets/textures/earth/earthbump1k.png"),
    bumpScale: 0.04,
  });
  const earthMesh = new THREE.Mesh(geometry, material);
  const earthGroup = new THREE.Group();
  earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
  earthGroup.add(earthMesh);

  // Lights layer
  const lightsMat = new THREE.MeshBasicMaterial({
    map: loader.load("../../assets/textures/earth/earthlights1k.png"),
    blending: THREE.AdditiveBlending,
  });
  const lightsMesh = new THREE.Mesh(geometry, lightsMat);
  earthGroup.add(lightsMesh);

  // Clouds layer
  const cloudsMat = new THREE.MeshStandardMaterial({
    map: loader.load("../../assets/textures/earth/earthcloudmap.png"),
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    alphaMap: loader.load("../../assets/textures/earth/earthcloudmaptrans.png"),
  });
  const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
  cloudsMesh.scale.setScalar(1.003);
  earthGroup.add(cloudsMesh);

  // Atmosphere (Fresnel effect)
  const fresnelMat = getFresnelMat();
  const glowMesh = new THREE.Mesh(geometry, fresnelMat);
  glowMesh.scale.setScalar(1.01);
  earthGroup.add(glowMesh);

  return { earthGroup, earthMesh, lightsMesh, cloudsMesh, glowMesh };
}