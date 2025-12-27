import Text from '@/components/ui/Text'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState, useEffect } from 'react'
import {
  Alert,
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator
} from 'react-native'
import MovieCard from '@/components/MovieCard'
import { useAuth } from '@/context/AuthContext'

const Saved = () => {
  const [savedMovies, setSavedMovies] = useState<Movie[]>([])
  const [moviesLoading, setMoviesLoading] = useState<boolean>(true)
  const [moviesError, setMoviesError] = useState<Error | null>(null)

  const API_BASE = process.env.EXPO_PUBLIC_API_BASE || "http://192.168.100.194:5000/api"
  const { user, token } = useAuth()
  // Try both _id and id for compatibility
  const userID = user?._id || user?.id

  useEffect(() => {
    const isValidObjectId = (id: string | undefined) => {
      return typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id)
    }
    const fetchSavedMovies = async () => {
      // If user or userID is not present, skip fetching
      if (!user || !userID) return;
      if (!isValidObjectId(userID)) return;
      setMoviesLoading(true)
      setMoviesError(null)

      // Fetch saved movies from backend
      const response = await fetch(`${API_BASE}/users/${userID}/saved`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })

      // Parse response JSON
      const result = await response.json()
      // Handle errors
      if (!response.ok) {
        setMoviesError(new Error(result.error || 'Failed to fetch saved movies'))
        setMoviesLoading(false)
        return
      }
      // Fetch detailed movie data
      setMoviesLoading(false)
      setSavedMovies(result.data)
    }
    fetchSavedMovies()
  }, [user, userID, API_BASE, token])

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#ef4444' }}>Please log in to view your saved movies.</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Saved Movies</Text>
      </View>

      {/* Content */}
      {savedMovies.length === 0 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#94a3b8' }}>You have no saved movies yet.</Text>
        </View>
      )}

      {savedMovies.length > 0 && (
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
        >

          {moviesLoading ? (
            <ActivityIndicator
              size="large"
              color="#6afdff"
              style={styles.loading}
            />

          ) : moviesError ? (
            <Text>Error: {moviesError?.message}</Text>
          ) : (

            <View style={styles.content}>
              <>
                <FlatList
                  data={savedMovies}
                  renderItem={({ item }) => (
                    <MovieCard
                      {...item}
                      cardStyle={{ width: 110, marginRight: 0, marginBottom: 10 }}
                    />
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={3}
                  columnWrapperStyle={{
                    justifyContent: 'flex-start',
                    gap: 20,
                    paddingRight: 5,
                    marginBottom: 10
                  }}
                  style={styles.list}
                  scrollEnabled={false}
                />
              </>
            </View>
          )}

        </ScrollView>
      )}

    </SafeAreaView>
  )
}

export default Saved

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  scroll: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
  },
  loading: {
    marginTop: 40,
    alignSelf: 'center',
  },
  content: {
    flex: 1,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    marginTop: 40,
    marginBottom: 20,
    fontWeight: '700',
  },
  list: {
    marginTop: 8,
    paddingBottom: 128,
  },
});