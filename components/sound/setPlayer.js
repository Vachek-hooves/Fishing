import Sound from 'react-native-sound';
import { Platform } from 'react-native';

let backgroundMusic = null;
let isPlaying = false;

export const setupPlayer = () => {
  if (backgroundMusic) return;

  Sound.setCategory('Playback', true);
  Sound.setMode('SpokenAudio');
  Sound.setActive(true);
  
  return new Promise((resolve, reject) => {
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
        
        if (Platform.OS === 'ios') {
          backgroundMusic.setCategory('Playback');
        }
        
        resolve();
      }
    );
  });
};

export const playBackgroundMusic = async () => {
  if (!backgroundMusic) {
    await setupPlayer();
  }
  
  if (backgroundMusic) {
    backgroundMusic.play((success) => {
      if (!success) {
        console.log('Playback failed due to audio decoding errors');
      }
    });
    isPlaying = true;
  }
};

export const pauseBackgroundMusic = () => {
  if (backgroundMusic) {
    backgroundMusic.pause();
    isPlaying = false;
  }
};

export const toggleBackgroundMusic = () => {
  if (!backgroundMusic) {
    setupPlayer().then(() => {
      playBackgroundMusic();
    });
    return true;
  }

  if (isPlaying) {
    backgroundMusic.pause();
    isPlaying = false;
    return false;
  } else {
    backgroundMusic.play((success) => {
      if (!success) {
        console.log('Playback failed due to audio decoding errors');
      }
    });
    isPlaying = true;
    return true;
  }
};

export const cleanupPlayer = () => {
  if (backgroundMusic) {
    backgroundMusic.release();
    backgroundMusic = null;
    isPlaying = false;
  }
};
