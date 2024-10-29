import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider } from './store/context';
import WelcomeScreen from './screen/WelcomeScreen';



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function App() {
    return (
        <AppProvider>
          <NavigationContainer >
            <Stack.Navigator screenOptions={{headerShown: false,animation:'fade',animationDuration: 1000}}>
              <Stack.Screen name='WelcomeScreen' component={WelcomeScreen}/>
            </Stack.Navigator>
          </NavigationContainer>
        </AppProvider>
    );
}

export default App