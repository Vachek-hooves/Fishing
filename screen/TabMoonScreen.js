import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import SunCalc from 'suncalc';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {useAppContext} from '../store/context';
import FishingAdvice from '../components/MoonScreen/FishingAdvice';
import SunTimesInfo from '../components/MoonScreen/SunTimesInfo';

const TabMoonScreen = () => {
  const {location} = useAppContext();
  const [selectedMoonPhase, setSelectedMoonPhase] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (location && location.latitude && location.longitude) {
      handleDateSelected(selectedDate);
      // setIsLoading(false);
    }
  }, [location]);

  const handleDateSelected = date => {
    if (!location || !date) return;
    
    const selectedDate = date._d || new Date(date);
    setSelectedDate(selectedDate);

    const moonIllum = SunCalc.getMoonIllumination(selectedDate);
    const moonTimes = SunCalc.getMoonTimes(
      selectedDate,
      location.latitude,
      location.longitude,
    );

    setSelectedMoonPhase({
      phase: moonIllum.phase,
      illumination: Math.round(moonIllum.fraction * 100),
      angle: moonIllum.angle,
      times: moonTimes,
      date: selectedDate.toDateString(),
    });
  };

  const MoonVisualization = ({phase, illumination}) => {
    const size = Dimensions.get('window').width * 0.6;
    return (
      <View style={[styles.moonContainer, {width: size, height: size}]}>
        <LinearGradient
          colors={['#1a237e', '#000']}
          style={styles.moonBackground}>
          <View style={styles.moonPhase}>
            <LinearGradient
              colors={['#ffd700', '#ffa500']}
              style={[styles.moonLight, {opacity: illumination / 100}]}
            />
            <View style={[styles.moonShadow, getMoonShadowStyle(phase)]} />
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#003366', '#001f3f', '#000']}
        style={styles.container}>
        <View style={styles.calendarContainer}>
          <CalendarStrip
            scrollable
            style={styles.calendarStrip}
            calendarColor={'transparent'}
            calendarHeaderStyle={styles.calendarHeader}
            dateNumberStyle={styles.dateNumber}
            dateNameStyle={styles.dateName}
            highlightDateNumberStyle={styles.highlightDateNumber}
            highlightDateNameStyle={styles.highlightDateName}
            onDateSelected={handleDateSelected}
            useIsoWeekday={false}
            minDate={new Date().setDate(new Date().getDate() - 30)}
            maxDate={new Date().setDate(new Date().getDate() + 60)}
            selectedDate={selectedDate}
            daySelectionAnimation={{
              type: 'border',
              duration: 200,
              borderWidth: 1,
              borderHighlightColor: '#ffd700',
            }}
          />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleDateSelected}
              tintColor="#ffd700"
            />
          }>
          {selectedMoonPhase && location && (
            <>
              <View style={styles.moonInfoContainer}>
                <Text style={styles.dateText}>{selectedMoonPhase.date}</Text>

                <MoonVisualization
                  phase={selectedMoonPhase.phase}
                  illumination={selectedMoonPhase.illumination}
                />

                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Icon name="moon-full" size={30} color="#ffd700" />
                    <Text style={styles.infoLabel}>Illumin-ion</Text>
                    <Text style={styles.infoValue}>
                      {selectedMoonPhase.illumination}%
                    </Text>
                  </View>

                  {selectedMoonPhase.times.rise && (
                    <View style={styles.infoItem}>
                      <Icon
                        name="weather-sunset-up"
                        size={30}
                        color="#ffd700"
                      />
                      <Text style={styles.infoLabel}>Moonrise</Text>
                      <Text style={styles.infoValue}>
                        {selectedMoonPhase.times.rise.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                  )}

                  {selectedMoonPhase.times.set && (
                    <View style={styles.infoItem}>
                      <Icon
                        name="weather-sunset-down"
                        size={30}
                        color="#ffd700"
                      />
                      <Text style={styles.infoLabel}>Moonset</Text>
                      <Text style={styles.infoValue}>
                        {selectedMoonPhase.times.set.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <SunTimesInfo
                date={new Date(selectedMoonPhase.date)}
                latitude={location.latitude}
                longitude={location.longitude}
              />

              <FishingAdvice
                moonPhase={selectedMoonPhase.phase}
                weather="Clear"
              />
            </>
          )}
          {/* <View style={{height: 100}}></View> */}
        </ScrollView>
        <View style={{height: Platform.OS === 'ios' ? 90 : 130}}></View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#003366',
  },
  container: {
    flex: 1,
  },
  calendarContainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    marginBottom: 10,
  },
  calendarStrip: {
    height: 130,
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  calendarHeader: {
    color: '#fff',
    fontSize: 18,
  },
  dateNumber: {
    color: '#fff',
    fontSize: 16,
  },
  dateName: {
    color: '#fff',
  },
  highlightDateNumber: {
    color: '#ffd700',
  },
  highlightDateName: {
    color: '#ffd700',
  },
  moonInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  dateText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  moonContainer: {
    borderRadius: 999,
    overflow: 'hidden',
    marginVertical: 20,
    elevation: 10,
    shadowColor: '#ffd700',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  moonBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moonPhase: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ffd700',
  },
  moonLight: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  moonShadow: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#000',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  infoItem: {
    alignItems: 'center',
    width: '33%',
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
  },
  infoLabel: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
  },
  infoValue: {
    color: '#ffd700',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
});

const getMoonShadowStyle = phase => {
  const shadowWidth = '50%';
  if (phase <= 0.5) {
    return {
      left: 0,
      width: shadowWidth,
      transform: [{translateX: -50 * (1 - phase * 2) + '%'}],
    };
  } else {
    return {
      right: 0,
      width: shadowWidth,
      transform: [{translateX: 50 * (2 - phase * 2) + '%'}],
    };
  }
};

export default TabMoonScreen;
