export default function playBackgroundMusic(src,volume=0.5){
    const backgroundMusic = new Audio(src);
    backgroundMusic.loop = true;
    backgroundMusic.volume = volume;
    backgroundMusic.play().then(() => {
      console.log('Background music is playing.');
    })
    .catch((error) => {
      console.error('Failed to play the background music:', error);
    });
  return backgroundMusic;
}