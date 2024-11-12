import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Fish from 'react-native-vector-icons/Ionicons';
import SpotCard from './SpotCard';

const SpotListContent = ({isLoading, loadError, spots, onSpotPress}) => {
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#ffd700" />
        <Text style={styles.emptyText}>Loading spots...</Text>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="error-outline" size={60} color="#ffd700" />
        <Text style={styles.emptyText}>Failed to load spots</Text>
        <Text style={styles.emptySubText}>Pull down to try again</Text>
      </View>
    );
  }

  if (!spots || spots.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Fish name="fish-outline" size={60} color="#ffd700" />
        <Text style={styles.emptyText}>No fishing spots saved yet</Text>
        <Text style={styles.emptySubText}>
          Long press on the map to add your favorite spots
        </Text>
      </View>
    );
  }

  return (
    <View>
      {spots.map(spot => (
        <SpotCard key={spot.id} spot={spot} onPress={onSpotPress} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
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
});

export default SpotListContent;
