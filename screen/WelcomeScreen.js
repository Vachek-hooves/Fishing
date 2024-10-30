import { StyleSheet, Text, View, Dimensions, ImageBackground, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import LottieView from 'lottie-react-native'

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const slideAnim = useRef(new Animated.ValueXY({ x: -width, y: height/2 })).current;

  useEffect(() => {
    Animated.sequence([
      // First move from left to center
      Animated.spring(slideAnim, {
        toValue: { x: 0, y: height/2 },
        useNativeDriver: true,
        tension: 50,
        friction: 7
      }),
      // Then move higher to top
      Animated.timing(slideAnim, {
        toValue: { x: 0, y: height * 0.05-200 },
        duration: 1500,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <ImageBackground style={styles.container} source={require('../assets/fishWelcome.png')}>
      <LottieView
        source={require('../assets/lottieJson/fisherman.json')}
        autoPlay
        loop
        style={styles.animation}
        resizeMode="cover"
      />
      <Animated.Text 
        style={[
          styles.welcomeText,
          {
            transform: [
              { translateX: slideAnim.x },
              { translateY: slideAnim.y }
            ]
          }
        ]}
      >
        Welcome to Ultimate Fishing Diary
      </Animated.Text>
    </ImageBackground>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: width,
    height: height * 0.5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    position: 'absolute',
  }
})