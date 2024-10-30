import React, { useState, useEffect, useCallback } from 'react';
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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Fish from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useAppContext } from '../store/context';

const { width } = Dimensions.get('window');

const TabSpotsScreen = () => {
  const { spots, updateSpots } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const savedSpots = await AsyncStorage.getItem('fishingSpots');
      if (savedSpots) {
        updateSpots(JSON.parse(savedSpots));
      }
    } catch (error) {
      console.error('Error refreshing spots:', error);
    }
    setRefreshing(false);
  };

  const handleSpotPress = useCallback((spot) => {
    setSelectedSpot(spot);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setTimeout(() => setSelectedSpot(null), 300);
  }, []);

  const SpotCard = React.memo(({ spot }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => handleSpotPress(spot)}
      activeOpacity={0.7}
      delayPressIn={0}
    >
      <LinearGradient
        colors={['#004B87', '#006494']}
        style={styles.cardGradient}
      >
        <View style={styles.cardContent}>
          <View style={styles.titleContainer}>
            <Fish name="fish" size={24} color="#ffd700" />
            <Text style={styles.cardTitle}>{spot.title}</Text>
          </View>
          <View style={styles.coordinatesContainer}>
            <Icon name="location-on" size={16} color="#ffd700" />
            <Text style={styles.coordinates}>
              {spot.coordinate.latitude.toFixed(6)}, {spot.coordinate.longitude.toFixed(6)}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  ));

  const SpotDetailModal = useCallback(() => (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCloseModal}
      statusBarTranslucent
      hardwareAccelerated
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            bounces={false}
            overScrollMode="never"
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedSpot?.title}</Text>
              <TouchableOpacity 
                onPress={handleCloseModal}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="close" size={24} color="#003366" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalCoordinates}>
              <Icon name="location-on" size={20} color="#003366" />
              <Text style={styles.modalCoordinatesText}>
                {selectedSpot?.coordinate.latitude.toFixed(6)}, 
                {selectedSpot?.coordinate.longitude.toFixed(6)}
              </Text>
            </View>

            {selectedSpot?.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTitle}>Description</Text>
                <Text style={styles.descriptionText}>
                  {selectedSpot.description}
                </Text>
              </View>
            )}

            {selectedSpot?.images && selectedSpot.images.length > 0 && (
              <View style={styles.imagesContainer}>
                <Text style={styles.imagesTitle}>Photos</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                >
                  {selectedSpot.images.map((image, index) => (
                    <Image
                      key={index}
                      source={{ uri: image.uri }}
                      style={styles.modalImage}
                    />
                  ))}
                </ScrollView>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  ), [modalVisible, selectedSpot, handleCloseModal]);

  return (
    <LinearGradient
      colors={['#003366', '#001f3f', '#000']}
      style={styles.container}
    >
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
        <Text style={styles.headerTitle}>My Fishing Spots</Text>
        {spots.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Fish name="fish-outline" size={60} color="#ffd700" />
            <Text style={styles.emptyText}>No fishing spots saved yet</Text>
            <Text style={styles.emptySubText}>
              Long press on the map to add your favorite spots
            </Text>
          </View>
        ) : (
          spots.map(spot => <SpotCard key={spot.id} spot={spot} />)
        )}
      </ScrollView>
      <SpotDetailModal />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: 16,
    textAlign: 'center',
    paddingVertical: 8,
  },
  card: {
    marginBottom: 16,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    backfaceVisibility: 'hidden',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
    borderTopWidth: 2,
    borderColor: '#ffd700',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
  },
  closeButton: {
    padding: 5,
  },
  modalCoordinates: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(0,75,135,0.1)',
    padding: 10,
    borderRadius: 8,
  },
  modalCoordinatesText: {
    marginLeft: 8,
    color: '#003366',
    fontSize: 14,
  },
  descriptionContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(0,75,135,0.05)',
    padding: 15,
    borderRadius: 12,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 8,
  },
  descriptionText: {
    color: '#444',
    lineHeight: 20,
  },
  imagesContainer: {
    marginBottom: 20,
  },
  imagesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 12,
  },
  modalImage: {
    width: width * 0.7,
    height: width * 0.5,
    borderRadius: 12,
    marginRight: 12,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  directionsButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TabSpotsScreen;