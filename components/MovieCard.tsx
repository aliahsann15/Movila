import { Link } from 'expo-router'
import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import Text from './ui/Text'

const MovieCard = ({ id, poster_path, title, vote_average, release_date }: Movie) => {
    return (
        <Link href={`/movies/${id}`} asChild>
            <TouchableOpacity className="w-[30%]">
                <Image source={{
                    uri: poster_path ?
                        `https://image.tmdb.org/t/p/w500${poster_path}` :
                        'https://placehold.co/600x400/1a1a1a/ffffff.png'
                }}
                    className="w-full h-52 rounded-lg"
                />
                <Text className="mt-2 font-semibold" numberOfLines={1}>{title}</Text>
                <Text className="text-sm text-light-foreground">⭐ {vote_average?.toFixed(1)}/10</Text>
                <View className="flex-row items-center justify-between">
                    <Text className="text-sm text-light-foreground">{release_date?.split('-')[0]}</Text>
                    <Text className="text-sm text-light-foreground">Movie</Text>
                </View>

            </TouchableOpacity>

        </Link>
    )
}

export default MovieCard