import { createLoadingScreen } from "./loadingScreen.js";
import { initializeVisualization } from "../core/index.js";
import { getLoadingElements } from './loadingState.js';

export function createIntroSequence() {
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

    return { introContainer, introVideo, welcomeText, descriptionText, proceedButton };
}

export function startIntroSequence(introElements) {
    const { introContainer, introVideo, welcomeText, descriptionText, proceedButton } = introElements;
    const { loadingScreen } = getLoadingElements();

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

    proceedButton.addEventListener('click', () => {
        introContainer.style.transition = 'opacity 1s ease-out';
        introContainer.style.opacity = '0';

        setTimeout(() => {
            introContainer.remove();
            document.body.appendChild(loadingScreen);
            initializeVisualization();
        }, 1000);
    });
}