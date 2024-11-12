import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Fish from 'react-native-vector-icons/Ionicons';
import SpotCard from './SpotCard';

const SpotListContent = ({
  isLoading,
  loadError,
  spots,
  onSpotPress,
  // styles, // Pass styles as prop or create separate stylesheet
}) => {
  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color="#ffd700" />
        <Text style={styles.emptyText}>Loading spots...</Text>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="error-outline" size={60} color="#ffd700" />
        <Text style={styles.emptyText}>Failed to load spots</Text>
        <Text style={styles.emptySubText}>Pull down to try again</Text>
      </View>
    );
  }

  if (!spots || spots.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Fish name="fish-outline" size={60} color="#ffd700" />
        <Text style={styles.emptyText}>No fishing spots saved yet</Text>
        <Text style={styles.emptySubText}>
          Long press on the map to add your favorite spots
        </Text>
      </View>
    );
  }

  return spots.map(spot => (
    <SpotCard key={spot.id} spot={spot} onPress={onSpotPress} styles={styles} />
  ));
};

export default SpotListContent;

const styles = StyleSheet.create({
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
});
