import Text from '@/components/ui/Text'
import { icons } from '@/constants/icons'
import { fetchMovieDetails } from '@/services/api'
import useFetch from '@/services/useFetch'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { ActivityIndicator, Image, ScrollView, TouchableOpacity, View } from 'react-native'

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
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500">Error: {error.message}</Text>
      </View>
    )
  }

  if (!movie) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No movie details found</Text>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-background">

      {movie.backdrop_path && (
        <Image 
          source={{ uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` }}
          className="w-full h-64"
          resizeMode="cover"
        />
      )}
      
      <TouchableOpacity 
        onPress={() => router.back()}
        className="absolute top-12 left-4 bg-black/50 rounded-full p-2"
      >
        <Image 
          source={icons.arrow} 
          className="w-6 h-6 rotate-180"
          tintColor="white"
        />
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => {/* TODO: Implement save functionality */}}
        className="absolute top-12 right-4 bg-black/50 rounded-full p-2"
      >
        <Image 
          source={icons.save} 
          className="w-6 h-6"
          tintColor="white"
        />
      </TouchableOpacity>

      <View className="p-4">
        <Text className="text-2xl font-bold mb-2">{movie.title}</Text>
        {movie.tagline && (
          <Text className="text-lg italic mb-4">{movie.tagline}</Text>
        )}
        <View className="flex-row gap-2 mb-4">
          {movie.genres?.map((genre) => (
            <View key={genre.id} className="bg-light-background px-3 py-1 rounded-full">
              <Text>{genre.name}</Text>
            </View>
          ))}
        </View>
        <Text className="text-base mb-2">Rating: {movie.vote_average?.toFixed(1)}/10</Text>
        <Text className="text-base mb-2">Release Date: {movie.release_date}</Text>
        <Text className="text-base mb-4">Runtime: {movie.runtime} minutes</Text>
        <Text className="text-lg font-semibold mb-2">Overview</Text>
        <Text className="text-base text-justify">{movie.overview}</Text>
      </View>
    </ScrollView>
  )
}

export default MovieDetails