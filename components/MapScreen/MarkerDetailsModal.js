import React from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const MarkerDetailsModal = ({ visible, onClose, marker, spots, updateSpots }) => {
  const handleDelete = async () => {
    Alert.alert(
      'Delete Fishing Spot',
      'Are you sure you want to delete this fishing spot?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedSpots = spots.filter(spot => spot.id !== marker.id);
              await AsyncStorage.setItem('fishingSpots', JSON.stringify(updatedSpots));
              updateSpots(updatedSpots);
              onClose();
            } catch (error) {
              console.error('Error deleting spot:', error);
              Alert.alert('Error', 'Failed to delete fishing spot');
            }
          },
        },
      ],
    );
  };

  if (!marker) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity 
          style={styles.overlay}
          activeOpacity={1} 
          onPress={onClose}
        />
        <View style={styles.modalContent}>
          <View style={styles.headerContainer}>
            <View style={styles.dragIndicator} />
            <Text style={styles.modalTitle}>{marker.title}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.detailsContainer}>
              <View style={styles.coordinatesContainer}>
                <Text style={styles.label}>Location:</Text>
                <Text style={styles.coordinates}>
                  {marker.coordinate.latitude.toFixed(6)}°N, {marker.coordinate.longitude.toFixed(6)}°E
                </Text>
              </View>

              {marker.description && (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.label}>Description:</Text>
                  <Text style={styles.description}>{marker.description}</Text>
                </View>
              )}

              {marker.images && marker.images.length > 0 && (
                <View style={styles.imagesContainer}>
                  <Text style={styles.label}>Photos:</Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.imageScrollView}
                  >
                    {marker.images.map((image, index) => (
                      <View key={index} style={styles.imageContainer}>
                        <Image 
                          source={{ uri: image.uri }} 
                          style={styles.image}
                          resizeMode="cover"
                        />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Icon name="delete" size={20} color="white" />
                <Text style={styles.buttonText}>Delete Spot</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.8,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 12,
    padding: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004B87',
  },
  scrollContent: {
    padding: 20,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  coordinatesContainer: {
    marginBottom: 15,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  descriptionContainer: {
    marginBottom: 15,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  coordinates: {
    fontSize: 14,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  deleteButton: {
    backgroundColor: '#ff6b6b',
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagesContainer: {
    marginTop: 15,
    marginBottom: 15,
  },
  imageScrollView: {
    marginTop: 10,
  },
  imageContainer: {
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  image: {
    width: width * 0.6,
    height: width * 0.4,
    backgroundColor: '#f5f5f5',
  },
});

export default MarkerDetailsModal;