import * as THREE from "three";
import { createSatellite } from "../../utils/satellite.js";

export function createSatellites(loader, earthGroup) {
  const satellites = [];
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

  return satellites;
}

export function updateSatelliteTrails(satellites, camera, MAX_TRAIL_LENGTH) {
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
}

export function createSatelliteMenu() {
  const menu = document.createElement("div");
  menu.className = "satellite-menu";

  const title = document.createElement("h2");
  title.textContent = "Satellites";
  menu.appendChild(title);

  const list = document.createElement("ul");
  list.className = "satellite-list";

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
    "Amazônia",
  ];

  satelliteNames.forEach((name) => {
    const item = document.createElement("li");
    item.className = "satellite-item";
    item.innerText = name;
    item.setAttribute("data-value", name);
    list.appendChild(item);
  });

  menu.appendChild(list);
  document.body.appendChild(menu);
}

export function animateMenuLinks() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const items = document.querySelectorAll(".satellite-item");

  items.forEach((item) => {
    let iteration = 0;

    const interval = setInterval(() => {
      item.innerText = item.innerText
        .split("")
        .map((_, index) => {
          if (index < iteration) {
            return item.dataset.value[index];
          }

          return letters[Math.floor(Math.random() * 26)];
        })
        .join("");

      if (iteration >= item.dataset.value.length) clearInterval(interval);

      iteration += 1 / 10;
    }, 30);
  });
}