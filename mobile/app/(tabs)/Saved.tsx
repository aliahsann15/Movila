import Text from '@/components/ui/Text'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import { StyleSheet, View } from 'react-native'

const Saved = () => {
  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Saved Movies</Text>
      </View>

      {/* Content */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#94a3b8' }}>You have no saved movies yet.</Text>
      </View>

      

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
  header: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#1f2937',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
});