import {
  StyleSheet,
  Text,
  View,
  Modal,
  Alert,
  Image,
  Dimensions,
  ScrollView,TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

export const SpotDetailModal = ({visible, spot, onClose, onDelete}) => {
  if (!spot) return null;

  const handleDelete = () => {
    Alert.alert(
      'Delete Spot',
      'Are you sure you want to delete this fishing spot?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(spot.id),
        },
      ],
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{spot.title}</Text>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={handleDelete}
                  style={[styles.actionButton, styles.deleteButton]}
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                  <Icon name="delete" size={24} color="#ff4444" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.actionButton}
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                  <Icon name="close" size={24} color="#003366" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalCoordinates}>
              <Icon name="location-on" size={20} color="#003366" />
              <Text style={styles.modalCoordinatesText}>
                {spot.coordinate.latitude.toFixed(6)},
                {spot.coordinate.longitude.toFixed(6)}
              </Text>
            </View>

            {spot.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTitle}>Description</Text>
                <Text style={styles.descriptionText}>{spot.description}</Text>
              </View>
            )}

            {spot.images && spot.images.length > 0 && (
              <View style={styles.imagesContainer}>
                <Text style={styles.imagesTitle}>Photos</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {spot.images.map((image, index) => (
                    <Image
                      key={index}
                      source={{uri: image.uri}}
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
  );
};

export default SpotDetailModal;

const styles = StyleSheet.create({
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
    width:width,
    height:'100%'
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
  directionsButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 5,
    marginLeft: 15,
  },
  deleteButton: {
    marginRight: 5,
  }, directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  
});
