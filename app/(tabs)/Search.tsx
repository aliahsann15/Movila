import MovieCard from '@/components/MovieCard'
import SearchBar from '@/components/SearchBar'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { fetchMovies } from '@/services/api'
import useFetch from '@/services/useFetch'
import React, { useEffect, useState } from 'react'
import Text from '@/components/ui/Text'
import { ActivityIndicator, FlatList, Image, View } from 'react-native'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data: movies,
    loading,
    error,
    refetch: loadMovies,
    reset
  } = useFetch(() => fetchMovies({
    query: searchQuery
  }), false);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        // Trigger fetch when searchQuery changes and is not empty
        await loadMovies();
      }
      else {
        // Reset movies data when searchQuery is empty
        reset();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View className="flex-1 bg-background">
      <Image source={images.bg} className="w-full absolute z-0" />

      <FlatList
        data={movies}
        renderItem={({ item }) => (
          <MovieCard
            {...item}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'center',
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className='w-full flex-row justify-center mt-20'>
              <Image source={icons.logo} className="w-32 h-32" />
            </View>

            <View className='my-5'>
              <SearchBar
                placeholder="Search for a Movie"
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </View>

            {loading && (
              <ActivityIndicator size="large" color="#6afdff" className='my-5' />
            )}

            {error && (
              <Text className="text-red-500 text-center px-4 my-5">Error: {error?.message}</Text>
            )}

            {!loading && !error && searchQuery.trim() && movies?.length > 0 && (
              <Text className="text-xl mt-10 mb-5 font-bold">
                Search Results for {' '}
                <Text className="text-accent">{`"${searchQuery}"`}</Text>
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5 items-center">
              <Text>
                {searchQuery.trim() ? 'No movie found' : 'Search for a movie to see results'}
              </Text>
            </View>
          ) : null
        }
        className="mt-2 pb-32 px-4"
      />
    </View >
  )
}

export default Search