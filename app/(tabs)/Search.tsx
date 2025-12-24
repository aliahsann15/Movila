import MovieCard from '@/components/MovieCard'
import SearchBar from '@/components/SearchBar'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { fetchMovies } from '@/services/api'
import useFetch from '@/services/useFetch'
import React, { useState } from 'react'
import Text from '@/components/ui/Text'
import { ActivityIndicator, FlatList, Image, View } from 'react-native'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const { data: movies, loading: moviesLoading, error: moviesError } = useFetch(() => fetchMovies({ query: searchQuery }));

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
              <SearchBar placeholder="Search for a Movie" value={searchQuery} onChangeText={setSearchQuery} />
            </View>

            {moviesLoading && (
              <ActivityIndicator size="large" color="#0000ff" className='my-5' />
            )}

            {moviesError && (
              <Text className="text-red-500 text-center px-4 my-5">Error: {moviesError?.message}</Text>
            )}

            {!moviesLoading && !moviesError && searchQuery.trim() && movies?.length > 0 && (
              <Text className="text-xl mt-10 mb-5 font-bold text-center">
                Search Results for {' '}
                <Text className="text-accent">{`"${searchQuery}"`}</Text>
              </Text>

            )}
          </>
        }
        className="mt-2 pb-32 px-4"
      />
    </View>
  )
}

export default Search