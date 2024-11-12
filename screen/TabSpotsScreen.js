import React, {useState, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Modal,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Fish from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {useAppContext} from '../store/context';
import MainLayout from '../components/appLayout/MainLayout';
import SpotDetailModal from '../components/SpotsScreen/SpotDetailModal';

const {width} = Dimensions.get('window');


// Main component
const TabSpotsScreen = () => {
  const {spots, updateSpots, deleteSpot} = useAppContext();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadSpots();
  }, []);

  const loadSpots = async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      const savedSpots = await AsyncStorage.getItem('fishingSpots');
      if (savedSpots) {
        updateSpots(JSON.parse(savedSpots));
      }
    } catch (error) {
      console.error('Error loading spots:', error);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSpots();
    setRefreshing(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#ffd700" />
          <Text style={styles.emptyText}>Loading spots...</Text>
        </View>
      );
    }

    if (loadError) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="error-outline" size={60} color="#ffd700" />
          <Text style={styles.emptyText}>Failed to load spots</Text>
          <Text style={styles.emptySubText}>
            Pull down to try again
          </Text>
        </View>
      );
    }

    if (spots.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Fish name="fish-outline" size={60} color="#ffd700" />
          <Text style={styles.emptyText}>No fishing spots saved yet</Text>
          <Text style={styles.emptySubText}>
            Long press on the map to add your favorite spots
          </Text>
        </View>
      );
    }

    return spots.map(spot => (
      <SpotCard key={spot.id} spot={spot} onPress={handleSpotPress} />
    ));
  };

  const handleSpotPress = useCallback(spot => {
    setSelectedSpot(spot);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedSpot(null);
  }, []);

  const handleDeleteSpot = async spotId => {
    const success = await deleteSpot(spotId);
    if (success) {
      handleCloseModal();
    } else {
      Alert.alert('Error', 'Failed to delete spot');
    }
  };

  return (
    <LinearGradient
      colors={['#003366', '#001f3f', '#000']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#ffd700"
              />
            }
          >
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>My Fishing Spots</Text>
            </View>
            {renderContent()}
          </ScrollView>
        </View>

        <SpotDetailModal
          visible={modalVisible}
          spot={selectedSpot}
          onClose={handleCloseModal}
          onDelete={handleDeleteSpot}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 10 : 10,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  headerContainer: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: 16,
    textAlign: 'center',
    paddingVertical: 8,
    // color: 'rgba(0,0,0,0.9)',
  },
  card: {
    marginBottom: 16,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: '#ffd700',
  },
  cardGradient: {
    borderRadius: 15,
  },
  cardContent: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coordinates: {
    fontSize: 12,
    color: '#ffd700',
    marginLeft: 4,
  },
  description: {
    color: '#fff',
    marginBottom: 12,
    fontSize: 14,
    opacity: 0.9,
  },
  imageScroll: {
    marginTop: 8,
  },
  spotImage: {
    width: width / 3,
    height: width / 3,
    marginRight: 8,
  },
  expandedInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  directionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffd700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.8,
    paddingHorizontal: 32,
  },
  
  
});

export default TabSpotsScreen;


const SpotCard = ({spot, onPress}) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => onPress(spot)}
    activeOpacity={0.7}>
    <LinearGradient colors={['#004B87', '#006494']} style={styles.cardGradient}>
      <View style={styles.cardContent}>
        <View style={styles.titleContainer}>
          <Fish name="fish" size={24} color="#ffd700" />
          <Text style={styles.cardTitle}>{spot.title}</Text>
        </View>
        <View style={styles.coordinatesContainer}>
          <Icon name="location-on" size={16} color="#ffd700" />
          <Text style={styles.coordinates}>
            {spot.coordinate.latitude.toFixed(6)},{' '}
            {spot.coordinate.longitude.toFixed(6)}
          </Text>
        </View>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);
