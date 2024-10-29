import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import SunCalc from 'suncalc';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

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
        {/* Ocean-themed Date Header */}
        <LinearGradient
          colors={['#003366', '#004d99', '#0066cc']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.dateHeaderGradient}
        >
          <View style={styles.dateHeaderContent}>
            <Icon name="calendar-clock" size={28} color="#ffd700" />
            <Text style={styles.currentDateText}>{formatCurrentDate()}</Text>
          </View>
        </LinearGradient>

        {/* Weather Card with Ocean Theme */}
        <LinearGradient
          colors={['#e6f3ff', '#cce6ff', '#b3d9ff']}
          style={styles.weatherGradient}
        >
          <View style={styles.weatherContent}>
            <View style={styles.weatherIconContainer}>
              <LinearGradient
                colors={['rgba(0, 102, 204, 0.1)', 'rgba(0, 102, 204, 0.2)']}
                style={styles.iconBackground}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
              >
                <Icon 
                  name={getWeatherIcon(selectedMoonPhase.weather.weather[0].id)} 
                  size={70} 
                  color="#003366" 
                />
              </LinearGradient>
              <View style={styles.temperatureContainer}>
                <Text style={styles.bigTemperature}>
                  {Math.round(selectedMoonPhase.weather.main.temp)}°
                </Text>
                <Text style={styles.celsiusLabel}>C</Text>
              </View>
            </View>

            <Text style={styles.weatherMainText}>
              {selectedMoonPhase.weather.weather[0].main}
            </Text>
            <Text style={styles.weatherDescriptionText}>
              {selectedMoonPhase.weather.weather[0].description.charAt(0).toUpperCase() + 
               selectedMoonPhase.weather.weather[0].description.slice(1)}
            </Text>

            {/* Weather Details Card with Ocean Theme */}
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.9)', 'rgba(230, 243, 255, 0.9)']}
              style={styles.weatherDetailsCard}
            >
              <View style={styles.weatherDetailsRow}>
                <View style={styles.weatherDetailItem}>
                  <Icon name="water-percent" size={28} color="#003366" />
                  <Text style={styles.detailLabel}>Humidity</Text>
                  <Text style={styles.detailValue}>
                    {selectedMoonPhase.weather.main.humidity}%
                  </Text>
                </View>
                <View style={styles.verticalDivider} />
                <View style={styles.weatherDetailItem}>
                  <Icon name="weather-windy" size={28} color="#003366" />
                  <Text style={styles.detailLabel}>Wind Speed</Text>
                  <Text style={styles.detailValue}>
                    {Math.round(selectedMoonPhase.weather.wind.speed * 3.6)} km/h
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </LinearGradient>
      </View>
    );
  };

  // Custom arrow components using Vector Icons
  const CustomLeftArrow = () => (
    <Icon name="chevron-left" size={30} color="#003366" />
  );

  const CustomRightArrow = () => (
    <Icon name="chevron-right" size={30} color="#003366" />
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#003366', '#004d99', '#0066cc']}
        style={styles.gradientBackground}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <View style={styles.content}>
            <CalendarStrip
              scrollable
              style={styles.calendarStrip}
              calendarColor={'#FFFFFF'}
              calendarHeaderStyle={styles.calendarHeader}
              dateNumberStyle={styles.dateNumber}
              dateNameStyle={styles.dateName}
              highlightDateNumberStyle={styles.highlightDateNumber}
              highlightDateNameStyle={styles.highlightDateName}
              disabledDateNameStyle={styles.disabledDateName}
              disabledDateNumberStyle={styles.disabledDateNumber}
              iconContainer={styles.iconContainer}
              maxDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
              minDate={new Date('1979-01-01')}
              selectedDate={new Date()}
              onDateSelected={handleDateSelected}
              leftSelector={<CustomLeftArrow />}
              rightSelector={<CustomRightArrow />}
              useIsoWeekday={false}
              styleWeekend={true}
              showMonth={true}
              monthHeaderStyle={styles.monthHeader}
            />
            
            {renderCurrentDateWeather()}

            {selectedMoonPhase && (
              <View style={styles.moonInfoContainer}>
                <Text style={styles.selectedDateText}>
                  {selectedMoonPhase.date}
                </Text>
                <Text style={styles.moonPhaseText}>
                  {selectedMoonPhase.text}
                </Text>
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
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 15,
  },
  calendarStrip: {
    marginTop:50,
    height: 120,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#f5f8ff', // Light blue background
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 51, 102, 0.1)',
  },
  calendarHeader: {
    color: '#003366',
    fontSize: 16,
    fontWeight: '600',
  },
  monthHeader: {
    color: '#003366',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 5,
  },
  dateNumber: {
    color: '#003366',
    fontSize: 16,
    fontWeight: '500',
  },
  dateName: {
    color: '#004d99',
    fontSize: 12,
    marginTop: 3,
  },
  highlightDateNumber: {
    color: '#ffffff',
    backgroundColor: '#003366',
    borderRadius: 20,
    overflow: 'hidden',
    paddingVertical: 5,
    paddingHorizontal: 8,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  highlightDateName: {
    color: '#ffd700', // Gold color for highlighted date name
    fontSize: 12,
    fontWeight: 'bold',
  },
  disabledDateName: {
    color: 'rgba(0, 51, 102, 0.3)', // Faded ocean blue
  },
  disabledDateNumber: {
    color: 'rgba(0, 51, 102, 0.3)', // Faded ocean blue
  },
  iconContainer: {
    flex: 0.1,
    paddingHorizontal: 10,
  },
  weekendDateName: {
    color: '#0066cc', // Slightly different blue for weekends
  },
  weekendDateNumber: {
    color: '#0066cc', // Slightly different blue for weekends
  },
  infoContainer: {
    padding: 15,
  },
  moonInfoContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)', // subtle gold border
  },
  selectedDateText: {
    fontSize: 16,
    color: '#004d99',
    marginBottom: 10,
    textAlign: 'center',
  },
  moonPhaseText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  illuminationContainer: {
    width: '100%',
    alignItems: 'center',
  },
  illuminationText: {
    fontSize: 16,
    color: '#004d99',
    marginBottom: 10,
    textAlign: 'center',
  },
  illuminationBar: {
    height: 8,
    backgroundColor: '#ffd700',
    borderRadius: 4,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  currentDateContainer: {
    marginTop: 15,
    marginHorizontal: 15,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    backgroundColor: '#fff',
  },
  dateHeaderGradient: {
    width: '100%',
  },
  dateHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.3)', // subtle gold line
  },
  currentDateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffd700', // gold text
    marginLeft: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  weatherGradient: {
    borderTopWidth: 2,
    borderTopColor: 'rgba(255, 215, 0, 0.2)', // subtle gold border
  },
  weatherContent: {
    padding: 20,
  },
  iconBackground: {
    padding: 15,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)', // subtle gold border
  },
  weatherIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 20,
  },
  bigTemperature: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#003366', // deep ocean blue
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  celsiusLabel: {
    fontSize: 24,
    color: '#003366',
    marginTop: 8,
    fontWeight: '500',
  },
  weatherMainText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  weatherDescriptionText: {
    fontSize: 18,
    color: '#004d99',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  weatherDetailsCard: {
    borderRadius: 15,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)', // subtle gold border
  },
  weatherDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  weatherDetailItem: {
    alignItems: 'center',
    flex: 1,
    padding: 10,
  },
  verticalDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(0, 51, 102, 0.2)', // subtle ocean blue divider
  },
  detailLabel: {
    fontSize: 16,
    color: '#004d99',
    marginTop: 8,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    marginTop: 5,
  },
});

export default TabMoonScreen;