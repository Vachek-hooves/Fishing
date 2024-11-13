import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ImageBackground
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';

const TabUserScreen = () => {
  const [user, setUser] = useState({
    name: '',
    image: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setUser(parsedData);
        setIsExistingUser(true);
      } else {
        setIsExistingUser(false);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setIsExistingUser(false);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserData = async () => {
    try {
      if (!user.name.trim()) {
        Alert.alert('Error', 'Please enter your name');
        return;
      }

      // Add timestamp to user data
      const userData = {
        ...user,
        lastUpdated: new Date().toLocaleDateString()
      };

      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      setIsExistingUser(true);
      Alert.alert('Success', 'User data saved successfully!');
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Error', 'Failed to save user data');
    }
  };

  const selectImage = () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error:', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        setUser(prevUser => ({
          ...prevUser,
          image: source.uri
        }));
      }
    });
  };

  const deleteImage = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to remove your profile photo?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setUser(prevUser => ({
              ...prevUser,
              image: null
            }));
          }
        }
      ]
    );
  };

  const handleEditPress = () => {
    setIsEditing(true);
  };

  const handleUpdateProfile = async () => {
    try {
      await saveUserData();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleDeleteProfile = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userData');
              setUser({ name: '', image: null });
              setIsExistingUser(false);
              setIsEditing(false);
              Alert.alert('Success', 'Account deleted successfully!');
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'Failed to delete account');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <View style={styles.loadingContainer} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <LinearGradient
          colors={['#003366', '#001f3f', '#000']}
          style={styles.container}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {isExistingUser && !isEditing ? (
              // Profile View
              <View style={styles.profileContainer}>
                {user.image ? (
                  <Image source={{ uri: user.image }} style={styles.profileImage} />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Icon name="account" size={40} color="#ffd700" />
                  </View>
                )}
                <Text style={styles.userName}>{user.name}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={styles.editButton} 
                    onPress={() => setIsEditing(true)}
                  >
                    <Icon name="pencil" size={20} color="#003366" />
                    <Text style={styles.buttonText}>Edit Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteAccountButton} 
                    onPress={handleDeleteProfile}
                  >
                    <Icon name="account-remove" size={20} color="#fff" />
                    <Text style={styles.deleteButtonText}>Delete Account</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : isEditing ? (
              // Edit Profile View
              <View style={styles.editContainer}>
                <TouchableOpacity onPress={selectImage} style={styles.imageContainer}>
                  {user.image ? (
                    <View style={{position:'relative',justifyContent:'center',alignItems:'center'}}>
                      <Image source={{ uri: user.image }} style={styles.profileImage} />

                        
                      <TouchableOpacity 
                        style={styles.deleteImageButton} 
                        onPress={deleteImage}
                        >
                        <Icon name="trash-can" size={30} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.placeholderImage}>
                      <Icon name="account" size={49} color="#ffd700" />
                    </View>
                  )}
                </TouchableOpacity>
                
                <TextInput
                  style={styles.editInput}
                  placeholder="Name"
                  placeholderTextColor="#ffd700"
                  value={user.name}
                  onChangeText={(text) => setUser(prevUser => ({...prevUser, name: text}))}
                />
                
                <TouchableOpacity 
                  style={styles.editSaveButton}
                  onPress={handleUpdateProfile}
                >
                  <Text style={styles.editSaveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Create Profile View
              <View style={styles.welcomeContainer}>
                <LottieView
                  source={require('../assets/lottieJson/registration.json')}
                  autoPlay
                  loop
                  style={styles.welcomeAnimation}
                />
                <Text style={styles.welcomeText}>Create Profile</Text>
                <TouchableOpacity onPress={selectImage} style={styles.imageContainer}>
                  {user.image ? (
                    <>
                      <Image source={{ uri: user.image }} style={styles.profileImage} />
                      <TouchableOpacity 
                        style={styles.deleteImageButton} 
                        onPress={deleteImage}
                      >
                        <Icon name="trash-can-outline" size={16} color="#fff" />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View style={styles.placeholderImage}>
                      <Icon name="camera" size={40} color="#ffd700" />
                      <Text style={styles.addPhotoText}>Add Photo</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <View style={styles.inputContainer}>
                  <Icon name="account" size={24} color="#ffd700" />
                  <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#666"
                    value={user.name}
                    onChangeText={(text) => setUser(prevUser => ({...prevUser, name: text}))}
                  />
                </View>
                <TouchableOpacity 
                  style={[styles.saveButton, !user.name && styles.saveButtonDisabled]}
                  onPress={saveUserData}
                  disabled={!user.name}
                >
                  <Text style={styles.saveButtonText}>Create Profile</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={{height:50}}></View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#003366',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
    
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  lottieAnimation: {
    width: 250,
    height: 250,
  },
  userInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#ffd700',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: '#fff',
    fontSize: 16,
  },
  preferencesContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  preferenceText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  toggleButton: {
    width: 50,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 2,
  },
  toggleButtonActive: {
    backgroundColor: '#ffd700',
  },
  saveButton: {
    backgroundColor: '#ffd700',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#003366',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#003366',
  },
  loadingAnimation: {
    width: 200,
    height: 200,
  },
  imageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 250,
    height: 250,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#ffd700',
    overflow: 'hidden',
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 3,
    borderColor: '#ffd700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 50,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',

  },
  welcomeText: {
    fontSize: 24,
    color: '#ffd700',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeAnimation: {
    width: 250,
    height: 250,
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#ffd700',
    borderRadius: 15,
    padding: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  addPhotoText: {
    color: '#ffd700',
    marginTop: 8,
    fontSize: 12,
  },
  lastUpdatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  lastUpdatedText: {
    color: '#ffd700',
    marginLeft: 5,
    fontSize: 12,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.8)',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteImageButton: {
    position: 'absolute',
    // right: -10,
    // top: -10,
    backgroundColor: '#ff4444',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: '#fff',
    bottom: 0,
    right: 40,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  userName: {
    fontSize: 24,
    color: '#ffd700',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  editButton: {
    alignItems: 'center',
    backgroundColor: '#ffd700',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    // flexDirection:'column'
    flex:1
  },
  buttonText: {
    color: '#003366',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    textAlign:'center'
  },
  editContainer: {
    padding: 20,
    backgroundColor: 'rgba(0, 51, 102, 0.95)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffd700',
    margin: 10,
  },
  editInput: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ffd700',
    borderRadius: 10,
    padding: 12,
    color: '#ffd700',
    fontSize: 16,
    marginVertical: 20,
    width: '100%',
  },
  editSaveButton: {
    backgroundColor: '#ffd700',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '100%',
  },
  editSaveButtonText: {
    color: '#003366',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.8)',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    marginVertical: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ffd700',
  },
  saveButton: {
    backgroundColor: '#ffd700',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  saveButtonText: {
    color: '#003366',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    gap: 10,
  },
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff4444',
    borderRadius: 10,
    padding: 10,
    flex: 1,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    textAlign:'center'
  },
});

export default TabUserScreen;