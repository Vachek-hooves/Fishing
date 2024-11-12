import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Fish from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

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

const styles = StyleSheet.create({
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
});

export default SpotCard;
