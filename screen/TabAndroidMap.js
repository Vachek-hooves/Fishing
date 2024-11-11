import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  PermissionsAndroid,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Fish from 'react-native-vector-icons/Ionicons';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import { useAppContext } from '../store/context';

const DEFAULT_LOCATION = {
  latitude: 37.7749, // San Francisco coordinates
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const TabAndroidMap = () => {
  const { spots, location, updateLocation } = useAppContext();
  const [initialRegion, setInitialRegion] = useState(DEFAULT_LOCATION);
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [usingDefaultLocation, setUsingDefaultLocation] = useState(false);

  useEffect(() => {
    // checkLocationPermission();
  }, []);

  // const checkLocationPermission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       {
  //         title: 'Location Permission',
  //         message: 'This app needs access to your location to show nearby fishing spots.',
  //         buttonPositive: 'OK',
  //         buttonNegative: 'Cancel',
  //       }
  //     );

  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       getCurrentLocation();
  //     } else {
  //       console.log('Location permission denied');
  //       useDefaultLocation();
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //     useDefaultLocation();
  //   }
  // };

  // const getCurrentLocation = () => {
  //   Geolocation.getCurrentPosition(
  //     (position) => {
  //       const { latitude, longitude } = position.coords;
  //       const newRegion = {
  //         latitude,
  //         longitude,
  //         latitudeDelta: 0.0922,
  //         longitudeDelta: 0.0421,
  //       };
  //       setInitialRegion(newRegion);
  //       updateLocation({ latitude, longitude }, false);
  //       setIsLoading(false);
  //       setLocationError(false);
  //     },
  //     (error) => {
  //       console.log(error.code, error.message);
  //       setLocationError(true);
  //       useDefaultLocation();
  //     },
  //     { 
  //       enableHighAccuracy: true,
  //       timeout: 15000,
  //       maximumAge: 10000 
  //     }
  //   );
  // };

  const useDefaultLocation = () => {
    setUsingDefaultLocation(true);
    setInitialRegion(DEFAULT_LOCATION);
    updateLocation({
      latitude: DEFAULT_LOCATION.latitude,
      longitude: DEFAULT_LOCATION.longitude
    }, true);
    setIsLoading(false);
  };

  const retryLocation = () => {
    setIsLoading(true);
    checkLocationPermission();
  };

  const handleMarkerPress = (marker) => {
    // Handle marker press - you can implement your own logic here
    Alert.alert(marker.title, marker.description || 'No description available');
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      {initialRegion && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={!usingDefaultLocation}
          showsMyLocationButton={true}
          showsCompass={true}
          showsScale={true}
        >
          {spots && spots.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
              onPress={() => handleMarkerPress(marker)}
            >
              <View style={styles.markerContainer}>
                <Fish name="fish" size={40} color="#08313a" />
                {marker.title && (
                  <View style={styles.markerLabelContainer}>
                    <Text style={styles.markerLabel}>{marker.title}</Text>
                  </View>
                )}
              </View>
            </Marker>
          ))}
        </MapView>
      )}

      {/* {usingDefaultLocation && (
        <TouchableOpacity 
          style={styles.enableLocationButton}
          onPress={retryLocation}
        >
          <Icon name="my-location" size={24} color="white" />
          <Text style={styles.enableLocationText}>Enable Location</Text>
        </TouchableOpacity>
      )} */}
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
  markerContainer: {
    alignItems: 'center',
  },
  markerLabelContainer: {
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 4,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#004B87',
  },
  markerLabel: {
    color: '#004B87',
    fontSize: 12,
    fontWeight: 'bold',
  },
  enableLocationButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 25,
    elevation: 3,
  },
  enableLocationText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold',
  },
});

export default TabAndroidMap;