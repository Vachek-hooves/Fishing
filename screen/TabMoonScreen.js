import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import SunCalc from 'suncalc';

const TabMoonScreen = () => {
  const [selectedMoonPhase, setSelectedMoonPhase] = useState(null);

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

  const handleDateSelected = (date) => {
    // Convert moment object to JavaScript Date
    const jsDate = date.toDate();
    
    const moonInfo = SunCalc.getMoonIllumination(jsDate);
    const phaseText = getMoonPhaseText(moonInfo.phase);
    setSelectedMoonPhase({
      phase: moonInfo.phase,
      text: phaseText,
      illumination: Math.round(moonInfo.fraction * 100),
      date: jsDate.toDateString()
    });
  };

  const { startDate, endDate } = getMonthDates();

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
      
      {selectedMoonPhase && (
        <View style={styles.moonInfoContainer}>
          <Text style={styles.selectedDateText}>{selectedMoonPhase.date}</Text>
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
  moonInfoContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    margin: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
});

export default TabMoonScreen;