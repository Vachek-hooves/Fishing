import React, { useState } from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {AppProvider} from './store/context';
import {TabMapScreen, WelcomeScreen,TabMoonScreen,TabWeatherScreen,TabSpotsScreen} from './screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {View} from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabScreens = () => {
  const [focusedScreen, setFocusedScreen] = useState('TabMapScreen');

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
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <LinearGradient
            colors={getTabBarGradient()}
            style={{ height: '100%' }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        ),
        tabBarActiveTintColor: focusedScreen === 'TabMoonScreen' ? '#003366' : '#ffd700',
        tabBarInactiveTintColor: focusedScreen === 'TabMoonScreen' 
          ? 'rgba(0, 51, 102, 0.5)' 
          : 'rgba(255, 215, 0, 0.5)',
      }}
      screenListeners={{
        state: (e) => {
          const route = e.data.state.routes[e.data.state.index];
          setFocusedScreen(route.name);
        },
      }}
    >
      <Tab.Screen
        name="TabMapScreen"
        component={TabMapScreen}
        options={{
          tabBarIcon: ({color,  focused}) => (
         
            <View style={styles.iconContainer}>
              <Icon 
                name="map-marker" 
                color={color} 
                size={34} // Explicit size
                style={[
                  styles.icon,
                  focused && styles.activeIcon
                ]}
              />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
          tabBarLabel: 'Map',
        }}
      />
      <Tab.Screen
        name="TabMoonScreen"
        component={TabMoonScreen}
        options={{
          tabBarIcon: ({color, focused}) => (
            <View style={styles.iconContainer}>
              <Icon 
                name="moon-waning-crescent" 
                color={color} 
                size={34} // Explicit size
                style={[
                  styles.icon,
                  focused && styles.activeIcon
                ]}
              />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
          tabBarLabel: 'Moon',
        }}
      />
      <Tab.Screen
        name="TabWeatherScreen"
        component={TabWeatherScreen}
        options={{
          tabBarIcon: ({color, focused}) => (
            <View style={styles.iconContainer}>
              <Icon 
                name="weather-sunny" 
                color={color} 
                size={34}// Explicit size
                style={[
                  styles.icon,
                  focused && styles.activeIcon
                ]}
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
          tabBarIcon: ({color, focused}) => (
            <View style={styles.iconContainer}>
              <Icon 
                name="map-marker-radius" 
                color={color} 
                size={34} // Explicit size
                style={[
                  styles.icon,
                  focused && styles.activeIcon
                ]}
              />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
          tabBarLabel: 'Spots',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = {
  tabBar: {
    height: 95,
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
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
    paddingBottom: 15,
    
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
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    
  },
  activeIcon: {
    transform: [{ scale: 1.3 }],
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -10,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: props => props.focused === 'TabMoonScreen' ? '#003366' : '#ffd700',
  },
};

function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 1000,
          }}>
          <Stack.Screen name="TabScreens" component={TabScreens} />
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

export default App;
