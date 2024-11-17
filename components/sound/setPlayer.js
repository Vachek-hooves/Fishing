import Sound from 'react-native-sound';
import { Platform } from 'react-native';

let backgroundMusic = null;
let isPlaying = false;

export const setupPlayer = () => {
  if (backgroundMusic) return Promise.resolve();

  return new Promise((resolve, reject) => {
    Sound.setCategory('Playback', true);
    Sound.setMode('SpokenAudio');
    Sound.setActive(true);

    backgroundMusic = new Sound(
      require('../../assets/bgMusic.mp3'), 
      (error) => {
        if (error) {
          console.error('Failed to load sound', error);
          reject(error);
          return;
        }
        backgroundMusic.setNumberOfLoops(-1);
        backgroundMusic.setVolume(0.5);
        resolve();
      }
    );
  });
};

export const toggleBackgroundMusic = () => {
  if (!backgroundMusic) {
    return false;
  }

  if (isPlaying) {
    backgroundMusic.pause();
    isPlaying = false;
    return false;
  } else {
    backgroundMusic.play();
    isPlaying = true;
    return true;
  }
};

export const playBackgroundMusic = () => {
  if (!backgroundMusic) {
    return false;
  }

  backgroundMusic.play();
  isPlaying = true;
  return true;
};

export const getPlayingState = () => isPlaying;

export const cleanupPlayer = () => {
  if (backgroundMusic) {
    backgroundMusic.stop();
    backgroundMusic.release();
    backgroundMusic = null;
    isPlaying = false;
  }
};
