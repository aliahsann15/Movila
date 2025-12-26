import Text from '@/components/ui/Text'
import { icons } from '@/constants/icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Alert, Image, ScrollView, TouchableOpacity, View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Profile = () => {
  const router = useRouter()

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      { text: 'Logout', onPress: () => {
        // Handle logout logic here
        router.push('/')
      }}
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.sectionWrap}>
          <View style={styles.card}>
            <View style={styles.avatarBox}>
              <Image 
                source={icons.person}
                style={{ width: 48, height: 48 }}
              />
            </View>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.lightText}>john.doe@example.com</Text>
            <Text style={[styles.lightText, styles.small, { marginTop: 16 }]}>Movie Enthusiast • 2 years member</Text>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.sectionPad}>
          <View style={styles.statsRow}>
            <View style={[styles.statBox, { marginRight: 12 }]}>
              <Text style={styles.lightSmall}>Watched</Text>
              <Text style={styles.statValue}>24</Text>
            </View>
            <View style={[styles.statBox, { marginRight: 12 }]}>
              <Text style={styles.lightSmall}>Saved</Text>
              <Text style={styles.statValue}>12</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.lightSmall}>Rating Avg</Text>
              <Text style={styles.statValue}>8.2</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuWrap}>
          <Text style={styles.menuTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text>Account Settings</Text>
            <Text style={styles.lightText}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text>Preferences</Text>
            <Text style={styles.lightText}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text>Notifications</Text>
            <Text style={styles.lightText}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text>About</Text>
            <Text style={styles.lightText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutWrap}>
          <TouchableOpacity 
            style={styles.logoutBtn}
            onPress={handleLogout}
          >
            <Text style={{ color: '#ffffff', fontWeight: '600' }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040c1c',
  },
  scroll: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#1f2937',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  sectionWrap: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  avatarBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
  },
  lightText: {
    color: '#94a3b8',
    marginTop: 4,
  },
  small: {
    fontSize: 14,
  },
  sectionPad: {
    paddingHorizontal: 20,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 16,
  },
  lightSmall: {
    color: '#94a3b8',
    fontSize: 14,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#22d3ee',
    marginTop: 8,
  },
  menuWrap: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  menuItem: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoutWrap: {
    paddingHorizontal: 20,
    marginBottom: 80,
  },
  logoutBtn: {
    backgroundColor: '#dc2626',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
});