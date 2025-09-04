import * as THREE from "three";

const planetsData = [
  { name: "Mercury", size: 0.38, distance: 10, color: 0xb5b5b5, moons: 0, img: "mercury.png" },
  { name: "Venus", size: 0.95, distance: 15, color: 0xeed6a7, moons: 0, img: "venus.png" },
  { name: "Earth", size: 1, distance: 20, color: 0x3399ff, moons: 1, img: "earth.png" },
  { name: "Mars", size: 0.53, distance: 25, color: 0xff4500, moons: 2, img: "mars.png" },
  { name: "Jupiter", size: 11.2, distance: 35, color: 0xffd27f, moons: 4, img: "jupiter.png" },
  { name: "Saturn", size: 9.45, distance: 50, color: 0xf5deb3, moons: 3, img: "saturn.png" },
  { name: "Uranus", size: 4.0, distance: 60, color: 0x7fffd4, moons: 2, img: "uranus.png" },
  { name: "Neptune", size: 3.88, distance: 70, color: 0x4169e1, moons: 1, img: "neptune.png" },
];

const activePlanets = [];

export function initPlanets(scene) {
  const menu = document.getElementById("planet-list");
  if (!menu) return;

  planetsData.forEach((planet) => {
    const item = document.createElement("div");
    item.className = "planet-item";

    const img = document.createElement("img");
    img.src = `assets/planets/${planet.img}`;
    const name = document.createElement("span");
    name.textContent = planet.name;

    item.appendChild(img);
    item.appendChild(name);

    item.onclick = () => togglePlanet(scene, planet);

    menu.appendChild(item);
  });
}

