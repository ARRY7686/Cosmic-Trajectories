import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

import getStarfield from "../utils/getStarfield.js";
import { getFresnelMat } from "../utils/getFresnelMat.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
// THREE.ColorManagement.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);
new OrbitControls(camera, renderer.domElement);
const detail = 12;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("../../assets/textures/earthmap1k.png"),
  specularMap: loader.load("../../assets/textures/earthspec1k.png"),
  bumpMap: loader.load("../../assets/textures/earthbump1k.png"),
  bumpScale: 0.04,
});
// material.map.colorSpace = THREE.SRGBColorSpace;
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load("../../assets/textures/earthlights1k.png"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("../../assets/textures/earthcloudmap.png"),
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load('../../assets/textures/earthcloudmaptrans.png'),
  // alphaTest: 0.3,
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);

const stars = getStarfield({numStars: 2000});
scene.add(stars);

const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

function animate() {
  requestAnimationFrame(animate);

  earthMesh.rotation.y += 0.002;
  lightsMesh.rotation.y += 0.002;
  cloudsMesh.rotation.y += 0.0023;
  glowMesh.rotation.y += 0.002;
  stars.rotation.y -= 0.0002;

  earthGroup.traverse((child) => {
      if (child.isMesh && child.userData.orbitRadius) {
          child.userData.orbitAngle += child.userData.orbitSpeed;
          
          const x = child.userData.orbitRadius * Math.cos(child.userData.orbitAngle);
          const z = child.userData.orbitRadius * Math.sin(child.userData.orbitAngle);
          
          child.position.x = x;
          child.position.z = z;
          
          child.lookAt(0, 0, 0);
          child.rotateY(Math.PI);
      }
  });

  renderer.render(scene, camera);
}




animate();

function handleWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);



function createSatellite(longitude, latitude, height, inclination, name) {
  const imageUrl = '../../assets/textures/stars/circle.png'; 
  const satelliteGroup = new THREE.Group();
  earthGroup.add(satelliteGroup);
  
  const earthRadius = 6371; // km
  const scaledHeight = (earthRadius + height) / earthRadius;
  
  const planeGeometry = new THREE.PlaneGeometry(0.05, 0.05);
  const texture = new THREE.TextureLoader().load(imageUrl);
  const planeMaterial = new THREE.MeshBasicMaterial({ 
      map: texture, 
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
  });
  
  const satellite = new THREE.Mesh(planeGeometry, planeMaterial);
  
  if (name) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 64;
      context.font = 'bold 32px Arial';
      context.fillStyle = 'white';
      context.textAlign = 'center';
      context.fillText(name, canvas.width/2, canvas.height/2);
      
      const labelTexture = new THREE.CanvasTexture(canvas);
      const labelGeometry = new THREE.PlaneGeometry(0.2, 0.05);
      const labelMaterial = new THREE.MeshBasicMaterial({
          map: labelTexture,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false
      });
      
      const label = new THREE.Mesh(labelGeometry, labelMaterial);
      label.position.x = 0.1;
      satellite.add(label); 
  }
  
  const phi = (90 - latitude) * (Math.PI / 180);
  const theta = longitude * (Math.PI / 180);
  
  const x = -(scaledHeight) * Math.sin(phi) * Math.cos(theta);
  const y = (scaledHeight) * Math.cos(phi);
  const z = (scaledHeight) * Math.sin(phi) * Math.sin(theta);
  
  satellite.position.set(x, y, z);
  
  satellite.lookAt(0, 0, 0);
  satellite.rotateY(Math.PI);
  
  satelliteGroup.add(satellite);
  satelliteGroup.rotation.x = inclination * (Math.PI / 180);
  
  satellite.userData = {
      orbitRadius: scaledHeight,
      orbitSpeed: 0.01,
      orbitAngle: 0
  };
  
  return satellite;
}

function addOrbitalPath(radius, inclination) {
  const curve = new THREE.EllipseCurve(
      0, 0,
      radius, radius,
      0, 2 * Math.PI,
      false,
      0
  );
  
  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
  
  const ellipse = new THREE.Line(geometry, material);
  ellipse.rotation.x = Math.PI / 2;
  ellipse.rotation.x += inclination * (Math.PI / 180);
  
  earthGroup.add(ellipse);
}

const iss = createSatellite(0, 0, 400, 51.6,"ISS");
const issPath = addOrbitalPath(1.06, 51.6);


const starlink = createSatellite(120, 0, 550, 53, "Starlink");
const starlink2 = createSatellite(120, 0, 550, 53.2);
const starlink3 = createSatellite(120, 0, 550, 53.4);
const starlink4 = createSatellite(120, 0, 550, 53.6);
const starlink5 = createSatellite(120, 0, 550, 53.8);
const starlink6 = createSatellite(120, 0, 550, 54);
const starlink7 = createSatellite(120, 0, 550, 54.2);
const starlink1path = addOrbitalPath(1.086, 53);
const starlink2path = addOrbitalPath(1.086, 53.2);
const starlink3path = addOrbitalPath(1.086, 53.4);
const starlink4path = addOrbitalPath(1.086, 53.6);
const starlink5path = addOrbitalPath(1.086, 53.8);
const starlink6path = addOrbitalPath(1.086, 54);
const starlink7path = addOrbitalPath(1.086, 54.2);


const hubble = createSatellite(120, 0, 550, 28.5, "Hubble");
const hubblePath = addOrbitalPath(1.086, 28.5);


const gps = createSatellite(0, 0, 20200, 55, "GPS");
const gpspath = addOrbitalPath(4.167, 55);


const galleleo = createSatellite(0, 0, 23222, 56, "Galileo");
const galleleoPath = addOrbitalPath(4.640, 56);


const landsat = createSatellite(0, 0, 705, 98.2, "Landsat");
const landsatPath = addOrbitalPath(1.110, 98.2);


const sennital = createSatellite(0, 0, 700, 98.6, "Sentinel");
const sennitalPath = addOrbitalPath(1.109, 98.6);


