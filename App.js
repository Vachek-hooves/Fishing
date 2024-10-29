import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {AppProvider} from './store/context';
import {TabMapScreen, WelcomeScreen,TabMoonScreen,TabWeatherScreen,TabSpotsScreen} from './screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabScreens = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="TabMapScreen"
        component={TabMapScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="map-marker" color={color} size={size} />
          ),
          tabBarLabel: 'Map',
        }}
      />
      <Tab.Screen
        name="TabMoonScreen"
        component={TabMoonScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="moon-waning-crescent" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen name="TabWeatherScreen" component={TabWeatherScreen} 
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="weather-sunny" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="TabSpotsScreen"
        component={TabSpotsScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="map-marker-radius" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
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
