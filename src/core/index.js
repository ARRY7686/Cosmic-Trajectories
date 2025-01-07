import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "../utils/getStarfield.js";
import { getFresnelMat } from "../utils/getFresnelMat.js";

// Create intro sequence
const introContainer = document.createElement('div');
Object.assign(introContainer.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: '2000',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000000'
});

const introVideo = document.createElement('video');
Object.assign(introVideo.style, {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover'
});
introVideo.muted = true;
introVideo.autoplay = true;
introVideo.src = '../../assets/videos/earth-intro.mp4';

const textOverlay = document.createElement('div');
Object.assign(textOverlay.style, {
    position: 'relative',
    zIndex: '2001',
    color: 'white',
    textAlign: 'center',
    maxWidth: '800px',
    padding: '2rem'
});

const welcomeText = document.createElement('h1');
Object.assign(welcomeText.style, {
    fontSize: '3rem',
    fontWeight: '700',
    marginBottom: '2rem',
    opacity: '0',
    fontFamily: "'Inter', sans-serif"
});

const descriptionText = document.createElement('p');
Object.assign(descriptionText.style, {
    fontSize: '1.5rem',
    lineHeight: '1.6',
    marginBottom: '3rem',
    opacity: '0',
    fontFamily: "'Inter', sans-serif"
});

const proceedButton = document.createElement('button');
proceedButton.textContent = 'Proceed to Visualization';
Object.assign(proceedButton.style, {
    padding: '1rem 2rem',
    fontSize: '1.2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: '2px solid white',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
    opacity: '0',
    fontFamily: "'Inter', sans-serif"
});

proceedButton.onmouseover = () => {
    proceedButton.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
};
proceedButton.onmouseout = () => {
    proceedButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
};

// Add animation styles
const introStyles = document.createElement('style');
introStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(introStyles);

// Assemble intro sequence
textOverlay.appendChild(welcomeText);
textOverlay.appendChild(descriptionText);
textOverlay.appendChild(proceedButton);
introContainer.appendChild(introVideo);
introContainer.appendChild(textOverlay);
document.body.appendChild(introContainer);

// Create modern loading screen
const loadingScreen = document.createElement('div');
Object.assign(loadingScreen.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: '#000000',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '1000',
    color: 'white',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    transition: 'opacity 0.5s ease-in-out'
});

const loadingContainer = document.createElement('div');
Object.assign(loadingContainer.style, {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2.5rem',
    maxWidth: '400px',
    padding: '2rem',
    textAlign: 'center'
});

const loadingRing = document.createElement('div');
Object.assign(loadingRing.style, {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderTop: '2px solid white',
    animation: 'rotate 1s linear infinite'
});

const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
    }
`;
document.head.appendChild(styleSheet);

const loadingTitle = document.createElement('div');
loadingTitle.textContent = 'EARTH VISUALIZATION';
Object.assign(loadingTitle.style, {
    fontSize: '16px',
    fontWeight: '500',
    letterSpacing: '3px',
    textTransform: 'uppercase'
});

const statusContainer = document.createElement('div');
Object.assign(statusContainer.style, {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    width: '100%'
});

const progressText = document.createElement('div');
Object.assign(progressText.style, {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'monospace',
    letterSpacing: '1px'
});

const progressContainer = document.createElement('div');
Object.assign(progressContainer.style, {
    width: '180px',
    height: '1px',
    background: 'rgba(255, 255, 255, 0.1)',
    position: 'relative'
});

const progressFill = document.createElement('div');
Object.assign(progressFill.style, {
    width: '0%',
    height: '100%',
    background: '#ffffff',
    transition: 'width 0.3s ease-out'
});

progressContainer.appendChild(progressFill);
statusContainer.appendChild(progressText);
statusContainer.appendChild(progressContainer);
loadingContainer.appendChild(loadingRing);
loadingContainer.appendChild(loadingTitle);
loadingContainer.appendChild(statusContainer);
loadingScreen.appendChild(loadingContainer);

// Handle intro sequence
function startIntroSequence() {
    introVideo.play();
    
    setTimeout(() => {
        welcomeText.textContent = "Welcome to Cosmic Trajectories";
        welcomeText.style.animation = 'fadeIn 1.5s forwards';
    }, 1000);
    
    setTimeout(() => {
        descriptionText.textContent = "Explore our planet and its satellites in an interactive 3D environment";
        descriptionText.style.animation = 'fadeIn 1.5s forwards';
    }, 2500);
    
    setTimeout(() => {
        proceedButton.style.animation = 'fadeIn 1.5s forwards';
    }, 4000);
}

// Handle proceed button click
proceedButton.addEventListener('click', () => {
    introContainer.style.transition = 'opacity 1s ease-out';
    introContainer.style.opacity = '0';
    
    setTimeout(() => {
        introContainer.remove();
        document.body.appendChild(loadingScreen);
        initializeVisualization();
    }, 1000);
});

// Start intro sequence when video is ready
introVideo.addEventListener('loadeddata', () => {
    startIntroSequence();
});

function initializeVisualization() {
    // Create loading manager
    const loadManager = new THREE.LoadingManager();
    let totalItems = 0;
    let loadedItems = 0;

    loadManager.onStart = function(url, itemsLoaded, itemsTotal) {
        totalItems = itemsTotal;
    };

    loadManager.onProgress = function(url, itemsLoaded, itemsTotal) {
        const progress = (itemsLoaded / itemsTotal) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `LOADING ${Math.round(progress)}%`;
    };

    loadManager.onLoad = function() {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            animateIntro();
        }, 500);
    };

    // Scene setup
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 20;
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

    // Satellite creation function
    function createSatellite(longitude, latitude, height, inclination, name) {
        const imageUrl = "../../assets/textures/stars/circle.png";
        const satelliteGroup = new THREE.Group();
        earthGroup.add(satelliteGroup);

        const earthRadius = 6371;
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
            opacity: 1,
        });
        
        const trail = new THREE.Line(trailGeometry, trailMaterial);
        satelliteGroup.add(trail);

        satellite.userData = {
            orbitRadius: scaledHeight,
            orbitSpeed: 0.005 * Math.pow(scaledHeight, -1.5),
            orbitAngle: Math.random() * Math.PI * 2,
            group: satelliteGroup,
            trail: trail,
            positions: []
        };
        satellites.push(satellite);
        return satellite;
      }
      createSatellite(0, 0, 400, 51.6, "ISS");
    createSatellite(120, 0, 550, 53, "starlink");
    createSatellite(120, 0, 550, 28.5, "Hubble");
    createSatellite(0, 0, 20200, 55, "GPS");
    createSatellite(0, 0, 23222, 56, "Galileo");
    createSatellite(0, 0, 705, 98.2, "Landsat");
    createSatellite(0, 0, 700, 98.6, "Sentinel");
    createSatellite(0, 0, 639, 97.9, "ALOS");
    createSatellite(0, 0, 680, 98.1, "Alsat");
    createSatellite(0, 0, 764, 98.5, "Amazônia");

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
                
                satellite.position.x = orbitRadius * Math.cos(satellite.userData.orbitAngle);
                satellite.position.z = orbitRadius * Math.sin(satellite.userData.orbitAngle);
                
                satellite.lookAt(0, 0, 0);
                satellite.rotateY(Math.PI);

                positions.push(new THREE.Vector3(
                    satellite.position.x,
                    satellite.position.y,
                    satellite.position.z
                ));
                
                if (positions.length > MAX_TRAIL_LENGTH) {
                    positions.shift();
                }

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
}

// Start intro video when loaded
introVideo.addEventListener('loadeddata', () => {
    startIntroSequence();
});