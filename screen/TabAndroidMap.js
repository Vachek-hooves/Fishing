import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  PermissionsAndroid,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Fish from 'react-native-vector-icons/Ionicons';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import {useAppContext} from '../store/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FishingSpotModal from '../components/MapScreen/FishingSpotModal';
import MarkerDetailsModal from '../components/MapScreen/MarkerDetailsModal';
import MapPressNotice from '../components/notice/MapPressNotice';

const DEFAULT_LOCATION = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const TabAndroidMap = ({navigation}) => {
  const {spots, updateSpots, location, updateLocation} = useAppContext();
  const mapRef = useRef(null);
  const locationInitialized = useRef(false);

  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [newMarkerCoordinate, setNewMarkerCoordinate] = useState(null);

  // Configure Geolocation
  useEffect(() => {
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse',
      locationProvider: 'auto',
    });
  }, []);

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

  const getCurrentLocation = useCallback(async () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          const newRegion = {
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          updateLocation(newRegion, false);
          setIsLoading(false);
          resolve(newRegion);
        },
        error => {
          console.log('Location error:', error);
          setIsLoading(false);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    });
  }, [updateLocation]);

  const setupLocation = useCallback(async () => {
    if (locationInitialized.current) return;
    
    try {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (!hasPermission) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setIsLoading(false);
          return;
        }
      }

      await getCurrentLocation();
      locationInitialized.current = true;
    } catch (err) {
      console.warn('Location permission error:', err);
      setIsLoading(false);
    }
  }, [getCurrentLocation]);

  useEffect(() => {
    const initialize = async () => {
      await loadMarkers();
      await setupLocation();
    };
    initialize();
  }, [loadMarkers, setupLocation]);

  const handleMapLongPress = useCallback(event => {
    navigation.navigate('StackSpotCreateScreen', {
      coordinate: event.nativeEvent.coordinate,
      spots,
      updateSpots,
    });
  }, [navigation, spots, updateSpots]);

  const handleMarkerPress = useCallback(marker => {
    setSelectedMarker(marker);
    setDetailsModalVisible(true);
  }, []);

  const retryLocation = useCallback(() => {
    setIsLoading(true);
    setupLocation();
  }, [setupLocation]);

  const handleUserLocationChange = useCallback((event) => {
    if (!locationInitialized.current) return;
    
    const {latitude, longitude} = event.nativeEvent.coordinate;
    if (
      !location ||
      Math.abs(location.latitude - latitude) > 0.0001 ||
      Math.abs(location.longitude - longitude) > 0.0001
    ) {
      updateLocation(
        {
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        false,
      );
    }
  }, [location, updateLocation]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={location || DEFAULT_LOCATION}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onUserLocationChange={handleUserLocationChange}
        onMapReady={() => {
          //   setMapReady(true);
          console.log('Map is ready');
        }}
        onLongPress={handleMapLongPress}>
       
        {spots?.map(marker => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            onPress={() => handleMarkerPress(marker)}>
            <View style={styles.markerContainer}>
              <Fish name="fish" size={32} color="#08313a" />
            </View>
          </Marker>
        ))}
      </MapView>
      <MapPressNotice />
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
    height: 20,
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
