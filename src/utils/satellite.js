import * as THREE from 'three';


const MAX_TRAIL_LENGTH = 100;
const EARTH_RADIUS = 6371;

export function createSatellite(loader, earthGroup, longitude, latitude, height, inclination, name) {
    // Calculate orbit parameters
    const orbitRadius = (EARTH_RADIUS + height) / EARTH_RADIUS;
    const startAngle = Math.random() * Math.PI * 2;
    
    // Create satellite group
    const satelliteGroup = new THREE.Group();
    earthGroup.add(satelliteGroup);

    // Create satellite mesh
    const planeGeometry = new THREE.PlaneGeometry(0.05, 0.05);
    const texture = loader.load("../../assets/textures/stars/circle.png");
    const planeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const satellite = new THREE.Mesh(planeGeometry, planeMaterial);

    // Create and initialize trail
    const trailMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3
    });
    const trailGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(MAX_TRAIL_LENGTH * 3);
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const trail = new THREE.Line(trailGeometry, trailMaterial);
    satelliteGroup.add(trail);

    // Initialize trail positions
    const initialPositions = [];
    for (let i = 0; i < MAX_TRAIL_LENGTH; i++) {
        const angle = startAngle - (i * 0.01);
        const pos = new THREE.Vector3(
            orbitRadius * Math.cos(angle),
            0,
            orbitRadius * Math.sin(angle)
        );
        initialPositions.push(pos);
    }

    // Set satellite position
    const phi = (90 - latitude) * (Math.PI / 180);
    const theta = longitude * (Math.PI / 180);
    satellite.position.set(
        -(orbitRadius) * Math.sin(phi) * Math.cos(theta),
        orbitRadius * Math.cos(phi),
        orbitRadius * Math.sin(phi) * Math.sin(theta)
    );

    // Configure satellite orientation
    satellite.lookAt(0, 0, 0);
    satellite.rotateY(Math.PI);
    satelliteGroup.add(satellite);
    satelliteGroup.rotation.x = inclination * (Math.PI / 180);

    // Create label group if name provided
    const labelGroup = name ? createLabel(name, satelliteGroup) : null;

    // Set up satellite data
    satellite.userData = {
        orbitRadius,
        orbitSpeed: 0.005 * Math.pow(orbitRadius, -1.5),
        orbitAngle: startAngle,
        group: satelliteGroup,
        trail,
        positions: initialPositions,
        labelGroup
    };

    // Initialize trail geometry
    const trailPositions = trail.geometry.attributes.position.array;
    for (let i = 0; i < initialPositions.length; i++) {
        trailPositions[i * 3] = initialPositions[i].x;
        trailPositions[i * 3 + 1] = initialPositions[i].y;
        trailPositions[i * 3 + 2] = initialPositions[i].z;
    }
    trail.geometry.attributes.position.needsUpdate = true;

    return satellite;
}

function createLabel(name, satelliteGroup) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    context.font = 'bold 32px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText(name, canvas.width / 2, canvas.height / 2);

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
    
    const labelGroup = new THREE.Group();
    labelGroup.add(label);
    satelliteGroup.add(labelGroup);
    
    return labelGroup;
}