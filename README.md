# Cosmic Trajectories

Welcome to **Cosmic Trajectories**, a captivating 3D visualization built with Three.js. Explore Earth and its major satellites in orbit, providing an interactive and immersive experience of space. As the project evolves, we aim to expand the view to include more planets, offering a comprehensive look at our solar system.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Core Files and Modules](#core-files-and-modules)
- [File Structure](#file-structure)
- [License](#license)
- [Contributing](#contributing)

### Features:
- Interactive 3D model of Earth with satellites
- Dynamic space exploration powered by Three.js
- Future expansions to include additional planets

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/ARRY7686/Cosmic-Trajectories.git
   ```

2. Navigate to the project folder:
   ```bash
   cd Cosmic-Trajectories
   ```

3. Open `index.html` in your browser.

### Technologies:
- Three.js for 3D rendering
- JavaScript for interactivity

### Architecture
The project is structured as follows:
- `assets/`: Contains textures and other static assets.
- `public/`: Contains the main HTML file.
- `src/`: Contains the core JavaScript files and utility modules.

### Core Files and Modules
- **[src/core/index.js](src/core/index.js)**: The main entry point of the application. It sets up the Three.js scene, camera, renderer, and adds the Earth model, satellites, and starfield. It also handles the animation loop and window resizing.
- **[src/utils/backgroundMusic.js](src/utils/backgroundMusic.js)**: Manages background music playback, including play/pause functionality and track selection.
- **[src/utils/getFresnelMat.js](src/utils/getFresnelMat.js)**: Provides a function to create a Fresnel material shader for rendering atmospheric glow effects.
- **[src/utils/getStarfield.js](src/utils/getStarfield.js)**: Generates a starfield with a specified number of stars and adds it to the scene.

### File Structure
- `index.js`: Main entry point, initializes the 3D scene.
- `src/`: Contains helper utilities.
  - `getFresnelMat.js`: Generates Fresnel shader material.
  - `getStarfield.js`: Creates starfield geometry.
- `textures/`: Contains assets like Earth and stars.

### License
This project is licensed under the *GPL-3.0 License*.

### Contributing
Feel free to contribute by opening issues, submitting pull requests, or suggesting improvements.
