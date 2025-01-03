document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio');
    const playPauseBtn = document.getElementById('play-pause');
    const songSelector = document.getElementById('song-selector');
  
    // Load the selected track
    function loadTrack(trackSrc) {
      audio.src = trackSrc;
      audio.play();
      updatePlayPauseIcon();
    }
  
    // Update play/pause button icon
    function updatePlayPauseIcon() {
      playPauseBtn.textContent = audio.paused ? '▶️' : '⏸️';
    }
  
    // Play/Pause button functionality
    playPauseBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
      updatePlayPauseIcon();
    });
  
    // Change track based on user selection
    songSelector.addEventListener('change', (e) => {
      loadTrack(e.target.value);
    });
  
    // Initialize the first track
    loadTrack(songSelector.value);
  });
  
