import Text from '@/components/ui/Text'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState, useEffect, useCallback } from 'react'
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl
} from 'react-native'
import MovieCard from '@/components/MovieCard'
import { useAuth } from '@/context/AuthContext'

const Saved = () => {
  const [savedMovies, setSavedMovies] = useState<Movie[]>([])
  const [moviesLoading, setMoviesLoading] = useState<boolean>(true)
  const [moviesError, setMoviesError] = useState<Error | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const API_BASE = process.env.EXPO_PUBLIC_API_BASE || "http://192.168.100.194:5000/api"
  const { user, token } = useAuth()
  // Try both _id and id for compatibility
  const userID = user?._id || user?.id

  const fetchSavedMovies = useCallback(async () => {
    if (!user || !userID) return;
    const isValidObjectId = (id: string | undefined) => typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id);
    if (!isValidObjectId(userID)) return;
    setMoviesLoading(true);
    setMoviesError(null);
    const response = await fetch(`${API_BASE}/users/${userID}/saved`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    const result = await response.json();
    if (!response.ok) {
      setMoviesError(new Error(result.error || 'Failed to fetch saved movies'));
      setMoviesLoading(false);
      return;
    }
    setMoviesLoading(false);
    setSavedMovies(result.data);
  }, [user, userID, API_BASE, token]);

  useEffect(() => {
    const isValidObjectId = (id: string | undefined) => {
      return typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id)
    }
    fetchSavedMovies();
  }, [fetchSavedMovies]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSavedMovies();
    setRefreshing(false);
  }, [fetchSavedMovies]);

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
            justifyContent: 'center',
            gap: 12,
            marginVertical: 16
          }}
          style={styles.list}
          scrollEnabled={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6afdff" />
          }
          ListEmptyComponent={moviesLoading ? (
            <ActivityIndicator size="large" color="#6afdff" style={styles.loading} />
          ) : moviesError ? (
            <Text>Error: {moviesError?.message}</Text>
          ) : null}
        />
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