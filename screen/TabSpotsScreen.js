import React, {useState, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  RefreshControl,
  Alert,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {useAppContext} from '../store/context';
import MainLayout from '../components/appLayout/MainLayout';
import SpotDetailModal from '../components/SpotsScreen/SpotDetailModal';
import SpotListContent from '../components/SpotsScreen/SpotListContent';

const {width} = Dimensions.get('window');

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
      style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>My Fishing Spots</Text>
            </View>
        <View style={styles.contentContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#ffd700"
              />
            }>
            <SpotListContent
              isLoading={isLoading}
              loadError={loadError}
              spots={spots}
              onSpotPress={handleSpotPress}
              styles={styles}
            />
          </ScrollView>
        </View>
          <View style={{height: 100}}></View>

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
    // height: '110%'
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
});

export default TabSpotsScreen;
