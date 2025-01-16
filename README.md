# Cosmic Trajectories

A stunning 3D visualization of Earth and its satellites built with Three.js, providing an interactive space exploration experience.

## Table of Contents
- [Features](#features)
- [Quick Start](#quick-start)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Core Files and Modules](#core-files-and-modules)
- [File Structure](#file-structure)
- [License](#license)
- [Contributing](#contributing)

## Features

- 🌍 Detailed 3D Earth model with atmospheric effects and cloud layers
- 🛰 Real-time satellite orbit visualization with dynamic trails
- 🌟 Interactive starfield background with thousands of stars
- 🎵 Ambient background music with volume control
- 🎨 Custom loading and intro sequences with smooth transitions
- 📱 Responsive design with collapsible satellite menu for mobile

## Quick Start

1. Clone the repository
   ```bash
   git clone https://github.com/ARRY7686/Cosmic-Trajectories.git
   ```

2. Navigate to the project folder:
   ```bash
   cd Cosmic-Trajectories
   ```

3. Open [index.html](index.html) in a modern web browser
4. No build step required - uses ES modules

## Technology Stack

- Three.js for 3D rendering
- Pure JavaScript (ES6+) 
- CSS3 for styling

### Architecture
The project is structured as follows:
- `assets/`: Contains textures, videos, and other static assets
- `public/`: Contains the main HTML file
- `src/`: Contains the core JavaScript files and utility modules

### Core Files and Modules
- **[src/components/earth/earth.js](src/components/earth/earth.js)**: Handles earth creation.
- **[src/components/earth/earthSatellites.js](src/components/earth/earthSatellites.js)**: Handles earth satellites creation.

- **[src/core/index.js](src/core/index.js)**: The main entry point of the application. It sets up the Three.js scene, camera, renderer, and adds starfield. It also handles the animation loop and window resizing.
- **[src/utils/introSequence.js](src/utils/introSequence.js)**: Manages intro animation sequence
- **[src/utils/loadingScreen.js](src/utils/loadingScreen.js)**: Creates and manages loading screen UI
- **[src/utils/loadingState.js](src/utils/loadingState.js)**: Manages loading state across components
- **[src/utils/satellite.js](src/utils/satellite.js)**: Handles satellite creation and trail rendering
- **[src/utils/backgroundMusic.js](src/utils/backgroundMusic.js)**: Manages background music playback, including play/pause functionality and track selection.
- **[src/utils/getFresnelMat.js](src/utils/getFresnelMat.js)**: Provides a function to create a Fresnel material shader for rendering atmospheric glow effects.
- **[src/utils/getStarfield.js](src/utils/getStarfield.js)**: Generates a starfield with a specified number of stars and adds it to the scene.

### License
This project is licensed under the *GPL-3.0 License*.

### Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
