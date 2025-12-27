import { Link } from 'expo-router'
import React from 'react'
import { Image, TouchableOpacity, View, StyleSheet } from 'react-native'
import Text from './ui/Text'

const MovieCard = ({ id, poster_path, title, vote_average, release_date, cardStyle }: Movie & { cardStyle?: any }) => {
  // Only use default style if cardStyle is not provided
  const appliedStyle = cardStyle ? cardStyle : styles.card;
  return (
    <Link href={`/movies/${id}`} asChild>
      <TouchableOpacity style={appliedStyle}>
        <Image source={{
          uri: poster_path ?
            `https://image.tmdb.org/t/p/w500${poster_path}` :
            'https://placehold.co/600x400/1a1a1a/ffffff.png'
        }}
          style={styles.poster}
        />
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.subtext}>⭐ {vote_average?.toFixed(1)}/10</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.subtext}>{release_date?.split('-')[0]}</Text>
          <Text style={styles.subtext}>Movie</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

export default MovieCard

const styles = StyleSheet.create({
  card: {
    width: 140,
    marginRight: 20,
  },
  poster: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  title: {
    marginTop: 8,
    fontWeight: '600',
  },
  subtext: {
    fontSize: 14,
    color: '#94a3b8',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});