import { StyleSheet, Text, View, Dimensions, ImageBackground } from 'react-native'
import LottieView from 'lottie-react-native'

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  return (
    <ImageBackground style={styles.container} source={require('../assets/fishWelcome.png')}>
      <LottieView
        source={require('../assets/lottieJson/fisherman.json')}
        autoPlay
        loop
        style={[styles.animation, styles.fishRight]}
        resizeMode="cover"
      />
      <Text>WelcomeScreen</Text>
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
  fishRight: {
    // transform: [{ rotate: '180deg' }]
  }
})