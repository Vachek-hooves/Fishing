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
import AsyncStorage from '@react-native-async-storage/async-storage';
import FishingSpotModal from '../components/MapScreen/FishingSpotModal';
import MarkerDetailsModal from '../components/MapScreen/MarkerDetailsModal';
const DEFAULT_LOCATION = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const TabAndroidMap = () => {
  const { spots, updateSpots, location, updateLocation } = useAppContext();
  const [initialRegion, setInitialRegion] = useState(DEFAULT_LOCATION);
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [usingDefaultLocation, setUsingDefaultLocation] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [newMarkerCoordinate, setNewMarkerCoordinate] = useState(null);

  // Handle long press on map to create new marker
  const handleMapLongPress = (event) => {
    setNewMarkerCoordinate(event.nativeEvent.coordinate);
    setModalVisible(true);
  };

  // Load existing markers
  useEffect(() => {
    const loadMarkers = async () => {
      try {
        const savedSpots = await AsyncStorage.getItem('fishingSpots');
        if (savedSpots) {
          updateSpots(JSON.parse(savedSpots));
        }
      } catch (error) {
        console.error('Error loading markers:', error);
      }
    };
    loadMarkers();
  }, []);

  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);
    setDetailsModalVisible(true);
  };

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
          onLongPress={handleMapLongPress}
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


      {/* Add MarkerDetailsModal */}
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
});

export default TabAndroidMap;