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
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          pos => resolve(pos),
          error => reject(error),
          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000,
          },
        );
      });

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      
      // Fetch weather data after getting location
      await fetchWeatherData(position.coords.latitude, position.coords.longitude);
      setIsLoading(false);
    } catch (error) {
      console.error('Location error:', error);
      setIsLoading(false);
    }
  };

  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
      );
      const data = await response.json();
      console.log(data)
      
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
    if (location) {
      await fetchWeatherData(location.latitude, location.longitude);
    }
  };

  const getWeatherIcon = weatherId => {
    if (weatherId >= 200 && weatherId < 300) return 'weather-lightning';
    if (weatherId >= 300 && weatherId < 400) return 'weather-pouring';
    if (weatherId >= 500 && weatherId < 600) return 'weather-rainy';
    if (weatherId >= 600 && weatherId < 700) return 'weather-snowy';
    if (weatherId >= 700 && weatherId < 800) return 'weather-fog';
    if (weatherId === 800) return 'weather-sunny';
    if (weatherId > 800) return 'weather-cloudy';
    return 'weather-cloudy';
  };

  const formatTime = (timestamp, timezone) => {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    });
  };

  if (isLoading) {
    return <LoadingIndicator />;
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
          {/* Location Header */}
          <View style={styles.locationHeader}>
            <Text style={styles.location}>{weatherData.name}, {weatherData.sys.country}</Text>
            <Text style={styles.coordinates}>
              {weatherData.coord.lat.toFixed(2)}°N, {weatherData.coord.lon.toFixed(2)}°W
            </Text>
          </View>

          {/* Main Weather */}
          <View style={styles.mainWeather}>
            <Icon 
              name={getWeatherIcon(weatherData.weather[0].id)} 
              size={80} 
              color="#333" 
            />
            <View style={styles.tempContainer}>
              <Text style={styles.temperature}>{Math.round(weatherData.main.temp)}°C</Text>
              <Text style={styles.weatherDescription}>
                {weatherData.weather[0].description.charAt(0).toUpperCase() + 
                 weatherData.weather[0].description.slice(1)}
              </Text>
            </View>
          </View>

          {/* Temperature Details */}
          <View style={styles.tempDetails}>
            <View style={styles.tempItem}>
              <Text style={styles.tempLabel}>Feels Like</Text>
              <Text style={styles.tempValue}>{Math.round(weatherData.main.feels_like)}°C</Text>
            </View>
            <View style={styles.tempItem}>
              <Text style={styles.tempLabel}>Min</Text>
              <Text style={styles.tempValue}>{Math.round(weatherData.main.temp_min)}°C</Text>
            </View>
            <View style={styles.tempItem}>
              <Text style={styles.tempLabel}>Max</Text>
              <Text style={styles.tempValue}>{Math.round(weatherData.main.temp_max)}°C</Text>
            </View>
          </View>

          {/* Weather Details Grid */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailBox}>
              <Icon name="water-percent" size={24} color="#666" />
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>{weatherData.main.humidity}%</Text>
            </View>

            <View style={styles.detailBox}>
              <Icon name="weather-windy" size={24} color="#666" />
              <Text style={styles.detailLabel}>Wind Speed</Text>
              <Text style={styles.detailValue}>{Math.round(weatherData.wind.speed * 3.6)} km/h</Text>
            </View>

            <View style={styles.detailBox}>
              <Icon name="gauge" size={24} color="#666" />
              <Text style={styles.detailLabel}>Pressure</Text>
              <Text style={styles.detailValue}>{weatherData.main.pressure} hPa</Text>
            </View>

            <View style={styles.detailBox}>
              <Icon name="eye" size={24} color="#666" />
              <Text style={styles.detailLabel}>Visibility</Text>
              <Text style={styles.detailValue}>{(weatherData.visibility / 1000).toFixed(1)} km</Text>
            </View>
          </View>

          {/* Additional Details */}
          <View style={styles.additionalDetails}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <View style={styles.additionalDetailsGrid}>
              <View style={styles.additionalDetailBox}>
                <Icon name="cloud" size={24} color="#003366" />
                <Text style={styles.additionalDetailLabel}>Cloud Cover</Text>
                <Text style={styles.additionalDetailValue}>{weatherData.clouds.all}%</Text>
              </View>
              
              {weatherData.wind.gust && (
                <View style={styles.additionalDetailBox}>
                  <Icon name="weather-windy" size={24} color="#003366" />
                  <Text style={styles.additionalDetailLabel}>Wind Gust</Text>
                  <Text style={styles.additionalDetailValue}>
                    {Math.round(weatherData.wind.gust * 3.6)} km/h
                  </Text>
                </View>
              )}
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
    backgroundColor: '#f0f8ff', // Light blue background
  },
  weatherContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#003366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)', // Subtle gold border
  },
  locationHeader: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#003366',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  location: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffd700', // Gold text
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  coordinates: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  mainWeather: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(0, 51, 102, 0.05)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  tempContainer: {
    marginLeft: 20,
    alignItems: 'center',
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#003366', // Deep blue
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  weatherDescription: {
    fontSize: 18,
    color: '#004d99', // Medium blue
    marginTop: 4,
    fontWeight: '500',
  },
  tempDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 15,
    backgroundColor: '#003366',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tempItem: {
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 215, 0, 0.3)',
  },
  tempLabel: {
    fontSize: 14,
    color: '#ffd700', // Gold
    fontWeight: '500',
  },
  tempValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailBox: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 51, 102, 0.1)',
    shadowColor: '#003366',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailLabel: {
    fontSize: 14,
    color: '#003366',
    marginTop: 8,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004d99',
    marginTop: 4,
  },
  additionalDetails: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)', // Subtle gold border
    shadowColor: '#003366',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 12,
    textAlign: 'center',
  },
  additionalDetailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  additionalDetailBox: {
    width: '45%',
    backgroundColor: 'rgba(0, 51, 102, 0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  additionalDetailLabel: {
    fontSize: 14,
    color: '#003366',
    marginTop: 8,
    fontWeight: '500',
  },
  additionalDetailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004d99',
    marginTop: 4,
  },
});

export default TabWeatherScreen;
