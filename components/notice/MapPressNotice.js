import {StyleSheet, Text, View, Platform} from 'react-native';
import React from 'react';

const MapPressNotice = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Press and hold to add a fishing spot</Text>
    </View>
  );
};

export default MapPressNotice;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? '7%' : '10%',

    padding: 8,
    borderRadius: 8,
    zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.5)',

    width: '100%',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'yellow',
  },
});
