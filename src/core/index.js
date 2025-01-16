//imports
import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "../utils/getStarfield.js";
import { getFresnelMat } from "../utils/getFresnelMat.js";
import {
  createIntroSequence,
  startIntroSequence,
} from "../utils/introSequence.js";
import { createLoadingScreen } from "../utils/loadingScreen.js";
import {
  setLoadingElements,
  getLoadingElements,
} from "../utils/loadingState.js";
import { createEarth } from "../components/earth/earth.js";
import {
  createSatellites,
  updateSatelliteTrails,
  createSatelliteMenu,
  animateMenuLinks,
} from "../components/earth/earthSatellites.js";

const introElements = createIntroSequence(); //creating intro sequence
const loadingElements = createLoadingScreen(); //loading screen
setLoadingElements(loadingElements); //storing them for global access

//load the intro sequence when dom is ready
document.addEventListener("DOMContentLoaded", () => {
  startIntroSequence(introElements);
});

export function initializeVisualization() {
  // Get loading elements including the loadingScreen
  const { loadingScreen, progressFill, progressText } = getLoadingElements();
  // setting up loading manager from three js
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
  const { earthGroup, earthMesh, lightsMesh, cloudsMesh, glowMesh } = createEarth(loader);

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

  // Create satellites
  const satellites = createSatellites(loader, earthGroup);
  const MAX_TRAIL_LENGTH = 100;

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
      updateSatelliteTrails(satellites, camera, MAX_TRAIL_LENGTH);

      renderer.render(scene, camera);
      requestAnimationFrame(mainLoop);
    }

    mainLoop();
  }

  createSatelliteMenu();
  setTimeout(() => animateMenuLinks(), 1500);
}
