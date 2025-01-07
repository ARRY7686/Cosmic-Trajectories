import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

import getStarfield from "../utils/getStarfield.js";
import { getFresnelMat } from "../utils/getFresnelMat.js";

// Scene setup
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 20; // Start farther for welcome animation
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

// Earth group
const earthGroup = new THREE.Group();
earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
scene.add(earthGroup);
new OrbitControls(camera, renderer.domElement);

// Load textures
const loader = new THREE.TextureLoader();
const detail = 12;
const geometry = new THREE.IcosahedronGeometry(1, detail);

// Earth mesh
const material = new THREE.MeshPhongMaterial({
  map: loader.load("../../assets/textures/earthmap1k.png"),
  specularMap: loader.load("../../assets/textures/earthspec1k.png"),
  bumpMap: loader.load("../../assets/textures/earthbump1k.png"),
  bumpScale: 0.04,
});
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

// Lights layer
const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load("../../assets/textures/earthlights1k.png"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);

// Clouds layer
const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("../../assets/textures/earthcloudmap.png"),
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load("../../assets/textures/earthcloudmaptrans.png"),
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

// Atmosphere (Fresnel effect)
const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);

// Starfield
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.1,
  transparent: true,
  opacity: 0, // Start invisible for welcome animation
});
const stars = getStarfield({ numStars: 2000, material: starMaterial });
scene.add(stars);

// Sunlight
const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

// Store all satellites and their trails for animation
const satellites = [];
const MAX_TRAIL_LENGTH = 100; // Number of positions to keep in trail

// Satellite creation
function createSatellite(longitude, latitude, height, inclination, name) {
  const imageUrl = "../../assets/textures/stars/circle.png";
  const satelliteGroup = new THREE.Group();
  earthGroup.add(satelliteGroup);

  const earthRadius = 6371; // km
  const scaledHeight = (earthRadius + height) / earthRadius;

  const planeGeometry = new THREE.PlaneGeometry(0.05, 0.05);
  const texture = loader.load(imageUrl);
  const planeMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const satellite = new THREE.Mesh(planeGeometry, planeMaterial);
  if (name) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 256;
    canvas.height = 64;
    context.font = "bold 32px Arial";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.fillText(name, canvas.width / 2, canvas.height / 2);

    const labelTexture = new THREE.CanvasTexture(canvas);
    const labelGeometry = new THREE.PlaneGeometry(0.2, 0.05);
    const labelMaterial = new THREE.MeshBasicMaterial({
      map: labelTexture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.x = 0.1;
    satellite.add(label);
  }

  const phi = (90 - latitude) * (Math.PI / 180);
  const theta = longitude * (Math.PI / 180);

  satellite.position.set(
    -(scaledHeight) * Math.sin(phi) * Math.cos(theta),
    scaledHeight * Math.cos(phi),
    scaledHeight * Math.sin(phi) * Math.sin(theta)
  );
  
  satellite.lookAt(0, 0, 0);
  satellite.rotateY(Math.PI);
  satelliteGroup.add(satellite);
  satelliteGroup.rotation.x = inclination * (Math.PI / 180);

  // Create trail
  const trailGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(MAX_TRAIL_LENGTH * 3);
  trailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const trailMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 1.0,
  });
  
  const trail = new THREE.Line(trailGeometry, trailMaterial);
  satelliteGroup.add(trail);

  // Store orbital parameters and trail
  satellite.userData = {
    orbitRadius: scaledHeight,
    orbitSpeed: 0.005 * Math.pow(scaledHeight, -1.5),
    orbitAngle: Math.random() * Math.PI * 2,
    group: satelliteGroup,
    trail: trail,
    positions: [],
  };

  satellites.push(satellite);
  return satellite;
}

// Create satellites
createSatellite(0, 0, 400, 51.6, "ISS");
createSatellite(120, 0, 550, 53, "starlink");
createSatellite(120, 0, 550, 28.5, "Hubble");
createSatellite(0, 0, 20200, 55, "GPS");
createSatellite(0, 0, 23222, 56, "Galileo");
createSatellite(0, 0, 705, 98.2, "Landsat");
createSatellite(0, 0, 700, 98.6, "Sentinel");

// Resize handling
function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);

// Welcome Animation
let introAnimationDone = false;

function animateIntro() {
  const introDuration = 5; // seconds
  const startTime = performance.now();

  function introLoop(time) {
    const elapsed = (time - startTime) / 1000;

    if (elapsed < introDuration) {
      const progress = elapsed / introDuration;
      camera.position.z = 20 - progress * 15; // Zoom in
      starMaterial.opacity = progress; // Fade in stars
    } else {
      introAnimationDone = true;
    }

    renderer.render(scene, camera);
    if (!introAnimationDone) {
      requestAnimationFrame(introLoop);
    } else {
      animateMain();
    }
  }

  introLoop(performance.now());
}

function animateMain() {
  function mainLoop() {
    // Rotate Earth elements
    earthMesh.rotation.y += 0.002;
    lightsMesh.rotation.y += 0.002;
    cloudsMesh.rotation.y += 0.0023;
    glowMesh.rotation.y += 0.002;
    stars.rotation.y -= 0.0002;

    // Update satellite positions and trails
    satellites.forEach(satellite => {
      const { orbitRadius, orbitSpeed, orbitAngle, trail, positions } = satellite.userData;
      satellite.userData.orbitAngle += orbitSpeed;
      
      // Calculate new position
      satellite.position.x = orbitRadius * Math.cos(satellite.userData.orbitAngle);
      satellite.position.z = orbitRadius * Math.sin(satellite.userData.orbitAngle);
      
      // Make satellite always face Earth
      satellite.lookAt(0, 0, 0);
      satellite.rotateY(Math.PI);

      // Update trail positions
      positions.push(new THREE.Vector3(
        satellite.position.x,
        satellite.position.y,
        satellite.position.z
      ));
      
      // Keep trail at fixed length
      if (positions.length > MAX_TRAIL_LENGTH) {
        positions.shift();
      }

      // Update trail geometry
      const positions_array = new Float32Array(positions.length * 3);
      for (let i = 0; i < positions.length; i++) {
        positions_array[i * 3] = positions[i].x;
        positions_array[i * 3 + 1] = positions[i].y;
        positions_array[i * 3 + 2] = positions[i].z;
      }
      
      trail.geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions_array, 3)
      );
      trail.geometry.attributes.position.needsUpdate = true;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(mainLoop);
  }

  mainLoop();
}

// Start the intro animation
animateIntro();