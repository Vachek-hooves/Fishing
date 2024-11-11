import React from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MarkerDetailsModal = ({ 
  visible, 
  onClose, 
  marker, 
  spots,
  updateSpots 
}) => {
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
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color="#666" />
          </TouchableOpacity>

          <ScrollView>
            <Text style={styles.modalTitle}>{marker.title}</Text>
            
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    color: '#004B87',
  },
  detailsContainer: {
    marginBottom: 20,
  },
  coordinatesContainer: {
    marginBottom: 15,
  },
  descriptionContainer: {
    marginBottom: 15,
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
});

export default MarkerDetailsModal;