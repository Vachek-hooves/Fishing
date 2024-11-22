import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../components/MapScreen/CustomAlert';
import {useAppContext} from '../store/context';

const {width} = Dimensions.get('window');

const StackSpotCreateScreen = ({route, navigation}) => {
  const {spots, updateSpots} = useAppContext();
  const {coordinate} = route.params;
  const [markerTitle, setMarkerTitle] = useState('');
  const [markerDescription, setMarkerDescription] = useState('');
  const [images, setImages] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({title: '', message: ''});

  const showAlert = (title, message) => {
    setAlertConfig({title, message});
    setAlertVisible(true);
  };

  const handleImagePick = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.7,
      selectionLimit: 4,
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

        setImages(prevImages => [...prevImages, ...newImages].slice(0, 4));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeImage = index => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleSaveSpot = async () => {
    if (!markerTitle.trim()) {
      showAlert('Error', 'Please enter a title for the spot');
      return;
    }

    const newSpot = {
      id: Date.now().toString(),
      coordinate,
      title: markerTitle,
      description: markerDescription,
      images: images,
    };

    try {
      const updatedSpots = [...spots, newSpot];
      await AsyncStorage.setItem('fishingSpots', JSON.stringify(updatedSpots));
      updateSpots(updatedSpots);
      navigation.goBack();
      // Show success message after navigation
      setTimeout(() => {
        showAlert('Success', 'Fishing spot saved successfully!');
      }, 100);
    } catch (error) {
      console.error('Error saving spot:', error);
      showAlert('Error', 'Failed to save fishing spot');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={{flex: 1}}
      keyboardVerticalOffset={80}
      enabled>

      <ScrollView style={styles.container} keyboardShouldPersistTaps='handled'>
        <Text style={styles.title}>Add New Fishing Spot</Text>

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
          numberOfLines={3}
        />

        <View style={styles.imageSection}>
          <Text style={styles.imageTitle}>Add Photos (max 4)</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imageScrollView}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{uri: image.uri}} style={styles.image} />
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
            onPress={handleSaveSpot}>
            <Text style={styles.buttonText}>Save Spot</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <View style={{height: 50}}></View>
        <CustomAlert
          visible={alertVisible}
          title={alertConfig.title}
          message={alertConfig.message}
          onClose={() => setAlertVisible(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default StackSpotCreateScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#004B87',
    textAlign: 'center',
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
  },
  saveButton: {
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
