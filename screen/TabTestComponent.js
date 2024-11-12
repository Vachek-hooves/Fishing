import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const TabTestComponent = () => {
  return (
    <View style={styles.container}>
      <Text>TabTestComponent</Text>
    </View>
  )
}

export default TabTestComponent

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})