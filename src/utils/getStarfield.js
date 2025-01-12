import * as THREE from "three";
//creating a dome of stars to represent the space.

export default function getStarfield({ numStars = 500 } = {}) {
  function randomSpherePoint() {
   // random radius between 25 and 50
    const radius = Math.random() * 25 + 25;
    // random sphere coordinate
    const u = Math.random();
    const v = Math.random();

    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);

    //converting for cartesian planes
    let x = radius * Math.sin(phi) * Math.cos(theta);
    let y = radius * Math.sin(phi) * Math.sin(theta);
    let z = radius * Math.cos(phi);

    return {
      pos: new THREE.Vector3(x, y, z),
      hue: 0.6,
      minDist: radius,
    };
  }
  const verts = [];// vertex positions
  const colors = [];// star colors
  const positions = [];// star positions for later use
  let col;

  //genrating stars based on the given input
  for (let i = 0; i < numStars; i += 1) {
    let p = randomSpherePoint();
    const { pos, hue } = p;
    positions.push(p);
    col = new THREE.Color().setHSL(hue, 0.2, Math.random());
    verts.push(pos.x, pos.y, pos.z);
    colors.push(col.r, col.g, col.b);
  }
  //asiigning the position and the color to the geometry
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    map: new THREE.TextureLoader().load(
      "../../assets/textures/stars/circle.png"
    ),
  });
  const points = new THREE.Points(geo, mat);
  return points;
}