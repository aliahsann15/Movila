import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import Text from "@/components/ui/Text";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import SearchBar from "@/components/SearchBar";
import { useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import MovieCard from "@/components/MovieCard";

export default function Index() {
  const router = useRouter();

  const { data: movies, loading: moviesLoading, error: moviesError } = useFetch(() => fetchMovies({ query: '' }));

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
            <SearchBar placeholder="Search for a Movie" onPress={() => { router.push('/Search') }} />
            <>
              <Text style={styles.sectionTitle}>Latest Movies</Text>

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
    paddingHorizontal: 20,
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
    marginTop: 40,
    marginBottom: 20,
    fontWeight: '700',
  },
  list: {
    marginTop: 8,
    paddingBottom: 128,
  },
});
