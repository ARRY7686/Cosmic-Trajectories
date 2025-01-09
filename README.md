# Satellite Tracker

An interactive 3D visualization of Earth's satellites using Three.js.

## Features
- Real-time 3D Earth visualization with realistic textures
- Dynamic satellite orbit tracking with trails
- Interactive camera controls with zoom and pan
- Atmospheric effects using Fresnel shaders
- Loading screen with progress tracking
- Animated intro sequence
- Background starfield
- Satellite labels and information

## Prerequisites
- Node.js (v14 or higher)
- Modern web browser with WebGL support
- Git

## Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/satellite-tracker.git
cd satellite-tracker
```

3. Open `index.html` in your browser.

## Technologies:
- Three.js for 3D rendering and animation
- JavaScript (ES6+) for core functionality
- HTML5/CSS3 for UI components

## Architecture
The project is structured as follows:
- `assets/`: Contains textures, videos, and other static assets
- `public/`: Contains the main HTML file
- `src/`: Contains the core JavaScript files and utility modules

## Core Files and Modules
- **[src/core/index.js](src/core/index.js)**: The main entry point of the application. It sets up the Three.js scene, camera, renderer, and adds the Earth model, satellites, and starfield. It also handles the animation loop and window resizing.
- **[src/utils/introSequence.js](src/utils/introSequence.js)**: Manages intro animation sequence
- **[src/utils/loadingScreen.js](src/utils/loadingScreen.js)**: Creates and manages loading screen UI
- **[src/utils/loadingState.js](src/utils/loadingState.js)**: Manages loading state across components
- **[src/utils/satellite.js](src/utils/satellite.js)**: Handles satellite creation and trail rendering
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
