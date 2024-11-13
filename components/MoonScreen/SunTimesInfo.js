import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SunCalc from 'suncalc';

const SunTimesInfo = ({ date, latitude, longitude }) => {
    const sunTimes = SunCalc.getTimes(date, latitude, longitude);
    const sunPosition = SunCalc.getPosition(date, latitude, longitude);
  
    return (
      <View style={styles.sunInfoContainer}>
        <Text style={styles.sunInfoTitle}>Sun Information</Text>
        
        <View style={styles.sunTimesGrid}>
          <View style={styles.sunTimeItem}>
            <Icon name="weather-sunset-up" size={24} color="#ffd700" />
            <Text style={styles.sunTimeLabel}>Sunrise</Text>
            <Text style={styles.sunTimeValue}>{formatTime(sunTimes.sunrise)}</Text>
          </View>
  
          <View style={styles.sunTimeItem}>
            <Icon name="weather-sunset-down" size={24} color="#ffd700" />
            <Text style={styles.sunTimeLabel}>Sunset</Text>
            <Text style={styles.sunTimeValue}>{formatTime(sunTimes.sunset)}</Text>
          </View>
  
          <View style={styles.sunTimeItem}>
            <Icon name="weather-night" size={24} color="#ffd700" />
            <Text style={styles.sunTimeLabel}>Night Start</Text>
            <Text style={styles.sunTimeValue}>{formatTime(sunTimes.night)}</Text>
          </View>
  
          <View style={styles.sunTimeItem}>
            <Icon name="weather-sunset" size={24} color="#ffd700" />
            <Text style={styles.sunTimeLabel}>Dawn</Text>
            <Text style={styles.sunTimeValue}>{formatTime(sunTimes.dawn)}</Text>
          </View>
  
          <View style={styles.sunTimeItem}>
            <Icon name="star-face" size={24} color="#ffd700" />
            <Text style={styles.sunTimeLabel}>Nautical Dusk</Text>
            <Text style={styles.sunTimeValue}>{formatTime(sunTimes.nauticalDusk)}</Text>
          </View>
  
          <View style={styles.sunTimeItem}>
            <Icon name="brightness-5" size={24} color="#ffd700" />
            <Text style={styles.sunTimeLabel}>Night End</Text>
            <Text style={styles.sunTimeValue}>{formatTime(sunTimes.nightEnd)}</Text>
          </View>
        </View>
  
        <View style={styles.sunPositionContainer}>
          <Text style={styles.sunPositionTitle}>Sun Position</Text>
          <Text style={styles.sunPositionText}>
            Altitude: {Math.round(sunPosition.altitude * 180 / Math.PI)}°
          </Text>
          <Text style={styles.sunPositionText}>
            Azimuth: {Math.round(sunPosition.azimuth * 180 / Math.PI)}°
          </Text>
        </View>
      </View>
    );
  };

export default SunTimesInfo

const formatTime = (date) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

const styles = StyleSheet.create({sunInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
  },
  sunInfoTitle: {
    fontSize: 20,
    color: '#ffd700',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  sunTimesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sunTimeItem: {
    width: '48%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  sunTimeLabel: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    opacity: 0.9,
  },
  sunTimeValue: {
    color: '#ffd700',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  sunPositionContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  sunPositionTitle: {
    color: '#ffd700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  sunPositionText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
  },})