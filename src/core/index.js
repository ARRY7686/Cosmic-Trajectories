//imports
import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "../utils/getStarfield.js";
import { getFresnelMat } from "../utils/getFresnelMat.js";
import { createIntroSequence,startIntroSequence } from "../utils/introSequence.js";
import { createLoadingScreen } from "../utils/loadingScreen.js";
import { createSatellite } from "../utils/satellite.js";
import { setLoadingElements,getLoadingElements } from "../utils/loadingState.js";


const introElements = createIntroSequence();//creating intro sequence
const loadingElements = createLoadingScreen();//loading screen
setLoadingElements(loadingElements);//sotring them for global access

//load the intro sequene when dom is ready
document.addEventListener("DOMContentLoaded", () => {
  startIntroSequence(introElements);
});

export function initializeVisualization() {
  // Get loading elements including the loadingScreen
  const { loadingScreen, progressFill, progressText } = getLoadingElements();
  // setting up loading mananger from three js
  const loadManager = new THREE.LoadingManager();
  let totalItems = 0;
  let loadedItems = 0;
  let introAnimationDone = false;

  loadManager.onStart = function (url, itemsLoaded, itemsTotal) {
    totalItems = itemsTotal;
    if (progressFill && progressText) {
      progressFill.style.width = "0%";
      progressText.textContent = "LOADING 0%";
    }
  };

  loadManager.onProgress = function (url, itemsLoaded, itemsTotal) {
    const progress = (itemsLoaded / itemsTotal) * 100;
    // Make sure the elements exist before updating them
    if (progressFill && progressText) {
      progressFill.style.width = `${progress}%`;
      progressText.textContent = `LOADING ${Math.round(progress)}%`;
    }
  };

  loadManager.onLoad = function () {
    if (loadingScreen) {
      // Check if loadingScreen exists
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.style.display = "none";
        animateIntro();
      }, 500);
    }
  };

  // Load textures and initialize scene...
  const loader = new THREE.TextureLoader(loadManager);
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
  const earthGroup = new THREE.Group();
  earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
  earthGroup.add(earthMesh);


  const scene = new THREE.Scene();
  scene.add(earthGroup);
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 20;


  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //configuring orbital controls
  new OrbitControls(camera, renderer.domElement);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

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
    opacity: 0,
  });
  const stars = getStarfield({ numStars: 2000, material: starMaterial });
  scene.add(stars);

  // Sunlight
  const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
  sunLight.position.set(-2, 0.5, 1.5);
  scene.add(sunLight);

  // Store all satellites and their trails for animation
  const satellites = [];
  const MAX_TRAIL_LENGTH = 100;

  // Create satellites
  satellites.push(createSatellite(loader, earthGroup, 0, 0, 400, 51.6, "ISS"));
  satellites.push(
    createSatellite(loader, earthGroup, 120, 0, 550, 53, "starlink")
  );
  satellites.push(
    createSatellite(loader, earthGroup, 120, 0, 550, 28.5, "Hubble")
  );
  satellites.push(createSatellite(loader, earthGroup, 0, 0, 2000, 55, "GPS"));
  satellites.push(
    createSatellite(loader, earthGroup, 0, 0, 3222, 56, "Galileo")
  );
  satellites.push(
    createSatellite(loader, earthGroup, 0, 0, 705, 98.2, "Landsat")
  );
  satellites.push(
    createSatellite(loader, earthGroup, 0, 0, 700, 98.6, "Sentinel")
  );
  satellites.push(createSatellite(loader, earthGroup, 0, 0, 639, 97.9, "ALOS"));
  satellites.push(
    createSatellite(loader, earthGroup, 0, 0, 680, 98.1, "Alsat")
  );
  satellites.push(
    createSatellite(loader, earthGroup, 0, 0, 764, 98.5, "Amazônia")
  );

  // Resize handling
  function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", handleWindowResize, false);


  // Welcome Animation
  function animateIntro() {
    const introDuration = 5;
    const startTime = performance.now();

    function introLoop(time) {
      const elapsed = (time - startTime) / 1000;

      if (elapsed < introDuration) {
        const progress = elapsed / introDuration;
        camera.position.z = 20 - progress * 15;
        starMaterial.opacity = progress;
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
//main animation loop
  function animateMain() {
    function mainLoop() {
      // Rotate Earth elements
      earthMesh.rotation.y += 0.002;
      lightsMesh.rotation.y += 0.002;
      cloudsMesh.rotation.y += 0.0023;
      glowMesh.rotation.y += 0.002;
      stars.rotation.y -= 0.0002;

      // Update satellite positions and trails
      satellites.forEach((satellite) => {
        const {
          orbitRadius,
          orbitSpeed,
          orbitAngle,
          labelGroup,
          trail,
          positions,
        } = satellite.userData;
        satellite.userData.orbitAngle += orbitSpeed;

        satellite.position.x =
          orbitRadius * Math.cos(satellite.userData.orbitAngle);
        satellite.position.z =
          orbitRadius * Math.sin(satellite.userData.orbitAngle);

        satellite.lookAt(0, 0, 0);

        // Update label position and rotation
        if (labelGroup) {
          labelGroup.position.copy(satellite.position);
          labelGroup.lookAt(camera.position);
        }

        // Update label position and rotation
        if (labelGroup) {
          labelGroup.position.copy(satellite.position);
          labelGroup.lookAt(camera.position);
        }

        // Update trail
        positions.push(satellite.position.clone());
        if (positions.length > MAX_TRAIL_LENGTH) {
          positions.shift();
        }

        const trailPositions = trail.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i++) {
          trailPositions[i * 3] = positions[i].x;
          trailPositions[i * 3 + 1] = positions[i].y;
          trailPositions[i * 3 + 2] = positions[i].z;
        }
        trail.geometry.attributes.position.needsUpdate = true;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(mainLoop);
    }

    mainLoop();
  }
 // creating satellite menu with basic dom manipulation
  function createSatelliteMenu() {
    const menu = document.createElement('div');
    menu.className = 'satellite-menu';
    
    const title = document.createElement('h2');
    title.textContent = 'Satellites';
    menu.appendChild(title);
    
    const list = document.createElement('ul');
    list.className = 'satellite-list';
    
    const satelliteNames = [
        "ISS",
        "Starlink",
        "Hubble",
        "GPS",
        "Galileo",
        "Landsat",
        "Sentinel",
        "ALOS",
        "Alsat",
        "Amazônia"
    ];
    
    satelliteNames.forEach((name, index) => {
        const item = document.createElement('li');
        item.className = 'satellite-item';
        item.textContent = name;    
        list.appendChild(item);
    });
    
    menu.appendChild(list);
    document.body.appendChild(menu);
  }

  createSatelliteMenu();
}
