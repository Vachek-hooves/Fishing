import React, { useState, useEffect, useCallback } from 'react';
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
// import Geolocation from 'react-native-geolocation-service';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Fish from 'react-native-vector-icons/Ionicons';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import { useAppContext } from '../store/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FishingSpotModal from '../components/MapScreen/FishingSpotModal';
import MarkerDetailsModal from '../components/MapScreen/MarkerDetailsModal';

const DEFAULT_LOCATION = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

Geolocation.getCurrentPosition(info=>console.log(info))

const TabAndroidMap = () => {
  const { spots, updateSpots } = useAppContext();
  
  // States
  const [region, setRegion] = useState(DEFAULT_LOCATION);
  const [isLoading, setIsLoading] = useState(true);
  const [usingDefaultLocation, setUsingDefaultLocation] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [newMarkerCoordinate, setNewMarkerCoordinate] = useState(null);

  // Load markers
  const loadMarkers = useCallback(async () => {
    try {
      const savedSpots = await AsyncStorage.getItem('fishingSpots');
      if (savedSpots) {
        updateSpots(JSON.parse(savedSpots));
      }
    } catch (error) {
      console.error('Error loading markers:', error);
    }
  }, [updateSpots]);

  // Location handling
  const setupLocation = useCallback(async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setRegion({
              latitude,
              longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
            setUsingDefaultLocation(false);
          },
          (error) => {
            console.log(error);
            Alert.alert('Error', 'Unable to get location');
          },
          { 
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 10000
          }
        );
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize
  useEffect(() => {
    const initialize = async () => {
      await loadMarkers();
      await setupLocation();
    };
    initialize();
  }, [loadMarkers, setupLocation]);

  // Handlers
  const handleMapLongPress = useCallback((event) => {
    setNewMarkerCoordinate(event.nativeEvent.coordinate);
    setModalVisible(true);
  }, []);

  const handleMarkerPress = useCallback((marker) => {
    setSelectedMarker(marker);
    setDetailsModalVisible(true);
  }, []);

  const retryLocation = useCallback(() => {
    setIsLoading(true);
    setupLocation();
  }, [setupLocation]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={!usingDefaultLocation}
        showsMyLocationButton={true}
        onLongPress={handleMapLongPress}
      >
        {spots?.map((marker) => (
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

      {usingDefaultLocation && (
        <TouchableOpacity 
          style={styles.locationButton}
          onPress={retryLocation}
        >
          <Icon name="my-location" size={24} color="white" />
          <Text style={styles.locationButtonText}>Get My Location</Text>
        </TouchableOpacity>
      )}

      <FishingSpotModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setNewMarkerCoordinate(null);
        }}
        coordinate={newMarkerCoordinate}
        spots={spots}
        updateSpots={updateSpots}
      />

      <MarkerDetailsModal
        visible={detailsModalVisible}
        onClose={() => {
          setDetailsModalVisible(false);
          setSelectedMarker(null);
        }}
        marker={selectedMarker}
        spots={spots}
        updateSpots={updateSpots}
      />
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
  locationButton: {
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
  locationButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold',
  },
});

export default TabAndroidMap;