import React, {useState, useEffect, useRef, useCallback} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {AppProvider} from './store/context';
import {
  TabMapScreen,
  WelcomeScreen,
  TabMoonScreen,
  TabWeatherScreen,
  TabSpotsScreen,
  TabUserScreen,
  TabAndroidMap,
  StackSpotCreateScreen,
} from './screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import {
  View,
  AppState,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import {
  setupPlayer,
  playBackgroundMusic,
  pauseBackgroundMusic,
  toggleBackgroundMusic,
  getPlayingState,
cleanupPlayer
} from './components/sound/setPlayer';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
// console.log(Platform.OS);
const MapComponent = Platform.OS === 'ios' ? TabMapScreen : TabAndroidMap;

const TabScreens = () => {
  const [focusedScreen, setFocusedScreen] = useState('TabMapScreen');
  const [isSoundOn, setIsSoundOn] = useState(true);

  const handleSoundToggle = () => {
    const newState = toggleBackgroundMusic();
    setIsSoundOn(newState);
  };

  useEffect(() => {
    const initSound = async () => {
      await setupPlayer();
      playBackgroundMusic();
      setIsSoundOn(true);
    };

    initSound();

    return () => {
      cleanupPlayer();
    };
  }, []);

  const getTabBarGradient = () => {
    switch (focusedScreen) {
      case 'TabMoonScreen':
        return ['#e6f3ff', '#cce6ff', '#b3d9ff'];
      default:
        return ['#003366', '#004d99', '#0066cc'];
    }
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          position: 'absolute',
          bottom: Platform.OS === 'android' ? 20 : 25,
          height: 80,
          paddingBottom: 10,
          // display: keyboardVisible ? 'none' : 'flex',
        },
        // tabBarHideOnKeyboard: true,
        tabBarBackground: () => (
          <LinearGradient
            colors={getTabBarGradient()}
            style={{height: '100%'}}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
          />
        ),
        tabBarActiveTintColor:
          focusedScreen === 'TabMoonScreen' ? '#003366' : '#ffd700',
        tabBarInactiveTintColor:
          focusedScreen === 'TabMoonScreen'
            ? 'rgba(0, 51, 102, 0.5)'
            : 'rgba(255, 215, 0, 0.5)',
      }}
      screenListeners={{
        state: e => {
          const route = e.data.state.routes[e.data.state.index];
          setFocusedScreen(route.name);
        },
      }}>
         <Tab.Screen
        name="TabUserScreen"
        component={TabUserScreen}
        options={{
          tabBarLabel: 'User',
          tabBarIcon: ({color, focused,size}) => (
            <View style={styles.iconContainer}>
              <Icon name="account" color={color} size={size} />
            </View>
          ),
        }}
      />
      <Tab.Screen
          name="MapComponent"
          component={MapComponent}
          options={{
            tabBarIcon: ({color, focused, size}) => {
              return (
                <View style={styles.iconContainer}>
                  <Icon
                    name="map-marker"
                    color={color}
                    size={size}
                    style={[styles.icon, focused && styles.activeIcon]}
                  />
                  {focused && <View style={styles.activeIndicator} />}
                </View>
              );
            },
            tabBarLabel: 'Map',
          }}
        />
      <Tab.Screen
        name="TabMoonScreen"
        component={TabMoonScreen}
        options={{
          tabBarIcon: ({color, focused, size}) => (
            <View style={styles.iconContainer}>
              <Icon
                name="moon-waning-crescent"
                color={color}
                size={size} // Explicit size
                style={[styles.icon, focused && styles.activeIcon]}
              />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
          tabBarLabel: 'Moon',
        }}
      />
      {/* <Tab.Screen
          name="TabMapScreen"
          component={TabMapScreen}
          options={{
            tabBarIcon: ({color, focused}) => (
              <View style={styles.iconContainer}>
                <Icon
                  name="map-marker"
                  color={color}
                  size={34} // Explicit size
                  style={[styles.icon, focused && styles.activeIcon]}
                />
                {focused && <View style={styles.activeIndicator} />}
              </View>
            ),
            tabBarLabel: 'Map',
          }}
        /> */}
      {/* <Tab.Screen name="TabAndroidMap" component={TabAndroidMap} /> */}

      
        
      

      <Tab.Screen
        name="TabWeatherScreen"
        component={TabWeatherScreen}
        options={{
          tabBarIcon: ({color, focused, size}) => (
            <View style={styles.iconContainer}>
              <Icon
                name="weather-sunny"
                color={color}
                size={size} // Explicit size
                style={[styles.icon, focused && styles.activeIcon]}
              />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
          tabBarLabel: 'Weather',
        }}
      />
      <Tab.Screen
        name="TabSpotsScreen"
        component={TabSpotsScreen}
        options={{
          tabBarIcon: ({color, focused, size}) => (
            <View style={styles.iconContainer}>
              <Icon
                name="map-marker-radius"
                color={color}
                size={size} // Explicit size
                style={[styles.icon, focused && styles.activeIcon]}
              />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
          tabBarLabel: 'Spots',
          
        }}
      />
     
      <Tab.Screen
        name="Sound"
        component={BlankScreen}
        options={{
          tabBarLabel: 'Sound',
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={handleSoundToggle}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <AntIcon
                name="sound"
                color={isSoundOn ? '#4CAF50' : '#ff0000'}
                size={32}
              />
              <Text style={{
                color: isSoundOn ? '#4CAF50' : '#ff0000',
                fontSize: 12,
                marginTop: 4
              }}>
                Sound
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
const BlankScreen = () => null;

const styles = {
  tabBar: {
    height: 80,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffd700',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    // marginBottom: 5,
    marginTop: 15,
  },
  tabBarItem: {
    paddingTop: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  icon: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  activeIcon: {
    transform: [{scale: 1.3}],
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -10,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: props =>
      props.focused === 'TabMoonScreen' ? '#003366' : '#ffd700',
  },
};

const loaders = [
  require('./assets/loads/loader1.png'),
  require('./assets/loads/loader2.png'),
];

function App() {
  const [currentLoader, setCurrentLoader] = useState(0);
  const slideAnimation1 = useRef(new Animated.Value(0)).current;
  const slideAnimation2 = useRef(
    new Animated.Value(Dimensions.get('window').width),
  ).current;

  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      slideToNextLoader();
    }, 1500);

    const navigation = setTimeout(() => {
      navigateToMenu();
    }, 4000);

    return () => {
      clearTimeout(animationTimeout);
      clearTimeout(navigation);
    };
  }, []);

  const slideToNextLoader = () => {
    Animated.parallel([
      Animated.timing(slideAnimation1, {
        toValue: -Dimensions.get('window').width,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation2, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentLoader(1);
    });
  };

  const navigateToMenu = () => {
    setCurrentLoader(2);
  };

  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 1000,
          }}>
          {/* {currentLoader < 2 ? (
            <Stack.Screen name="Welcome" options={{headerShown: false}}>
              {() => (
                <View style={{flex: 1, backgroundColor: '#000'}}>
                  <Animated.Image
                    source={loaders[0]}
                    style={[
                      {
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                      },
                      {
                        transform: [{translateX: slideAnimation1}],
                      },
                    ]}
                  />
                  <Animated.Image
                    source={loaders[1]}
                    style={[
                      {
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                      },
                      {
                        transform: [{translateX: slideAnimation2}],
                      },
                    ]}
                  />
                </View>
              )}
            </Stack.Screen>
          ) : (
          )} */}
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
          <Stack.Screen name="TabScreens" component={TabScreens} />
          <Stack.Screen name="StackSpotCreateScreen" component={StackSpotCreateScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

export default App;
