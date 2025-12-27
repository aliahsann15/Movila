
import Text from '@/components/ui/Text';
import { icons } from '@/constants/icons';
import { useAuth } from '@/context/AuthContext';
import { fetchMovieDetails } from '@/services/api';
import useFetch from '@/services/useFetch';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { Linking } from 'react-native';
import { ActivityIndicator, Image, ScrollView, TouchableOpacity, View, StyleSheet, Alert, Dimensions, Modal, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

type MovieDetailsType = {
  id: number;
  title: string;
  tagline?: string;
  genres?: { id: number; name: string }[];
  vote_average?: number;
  release_date?: string;
  runtime?: number;
  overview?: string;
  backdrop_path?: string;
  videos?: { results: { key: string; site: string; type: string }[] };
};

const MovieDetails = () => {
  const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://192.168.100.194:5000/api';
  const { user, token } = useAuth();
  const userID = user?._id || user?.id;
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: movie, loading, error, refetch } = useFetch<MovieDetailsType>(() => fetchMovieDetails(id), true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerError, setTrailerError] = useState(false);
  const [trailerLoading, setTrailerLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Check if movie is saved by user
  useEffect(() => {
    const checkSaved = async () => {
      if (!user || !userID || !id) {
        setIsSaved(false);
        return;
      }
      try {
        const response = await fetch(`${API_BASE}/users/${userID}/saved`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        if (!response.ok) {
          setIsSaved(false);
          return;
        }
        const result = await response.json();
        if (Array.isArray(result.data)) {
          setIsSaved(result.data.some((m: any) => m.id?.toString() === id?.toString()));
        } else {
          setIsSaved(false);
        }
      } catch {
        setIsSaved(false);
      }
    };
    checkSaved();
  }, [user, userID, id, token, API_BASE]);

  // Find trailer from videos if available (YouTube preferred)
  useEffect(() => {
    if (movie && movie.videos && Array.isArray(movie.videos.results)) {
      const yt = movie.videos.results.find(
        (v) => v.site === 'YouTube' && v.type === 'Trailer'
      );
      if (yt) setTrailerKey(yt.key);
      else setTrailerKey(null);
    } else {
      setTrailerKey(null);
    }
  }, [movie]);

  const handleSaveMovie = async () => {
    if (!user || !userID) {
      Alert.alert('Login Required', 'Please log in to save/remove movies.');
      return;
    }
    setSaving(true);
    try {
      if (isSaved) {
        // Remove from saved
        const response = await fetch(`${API_BASE}/users/${userID}/saved/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        if (!response.ok) {
          const result = await response.json().catch(() => ({}));
          Alert.alert('Error', result.error || 'Failed to remove movie.');
        } else {
          setIsSaved(false);
        }
      } else {
        // Add to saved
        const response = await fetch(`${API_BASE}/users/${userID}/saved`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ movie }),
        });
        if (!response.ok) {
          const result = await response.json().catch(() => ({}));
          Alert.alert('Error', result.error || 'Failed to save movie.');
        } else {
          setIsSaved(true);
        }
      }
    } catch {
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setSaving(false);
    }
  };



  if (loading) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={[styles.centerBox, { padding: 16 }]}>
        <Text style={{ color: '#ef4444' }}>Error: {error.message}</Text>
      </View>
    );
  }
  if (!movie) {
    return (
      <View style={styles.centerBox}>
        <Text>No movie details found</Text>
      </View>
    );
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6afdff" />
        }
      >
        {movie.backdrop_path && (
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` }}
            style={styles.backdrop}
            resizeMode="cover"
          />
        )}

        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.fab, { left: 16 }]}
          accessibilityLabel="Go back"
        >
          <Image
            source={icons.arrow}
            style={{ width: 24, height: 24, transform: [{ rotate: '180deg' }] }}
            tintColor="white"
          />
        </TouchableOpacity>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSaveMovie}
          style={[styles.fab, { right: 16, backgroundColor: saving ? '#334155' : 'rgba(0,0,0,0.5)' }]}
          disabled={saving}
          accessibilityLabel={isSaved ? 'Saved' : 'Save movie'}
        >
          <Image
            source={isSaved ? icons.bookmark : icons.save}
            style={{ width: 24, height: 24, opacity: saving ? 0.5 : 1 }}
            tintColor="white"
          />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>{movie.title}</Text>
          {movie.tagline && <Text style={styles.tagline}>{movie.tagline}</Text>}

          {/* Trailer Modal and Button */}
          {trailerKey && (
            <TouchableOpacity
              style={styles.trailerBtn}
              onPress={() => {
                const url = `https://www.youtube.com/watch?v=${trailerKey}`;
                Linking.openURL(url);
              }}
              accessibilityLabel="Watch Trailer"
            >
              <Text style={styles.trailerBtnText}>▶ Watch Trailer</Text>
            </TouchableOpacity>
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
    </SafeAreaView>
  );
};

export default MovieDetails

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  trailerBtn: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: '#0ea5e9',
    borderRadius: 9999,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginBottom: 20,
  },
  trailerBtnText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    top: 20,
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
    marginBottom: 6,
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