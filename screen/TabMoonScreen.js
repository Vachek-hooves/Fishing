import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import SunCalc from 'suncalc';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const API_KEY = 'da09552db9dee8853551090775811fb7';

const TabMoonScreen = () => {
  const [selectedMoonPhase, setSelectedMoonPhase] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (pos) => resolve(pos),
          (error) => reject(error),
          { 
            enableHighAccuracy: true, 
            timeout: 20000,
            maximumAge: 1000,
          }
        );
      });
      
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Location error:', error);
      setIsLoading(false);
    }
  };

  const fetchHistoricalWeather = async (date, lat, lon) => {
    const timestamp = Math.floor(date.getTime() / 1000);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&dt=${timestamp}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Weather fetch error:', error);
      return null;
    }
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

  const handleDateSelected = async (date) => {
    const jsDate = date.toDate();
    
    // Get moon information
    const moonInfo = SunCalc.getMoonIllumination(jsDate);
    const phaseText = getMoonPhaseText(moonInfo.phase);
    
    // Get weather information if location is available
    let weatherInfo = null;
    if (location) {
      weatherInfo = await fetchHistoricalWeather(
        jsDate,
        location.latitude,
        location.longitude
      );
    }

    setSelectedMoonPhase({
      phase: moonInfo.phase,
      text: phaseText,
      illumination: Math.round(moonInfo.fraction * 100),
      date: jsDate.toDateString(),
      weather: weatherInfo
    });
  };

  // Get start and end dates for the current month
  const getMonthDates = () => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return { startDate, endDate };
  };

  const getMoonPhaseText = (phase) => {
    if (phase <= 0.05 || phase > 0.95) return 'New Moon 🌑';
    if (phase <= 0.20) return 'Waxing Crescent 🌒';
    if (phase <= 0.30) return 'First Quarter 🌓';
    if (phase <= 0.45) return 'Waxing Gibbous 🌔';
    if (phase <= 0.55) return 'Full Moon 🌕';
    if (phase <= 0.70) return 'Waning Gibbous 🌖';
    if (phase <= 0.80) return 'Last Quarter 🌗';
    return 'Waning Crescent 🌘';
  };

  const { startDate, endDate } = getMonthDates();

  const formatCurrentDate = () => {
    const now = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return now.toLocaleDateString('en-US', options);
  };

  const renderCurrentDateWeather = () => {
    if (!location || !selectedMoonPhase?.weather) return null;

    return (
      <View style={styles.currentDateContainer}>
        <View style={styles.dateHeaderContainer}>
          <Icon name="calendar-today" size={24} color="#0066ff" />
          <Text style={styles.currentDateText}>{formatCurrentDate()}</Text>
        </View>
        <View style={styles.currentWeatherCard}>
          <View style={styles.weatherIconContainer}>
            <Icon 
              name={getWeatherIcon(selectedMoonPhase.weather.weather[0].id)} 
              size={60} 
              color="#0066ff" 
            />
            <Text style={styles.bigTemperature}>
              {Math.round(selectedMoonPhase.weather.main.temp)}°
            </Text>
          </View>
          <Text style={styles.weatherMainText}>
            {selectedMoonPhase.weather.weather[0].main}
          </Text>
          <Text style={styles.weatherDescriptionText}>
            {selectedMoonPhase.weather.weather[0].description.charAt(0).toUpperCase() + 
             selectedMoonPhase.weather.weather[0].description.slice(1)}
          </Text>
          <View style={styles.weatherDetailsRow}>
            <View style={styles.weatherDetailItem}>
              <Icon name="water-percent" size={24} color="#0066ff" />
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>
                {selectedMoonPhase.weather.main.humidity}%
              </Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.weatherDetailItem}>
              <Icon name="weather-windy" size={24} color="#0066ff" />
              <Text style={styles.detailLabel}>Wind Speed</Text>
              <Text style={styles.detailValue}>
                {Math.round(selectedMoonPhase.weather.wind.speed * 3.6)} km/h
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CalendarStrip
        style={styles.calendar}
        daySelectionAnimation={{
          type: 'border',
          duration: 200,
          borderWidth: 1,
          borderHighlightColor: '#0066ff'
        }}
        onDateSelected={handleDateSelected}
        scrollable
        startingDate={startDate}
        minDate={startDate}
        maxDate={endDate}
        calendarAnimation={{ type: 'sequence', duration: 30 }}
        dateNumberStyle={styles.dateNumber}
        dateNameStyle={styles.dateName}
        highlightDateNumberStyle={styles.highlightDate}
        highlightDateNameStyle={styles.highlightDateName}
        calendarHeaderStyle={styles.calendarHeader}
        calendarColor={'#ffffff'}
        dateContainerStyle={styles.dateContainer}
        iconContainer={{ flex: 0.1 }}
        numDaysInWeek={7}
      />
      
      {renderCurrentDateWeather()}
      
      {selectedMoonPhase && (
        <View style={styles.infoContainer}>
          <Text style={styles.selectedDateText}>{selectedMoonPhase.date}</Text>
          
          {/* Moon Information */}
          <View style={styles.moonInfoContainer}>
            <Text style={styles.moonPhaseText}>{selectedMoonPhase.text}</Text>
            <View style={styles.illuminationContainer}>
              <Text style={styles.illuminationText}>
                Moon illumination: {selectedMoonPhase.illumination}%
              </Text>
              <View style={[
                styles.illuminationBar, 
                { width: `${selectedMoonPhase.illumination}%` }
              ]} />
            </View>
          </View>

          {/* Weather Information */}
          {selectedMoonPhase.weather && (
            <View style={styles.weatherContainer}>
              <View style={styles.weatherHeader}>
                <Icon 
                  name={getWeatherIcon(selectedMoonPhase.weather.weather[0].id)} 
                  size={40} 
                  color="#333" 
                />
                <Text style={styles.temperatureText}>
                  {Math.round(selectedMoonPhase.weather.main.temp)}°C
                </Text>
              </View>
              
              <Text style={styles.weatherDescription}>
                {selectedMoonPhase.weather.weather[0].description.charAt(0).toUpperCase() + 
                 selectedMoonPhase.weather.weather[0].description.slice(1)}
              </Text>

              <View style={styles.weatherDetails}>
                <View style={styles.weatherDetail}>
                  <Icon name="water-percent" size={20} color="#666" />
                  <Text style={styles.detailText}>
                    {selectedMoonPhase.weather.main.humidity}%
                  </Text>
                </View>

                <View style={styles.weatherDetail}>
                  <Icon name="weather-windy" size={20} color="#666" />
                  <Text style={styles.detailText}>
                    {Math.round(selectedMoonPhase.weather.wind.speed * 3.6)} km/h
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  calendar: {
    height: 150,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  calendarHeader: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  dateNumber: {
    color: '#000',
    fontSize: 14,
  },
  dateName: {
    color: '#666',
    fontSize: 12,
  },
  highlightDate: {
    color: '#0066ff',
    fontWeight: 'bold',
  },
  highlightDateName: {
    color: '#0066ff',
    fontWeight: 'bold',
  },
  dateContainer: {
    borderRadius: 8,
    padding: 5,
  },
  infoContainer: {
    padding: 15,
  },
  moonInfoContainer: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  weatherContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  temperatureText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  weatherDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  selectedDateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  moonPhaseText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  illuminationContainer: {
    width: '100%',
    alignItems: 'center',
  },
  illuminationText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  illuminationBar: {
    height: 8,
    backgroundColor: '#0066ff',
    borderRadius: 4,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  currentDateContainer: {
    padding: 15,
    backgroundColor: '#fff',
  },
  dateHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  currentDateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  currentWeatherCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  weatherIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  bigTemperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
  },
  weatherMainText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  weatherDescriptionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  weatherDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  weatherDetailItem: {
    alignItems: 'center',
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#eee',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 3,
  },
});

export default TabMoonScreen;