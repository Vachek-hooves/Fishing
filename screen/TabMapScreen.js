import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Platform, PermissionsAndroid, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TabMapScreen = () => {
  const [markers, setMarkers] = useState([]);
  const [initialRegion, setInitialRegion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeMap = async () => {
      await loadMarkers();
      await requestLocationPermission();
    };

    initializeMap();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const granted = await Geolocation.requestAuthorization('whenInUse');
        if (granted === 'granted') {
          await getCurrentLocation();
        } else {
          Alert.alert(
            'Location Permission Required',
            'Please enable location permissions in settings',
            [{ text: 'OK' }]
          );
          setIsLoading(false);
        }
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission Required',
            message: 'This app needs to access your location to show fishing spots near you',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          await getCurrentLocation();
        } else {
          Alert.alert(
            'Location Permission Denied',
            'You need to enable location permissions to see your position on the map',
            [{ text: 'OK' }]
          );
          setIsLoading(false);
        }
      }
    } catch (err) {
      console.warn(err);
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          setInitialRegion(region);
          setIsLoading(false);
          resolve(position);
        },
        (error) => {
          console.log(error);
          Alert.alert(
            'Error',
            'Unable to get your location. Please check your settings.',
            [{ text: 'OK' }]
          );
          setIsLoading(false);
          reject(error);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 10000 
        }
      );
    });
  };

  const loadMarkers = async () => {
    try {
      const savedMarkers = await AsyncStorage.getItem('fishingSpots');
      if (savedMarkers) {
        setMarkers(JSON.parse(savedMarkers));
      }
    } catch (error) {
      console.error('Error loading markers:', error);
    }
  };

  const handleMapLongPress = async (e) => {
    const newMarker = {
      id: Date.now(),
      coordinate: e.nativeEvent.coordinate,
      title: 'New Fishing Spot',
      description: 'Tap to add details',
    };

    const updatedMarkers = [...markers, newMarker];
    setMarkers(updatedMarkers);

    try {
      await AsyncStorage.setItem('fishingSpots', JSON.stringify(updatedMarkers));
    } catch (error) {
      console.error('Error saving marker:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {initialRegion && (
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onLongPress={handleMapLongPress}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
            />
          ))}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TabMapScreen;