import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Platform, PermissionsAndroid, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TabMapScreen = () => {
  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    loadMarkers();
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const granted = await Geolocation.requestAuthorization('whenInUse');
        if (granted === 'granted') {
          getCurrentLocation();
        } else {
          Alert.alert(
            'Location Permission Required',
            'Please enable location permissions in settings',
            [{ text: 'OK' }]
          );
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
          getCurrentLocation();
        } else {
          Alert.alert(
            'Location Permission Denied',
            'You need to enable location permissions to see your position on the map',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (err) {
      console.warn(err);
    }
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

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      (error) => {
        console.log(error);
        Alert.alert(
          'Error',
          'Unable to get your location. Please check your settings.',
          [{ text: 'OK' }]
        );
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 10000 
      }
    );
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

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onLongPress={handleMapLongPress}
        showsUserLocation={true}
        showsMyLocationButton={true}
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
});

export default TabMapScreen;