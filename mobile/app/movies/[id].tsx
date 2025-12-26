import Text from '@/components/ui/Text'
import { icons } from '@/constants/icons'
import { fetchMovieDetails } from '@/services/api'
import useFetch from '@/services/useFetch'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { ActivityIndicator, Image, ScrollView, TouchableOpacity, View, StyleSheet } from 'react-native'

const MovieDetails = () => {

  // fetch movie details using the id from the route params
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: movie, loading, error } = useFetch<MovieDetails>(
    () => fetchMovieDetails(id),
    true
  );

  if (loading) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.centerBox, { padding: 16 }] }>
        <Text style={{ color: '#ef4444' }}>Error: {error.message}</Text>
      </View>
    )
  }

  if (!movie) {
    return (
      <View style={styles.centerBox}>
        <Text>No movie details found</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>

      {movie.backdrop_path && (
        <Image 
          source={{ uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` }}
          style={styles.backdrop}
          resizeMode="cover"
        />
      )}
      
      <TouchableOpacity 
        onPress={() => router.back()}
        style={[styles.fab, { left: 16 }]}
      >
        <Image 
          source={icons.arrow} 
          style={{ width: 24, height: 24, transform: [{ rotate: '180deg' }] }}
          tintColor="white"
        />
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => {/* TODO: Implement save functionality */}}
        style={[styles.fab, { right: 16 }]}
      >
        <Image 
          source={icons.save} 
          style={{ width: 24, height: 24 }}
          tintColor="white"
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>
        {movie.tagline && (
          <Text style={styles.tagline}>{movie.tagline}</Text>
        )}
        <View style={styles.genreRow}>
          {movie.genres?.map((genre) => (
            <View key={genre.id} style={styles.genreChip}>
              <Text>{genre.name}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.body}>Rating: {movie.vote_average?.toFixed(1)}/10</Text>
        <Text style={styles.body}>Release Date: {movie.release_date}</Text>
        <Text style={[styles.body, { marginBottom: 16 }]}>Runtime: {movie.runtime} minutes</Text>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={[styles.body, { textAlign: 'justify' }]}>{movie.overview}</Text>
      </View>
    </ScrollView>
  )
}

export default MovieDetails

const styles = StyleSheet.create({
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#040c1c',
  },
  backdrop: {
    width: '100%',
    height: 256,
  },
  fab: {
    position: 'absolute',
    top: 48,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 9999,
    padding: 8,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  genreRow: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  genreChip: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    marginRight: 8,
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
});