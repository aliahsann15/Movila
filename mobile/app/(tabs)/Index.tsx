import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import Text from "@/components/ui/Text";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import SearchBar from "@/components/SearchBar";
import { useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMovies, fetchTrendingMoviesOfMonth, fetchMoviesByGenre } from "@/services/api";
import MovieCard from "@/components/MovieCard";

export default function Index() {
  const router = useRouter();

  const { data: movies, loading: moviesLoading, error: moviesError } = useFetch(() => fetchMovies({ query: '' }));
  const { data: trending } = useFetch(fetchTrendingMoviesOfMonth);
  const { data: actionMovies } = useFetch(() => fetchMoviesByGenre('Action'));
  const { data: horrorMovies } = useFetch(() => fetchMoviesByGenre('Horror'));
  const { data: sciFiMovies } = useFetch(() => fetchMoviesByGenre('SciFi'));
  const { data: mysteryMovies } = useFetch(() => fetchMoviesByGenre('Mystery'));
  const { data: animationMovies } = useFetch(() => fetchMoviesByGenre('Animation'));

  return (
    <SafeAreaView style={styles.safeArea}>
      <Image source={images.bg} style={styles.bgImage} />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image source={icons.logo} style={styles.logo} />

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
            <SearchBar
              placeholder="Search for a Movie"
              onPress={() => { router.push('/Search') }}
            />
            {/* Trending Movies */}
            <>
              <Text style={styles.sectionTitle}>Trending Movies</Text>
              <FlatList
                data={trending}
                renderItem={({ item }) => (
                  <MovieCard
                    {...item}
                    cardStyle={{ width: 140, marginRight: 20 }}
                  />
                )}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.list}
                contentContainerStyle={{ gap: 0, paddingRight: 0, paddingBottom: 0 }}
              />
            </>

            {/* Latest Movies */}
            <>
              <Text style={styles.sectionTitle}>Latest Movies</Text>
              <FlatList
                data={movies}
                renderItem={({ item }) => (
                  <MovieCard
                    {...item}
                    cardStyle={{ width: 140, marginRight: 20 }}
                  />
                )}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.list}
                contentContainerStyle={{ gap: 0, paddingRight: 0, paddingBottom: 0 }}
              />
            </>

            {/* Action Movies */}
            <>
              <Text style={styles.sectionTitle}>Action Movies</Text>
              <FlatList
                data={actionMovies}
                renderItem={({ item }) => (
                  <MovieCard
                    {...item}
                    cardStyle={{ width: 140, marginRight: 20 }}
                  />
                )}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.list}
                contentContainerStyle={{ gap: 0, paddingRight: 0, paddingBottom: 10 }}
              />
            </>

            {/* Sci-Fi Movies */}
            <>
              <Text style={styles.sectionTitle}>Sci-Fi Movies</Text>
              <FlatList
                data={sciFiMovies}
                renderItem={({ item }) => (
                  <MovieCard
                    {...item}
                    cardStyle={{ width: 140, marginRight: 20 }}
                  />
                )}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.list}
                contentContainerStyle={{ gap: 0, paddingRight: 0, paddingBottom: 10 }}
              />
            </>

            {/* Horror Movies */}
            <>
              <Text style={styles.sectionTitle}>Horror Movies</Text>
              <FlatList
                data={horrorMovies}
                renderItem={({ item }) => (
                  <MovieCard
                    {...item}
                    cardStyle={{ width: 140, marginRight: 20 }}
                  />
                )}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.list}
                contentContainerStyle={{ gap: 0, paddingRight: 0, paddingBottom: 10 }}
              />
            </>

            {/* Mystery Movies */}
            <>
              <Text style={styles.sectionTitle}>Mystery Movies</Text>
              <FlatList
                data={mysteryMovies}
                renderItem={({ item }) => (
                  <MovieCard
                    {...item}
                    cardStyle={{ width: 140, marginRight: 20 }}
                  />
                )}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.list}
                contentContainerStyle={{ gap: 0, paddingRight: 0, paddingBottom: 10 }}
              />
            </>

            {/* Animation Movies */}
            <>
              <Text style={styles.sectionTitle}>Animation Movies</Text>
              <FlatList
                data={animationMovies}
                renderItem={({ item }) => (
                  <MovieCard
                    {...item}
                    cardStyle={{ width: 140, marginRight: 20 }}
                  />
                )}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.list}
                contentContainerStyle={{ gap: 0, paddingRight: 0, paddingBottom: 10 }}
              />
            </>

          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#040c1c',
  },
  bgImage: {
    width: '100%',
    position: 'absolute',
    zIndex: 0,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  logo: {
    width: 128,
    height: 128,
    marginTop: 40,
    marginBottom: 16,
    alignSelf: 'center',
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
    marginTop: 10,
    marginBottom: 5,
    fontWeight: '700',
  },
  list: {
    marginTop: 4,
    paddingBottom: 24,
  },
});
