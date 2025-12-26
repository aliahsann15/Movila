import Text from '@/components/ui/Text'
import { icons } from '@/constants/icons'
import { useRouter, Link } from 'expo-router'
import React from 'react'
import { Alert, Image, ScrollView, TouchableOpacity, View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/context/AuthContext'

const Profile = () => {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      { text: 'Logout', onPress: async () => {
        await signOut()
      }}
    ])
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    )
  }

  // Not logged in: show login and register buttons
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notLoggedInContainer}>
          <Text style={styles.headerTitle}>Welcome to Movila</Text>
          <Text style={[styles.lightText, { marginTop: 8, textAlign: 'center', marginBottom: 32 }]}>
            Please log in or create an account to continue
          </Text>
          
          <TouchableOpacity 
            style={styles.loginBtn}
            onPress={() => router.push('/login')}
          >
            <Text style={{ color: '#ffffff', fontWeight: '600', fontSize: 16 }}>Log In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.registerBtn}
            onPress={() => router.push('/signup')}
          >
            <Text style={{ color: '#6afdff', fontWeight: '600', fontSize: 16 }}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  // Logged in: show user profile
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
            {user.profilePictureUrl ? (
              <Image 
                source={{ uri: user.profilePictureUrl }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.avatarBox}>
                <Image 
                  source={icons.person}
                  style={{ width: 48, height: 48 }}
                />
              </View>
            )}
            <Text style={styles.name}>{user.fullName || 'User'}</Text>
            
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email || 'N/A'}</Text>
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Password</Text>
              <Text style={styles.infoValue}>••••••••</Text>
            </View>
            
            {user.bio && (
              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Bio</Text>
                <Text style={styles.infoValue}>{user.bio}</Text>
              </View>
            )}
          </View>
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
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
  },
  lightText: {
    color: '#94a3b8',
    marginTop: 4,
  },
  small: {
    fontSize: 14,
  },
  infoSection: {
    width: '100%',
    marginBottom: 16,
  },
  infoLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoValue: {
    color: '#ffffff',
    fontSize: 16,
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
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loginBtn: {
    backgroundColor: '#6afdff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  registerBtn: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    borderWidth: 2,
    borderColor: '#6afdff',
  },
});