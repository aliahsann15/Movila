import Text from '@/components/ui/Text'
import { icons } from '@/constants/icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Alert, Image, ScrollView, TouchableOpacity, View } from 'react-native'
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
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header */}
        <View className="px-5 py-4 border-b border-gray-800">
          <Text className="text-2xl font-bold">My Profile</Text>
        </View>

        {/* Profile Card */}
        <View className="px-5 py-6">
          <View className="bg-gray-900 rounded-xl p-6 items-center">
            <View className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 items-center justify-center mb-4">
              <Image 
                source={icons.profile} 
                className="w-12 h-12"
              />
            </View>
            <Text className="text-xl font-bold">John Doe</Text>
            <Text className="text-light-foreground mt-1">john.doe@example.com</Text>
            <Text className="text-sm text-light-foreground mt-4">Movie Enthusiast • 2 years member</Text>
          </View>
        </View>

        {/* Statistics */}
        <View className="px-5">
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 bg-gray-900 rounded-lg p-4">
              <Text className="text-light-foreground text-sm">Watched</Text>
              <Text className="text-2xl font-bold text-cyan-400 mt-2">24</Text>
            </View>
            <View className="flex-1 bg-gray-900 rounded-lg p-4">
              <Text className="text-light-foreground text-sm">Saved</Text>
              <Text className="text-2xl font-bold text-cyan-400 mt-2">12</Text>
            </View>
            <View className="flex-1 bg-gray-900 rounded-lg p-4">
              <Text className="text-light-foreground text-sm">Rating Avg</Text>
              <Text className="text-2xl font-bold text-cyan-400 mt-2">8.2</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-5 mb-6">
          <Text className="text-lg font-semibold mb-4">Settings</Text>
          
          <TouchableOpacity className="bg-gray-900 rounded-lg p-4 mb-3 flex-row items-center justify-between">
            <Text>Account Settings</Text>
            <Text className="text-light-foreground">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-gray-900 rounded-lg p-4 mb-3 flex-row items-center justify-between">
            <Text>Preferences</Text>
            <Text className="text-light-foreground">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-gray-900 rounded-lg p-4 mb-3 flex-row items-center justify-between">
            <Text>Notifications</Text>
            <Text className="text-light-foreground">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-gray-900 rounded-lg p-4 mb-3 flex-row items-center justify-between">
            <Text>About</Text>
            <Text className="text-light-foreground">›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View className="px-5 mb-20">
          <TouchableOpacity 
            className="bg-red-600 rounded-lg p-4 items-center"
            onPress={handleLogout}
          >
            <Text className="text-white font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile