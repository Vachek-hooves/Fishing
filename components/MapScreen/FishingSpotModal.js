import React from 'react';
import {
  View,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FishingSpotModal = ({ 
    visible, 
    onClose, 
    coordinate, 
    spots, 
    updateSpots 
  }) => {
    const [markerTitle, setMarkerTitle] = React.useState('');
    const [markerDescription, setMarkerDescription] = React.useState('');

    const handleSaveMarker = async () => {
        if (!markerTitle.trim()) {
          Alert.alert('Error', 'Please enter a title for the marker');
          return;
        }
    
        const newMarker = {
          id: Date.now().toString(),
          coordinate,
          title: markerTitle,
          description: markerDescription,
        };
    
        try {
          const updatedSpots = [...spots, newMarker];
          await AsyncStorage.setItem('fishingSpots', JSON.stringify(updatedSpots));
          updateSpots(updatedSpots);
          
          // Reset form
          setMarkerTitle('');
          setMarkerDescription('');
          onClose();
    
          Alert.alert('Success', 'Fishing spot saved successfully!');
        } catch (error) {
          console.error('Error saving marker:', error);
          Alert.alert('Error', 'Failed to save fishing spot');
        }
      };

      const handleCancel = () => {
        setMarkerTitle('');
        setMarkerDescription('');
        onClose();
      };
      return (
        <Modal
          visible={visible}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCancel}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Fishing Spot</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Spot Title"
                value={markerTitle}
                onChangeText={setMarkerTitle}
              />
              
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description (optional)"
                value={markerDescription}
                onChangeText={setMarkerDescription}
                multiline
                numberOfLines={4}
              />
    
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSaveMarker}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
    
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      );
}

export default FishingSpotModal

const styles = StyleSheet.create({ modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#004B87',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    elevation: 2,
  },saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#757575',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },

})