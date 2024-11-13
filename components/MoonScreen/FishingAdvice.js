import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {getFishingRating} from './utils'

const FishingAdvice = ({ moonPhase, weather }) => {
    const fishingInfo = getFishingRating(moonPhase, weather);
  
    return (
      <View style={styles.fishingAdviceContainer}>
        <Text style={styles.fishingTitle}>Fishing Forecast</Text>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>
            Today's Rating: {fishingInfo.rating}/10
          </Text>
          <View style={styles.ratingBar}>
            <LinearGradient
              colors={['#ffd700', '#ffa500']}
              style={[styles.ratingFill, { width: `${fishingInfo.rating * 10}%` }]}
            />
          </View>
        </View>
  
        <View style={styles.adviceSection}>
          <Text style={styles.adviceTitle}>Moon Phase Advice</Text>
          <Text style={styles.adviceText}>{fishingInfo.moonPhaseAdvice.general}</Text>
          {fishingInfo.moonPhaseAdvice.tips.map((tip, index) => (
            <View key={index} style={styles.tipContainer}>
              <Icon name="fish" size={16} color="#ffd700" />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
  
        <View style={styles.adviceSection}>
          <Text style={styles.adviceTitle}>Best Times Today</Text>
          {fishingInfo.bestTimeRanges.map((time, index) => (
            <Text key={index} style={styles.timeText}>• {time}</Text>
          ))}
        </View>
      </View>
    );
  };

export default FishingAdvice

const styles = StyleSheet.create({
    fishingAdviceContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
      },
      fishingTitle: {
        fontSize: 20,
        color: '#ffd700',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
      },
      ratingContainer: {
        marginBottom: 20,
      },
      ratingText: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 8,
      },
      ratingBar: {
        height: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 5,
        overflow: 'hidden',
      },
      ratingFill: {
        height: '100%',
        borderRadius: 5,
      },
      adviceSection: {
        marginBottom: 20,
      },
      adviceTitle: {
        color: '#ffd700',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      adviceText: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 10,
      },tipContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
      },
      tipText: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 8,
      },timeText: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 5,
      },
      sunInfoContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
      },
})