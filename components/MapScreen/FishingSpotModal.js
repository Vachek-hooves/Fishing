import React, { useState } from 'react';
import {
  View,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');
const FishingSpotModal = ({ visible, onClose, coordinate, spots, updateSpots }) => {
  const [markerTitle, setMarkerTitle] = useState('');
  const [markerDescription, setMarkerDescription] = useState('');
  const [images, setImages] = useState([]);

  const handleImagePick = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.7,
      selectionLimit: 4, // Allow multiple images up to 4
    };

    try {
      const result = await launchImageLibrary(options);
      
      if (result.didCancel) return;
      
      if (result.assets) {
        const newImages = result.assets.map(asset => ({
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName || 'image.jpg',
        }));
        
        setImages(prevImages => [...prevImages, ...newImages].slice(0, 4)); // Limit to 4 images
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

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
      images: images,
    };

    try {
      const updatedSpots = [...spots, newMarker];
      await updateSpots(updatedSpots);
      
      // Reset form
      setMarkerTitle('');
      setMarkerDescription('');
      setImages([]);
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
    setImages([]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}>
      <View style={styles.modalContainer}>
        <ScrollView style={styles.modalContent}>
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

          <View style={styles.imageSection}>
            <Text style={styles.imageTitle}>Add Photos (max 4)</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.imageScrollView}
            >
              {images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: image.uri }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}>
                    <Icon name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
              {images.length < 4 && (
                <TouchableOpacity
                  style={styles.addImageButton}
                  onPress={handleImagePick}>
                  <Icon name="add-photo-alternate" size={30} color="#004B87" />
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSaveMarker}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    // flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    // justifyContent: 'center',
    // flexGrow: 1,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    // maxHeight: '80%',
    width: width-20,
   
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
  imageSection: {
    marginVertical: 15,
  },
  imageTitle: {
    fontSize: 16,
    color: '#004B87',
    marginBottom: 10,
  },
  imageScrollView: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  imageContainer: {
    marginRight: 10,
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#004B87',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default FishingSpotModal;