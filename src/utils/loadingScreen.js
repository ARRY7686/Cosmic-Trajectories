//styles for the loading screen
export function createLoadingScreen() {
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

    return { loadingScreen, progressFill, progressText };
}