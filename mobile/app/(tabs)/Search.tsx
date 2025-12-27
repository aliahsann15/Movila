import MovieCard from '@/components/MovieCard'
import SearchBar from '@/components/SearchBar'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { fetchMovies } from '@/services/api'
import useFetch from '@/services/useFetch'
import React, { useEffect, useState } from 'react'
import Text from '@/components/ui/Text'
import { ActivityIndicator, FlatList, Image, View, StyleSheet } from 'react-native'

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
    <View style={styles.container}>
      <Image source={images.bg} style={styles.bgImage} />

      <FlatList
        data={movies}
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
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View style={styles.logoRow}>
              <Image source={icons.logo} style={styles.logo} />
            </View>

            <View style={styles.headerSpacing}>
              <SearchBar
                placeholder="Search for a Movie"
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </View>

            {loading && (
              <ActivityIndicator size="large" color="#6afdff" style={styles.headerSpacing} />
            )}

            {error && (
              <Text style={styles.errorText}>Error: {error?.message}</Text>
            )}

            {!loading && !error && searchQuery.trim() && movies?.length > 0 && (
              <Text style={styles.resultsTitle}>
                Search Results for {' '}
                <Text style={styles.accentText}>{`"${searchQuery}"`}</Text>
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View style={styles.emptyBox}>
              <Text>
                {searchQuery.trim() ? 'No movie found' : 'Search for a movie to see results'}
              </Text>
            </View>
          ) : null
        }
        style={styles.list}
      />
    </View >
  )
}

export default Search

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040c1c',
  },
  bgImage: {
    width: '100%',
    position: 'absolute',
    zIndex: 0,
  },
  logoRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 80,
  },
  logo: {
    width: 128,
    height: 128,
  },
  headerSpacing: {
    marginVertical: 20,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  resultsTitle: {
    fontSize: 20,
    marginTop: 40,
    marginBottom: 20,
    fontWeight: '700',
  },
  accentText: {
    color: '#6afdff',
  },
  emptyBox: {
    marginTop: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  list: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
});