import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
  RefreshControl
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LoadingIndicator from '../components/ui/LoadingIndicator';

const API_KEY = 'da09552db9dee8853551090775811fb7'; // Get from openweathermap.org

const TabWeatherScreen = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    initializeWeather();
  }, []);

  const initializeWeather = async () => {
    await requestLocationPermission();
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const granted = await Geolocation.requestAuthorization('whenInUse');
        if (granted === 'granted') {
          await getCurrentLocation();
        } else {
          setLocationError(true);
          setIsLoading(false);
          Alert.alert(
            'Location Permission Required',
            'Please enable location permissions to get weather data',
            [{ text: 'OK' }]
          );
        }
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission Required',
            message: 'We need your location to show weather information',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          await getCurrentLocation();
        } else {
          setLocationError(true);
          setIsLoading(false);
          Alert.alert(
            'Location Permission Denied',
            'You need to enable location permissions to see weather data',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (err) {
      console.warn(err);
      setIsLoading(false);
      setLocationError(true);
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        async (position) => {
          try {
            await fetchWeatherData(position.coords.latitude, position.coords.longitude);
            setLocationError(false);
            resolve(position);
          } catch (error) {
            console.error('Error fetching weather:', error);
            setLocationError(true);
            reject(error);
          }
        },
        (error) => {
          console.log('Location error:', error);
          setLocationError(true);
          setIsLoading(false);
          reject(error);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 20000,
          maximumAge: 1000,
        }
      );
    });
  };

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();
      
      if (data.cod === 200) {
        setWeatherData(data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Weather fetch error:', error);
      Alert.alert('Error', 'Failed to fetch weather data');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await initializeWeather();
  };

  const getWeatherIcon = (weatherId) => {
    if (weatherId >= 200 && weatherId < 300) return 'weather-lightning';
    if (weatherId >= 300 && weatherId < 400) return 'weather-pouring';
    if (weatherId >= 500 && weatherId < 600) return 'weather-rainy';
    if (weatherId >= 600 && weatherId < 700) return 'weather-snowy';
    if (weatherId >= 700 && weatherId < 800) return 'weather-fog';
    if (weatherId === 800) return 'weather-sunny';
    if (weatherId > 800) return 'weather-cloudy';
    return 'weather-cloudy';
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingIndicator />
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }

  if (locationError) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="weather-cloudy-alert" size={50} color="#ff6b6b" />
        <Text style={styles.errorText}>Unable to get weather data</Text>
        <Text style={styles.errorSubText}>Please check your:</Text>
        <View style={styles.errorChecklist}>
          <Text style={styles.checklistItem}>• Internet connection</Text>
          <Text style={styles.checklistItem}>• Location services</Text>
          <Text style={styles.checklistItem}>• Location permissions</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {weatherData && (
        <View style={styles.weatherContainer}>
          <Text style={styles.location}>{weatherData.name}</Text>
          
          <View style={styles.mainWeather}>
            <Icon 
              name={getWeatherIcon(weatherData.weather[0].id)} 
              size={100} 
              color="#333" 
            />
            <Text style={styles.temperature}>
              {Math.round(weatherData.main.temp)}°C
            </Text>
          </View>

          <Text style={styles.description}>
            {weatherData.weather[0].description.charAt(0).toUpperCase() + 
             weatherData.weather[0].description.slice(1)}
          </Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Icon name="water-percent" size={24} color="#666" />
              <Text style={styles.detailText}>
                Humidity: {weatherData.main.humidity}%
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Icon name="weather-windy" size={24} color="#666" />
              <Text style={styles.detailText}>
                Wind: {Math.round(weatherData.wind.speed * 3.6)} km/h
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Icon name="thermometer" size={24} color="#666" />
              <Text style={styles.detailText}>
                Feels like: {Math.round(weatherData.main.feels_like)}°C
              </Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginTop: 10,
  },
  errorSubText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  errorChecklist: {
    marginTop: 20,
    alignItems: 'flex-start',
  },
  checklistItem: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5,
  },
  weatherContainer: {
    padding: 20,
    alignItems: 'center',
  },
  location: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  mainWeather: {
    alignItems: 'center',
    marginBottom: 20,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  description: {
    fontSize: 20,
    color: '#666',
    marginBottom: 30,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
});

export default TabWeatherScreen;
