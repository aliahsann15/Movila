import Text from '@/components/ui/Text'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import { StyleSheet } from 'react-native'

const Saved = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Saved</Text>
    </SafeAreaView>
  )
}

export default Saved

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#040c1c',
  },
});