import Text from '@/components/ui/Text'
import { icons } from '@/constants/icons'
import { useRouter } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { Alert, Image, ScrollView, TouchableOpacity, View, StyleSheet, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/context/AuthContext'
import * as ImagePicker from 'expo-image-picker'

const Profile = () => {
  const router = useRouter()
  const { user, loading, signOut, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [newImageUri, setNewImageUri] = useState<string | null>(null)
  const [editData, setEditData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    bio: user?.bio || '',
    password: '',
  })

  useEffect(() => {
    ;(async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        console.warn('Camera roll permission not granted')
      }
    })()
  }, [])

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      })

      if (!result.canceled) {
        const uri = (result as any).assets?.[0]?.uri ?? (result as any).uri
        if (uri) setNewImageUri(uri)
      }
    } catch (e) {
      console.warn('Image pick error', e)
    }
  }

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => { } },
      {
        text: 'Logout', onPress: async () => {
          await signOut()
        }
      }
    ])
  }

  const handleEditPress = () => {
    setEditData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      bio: user?.bio || '',
      password: '',
    })
    setNewImageUri(null)
    setIsEditing(true)
  }

  const handleSaveProfile = async () => {
    if (!editData.fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name')
      return
    }
    if (!editData.email.trim()) {
      Alert.alert('Error', 'Please enter your email')
      return
    }

    setIsSaving(true)
    try {
      const payload: any = {
        fullName: editData.fullName,
        email: editData.email,
        bio: editData.bio,
      }
      if (editData.password.trim()) {
        payload.password = editData.password
      }
      if (newImageUri) {
        payload.profilePictureUrl = newImageUri
      }

      await updateProfile(user?._id, payload)
      Alert.alert('Success', 'Profile updated successfully')
      setNewImageUri(null)
      setIsEditing(false)
    } catch (e) {
      // @ts-ignore
      Alert.alert('Update Failed', e?.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
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
          <View style={styles.headerIconsWrap}>
            {isEditing ? (
              <>
                <TouchableOpacity
                  disabled={isSaving}
                  onPress={handleSaveProfile}
                >
                  <Image
                    source={icons.checkMark}
                    style={{ width: 24, height: 24 }}
                    tintColor="#6afdff"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={isSaving}
                  onPress={() => setIsEditing(false)}
                >
                  <Image
                    source={icons.close}
                    style={{ width: 24, height: 24 }}
                    tintColor="#6afdff"
                  />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={handleEditPress}
              >
                <Image
                  source={icons.pencil}
                  style={{ width: 24, height: 24 }}
                  tintColor="#6afdff"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Profile Card */}
        <View style={styles.sectionWrap}>
          <View style={styles.card}>
            <TouchableOpacity 
              onPress={isEditing ? pickImage : undefined}
              disabled={!isEditing}
              activeOpacity={isEditing ? 0.7 : 1}
            >
              {newImageUri || user.profilePictureUrl ? (
                <Image
                  source={{ uri: newImageUri || user.profilePictureUrl }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.avatarBox}>
                  <Image
                    source={icons.person}
                    style={{ width: 48, height: 48 }}
                    tintColor="#94a3b8"
                  />
                </View>
              )}
              {isEditing && (
                <View style={styles.imageEditOverlay}>
                  <Image
                    source={icons.pencil}
                    style={{ width: 20, height: 20 }}
                    tintColor="#ffffff"
                  />
                </View>
              )}
            </TouchableOpacity>

            {isEditing ? (
              <>
                <TextInput
                  style={styles.editInput}
                  value={editData.fullName}
                  onChangeText={(text) => setEditData({ ...editData, fullName: text })}
                  placeholder="Full Name"
                  placeholderTextColor="#666"
                />

                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editData.email}
                    onChangeText={(text) => setEditData({ ...editData, email: text })}
                    placeholder="Email"
                    placeholderTextColor="#666"
                    keyboardType="email-address"
                  />
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>Bio</Text>
                  <TextInput
                    style={[styles.editInput, { height: 80 }]}
                    value={editData.bio}
                    onChangeText={(text) => setEditData({ ...editData, bio: text })}
                    placeholder="Bio (optional)"
                    placeholderTextColor="#666"
                    multiline
                    numberOfLines={4}
                  />
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>New Password (optional)</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editData.password}
                    onChangeText={(text) => setEditData({ ...editData, password: text })}
                    placeholder="Leave blank to keep current password"
                    placeholderTextColor="#666"
                    secureTextEntry
                  />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.name}>{user.fullName || 'User'}</Text>

                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{user.email || 'N/A'}</Text>
                </View>

                {user.bio && (
                  <View style={styles.infoSection}>
                    <Text style={styles.infoLabel}>Bio</Text>
                    <Text style={styles.infoValue}>{user.bio}</Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>

        {/* Logout Button */}
        {!isEditing && (
          <View style={styles.logoutWrap}>
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={handleLogout}
            >
              <Text style={{ color: '#ffffff', fontWeight: '600' }}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerIconsWrap: {
    flexDirection: 'row',
    gap: 16,
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
  imageEditOverlay: {
    position: 'absolute',
    bottom: 16,
    right: 0,
    backgroundColor: '#6afdff',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1e293b',
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
  editInput: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    marginTop: 8,
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