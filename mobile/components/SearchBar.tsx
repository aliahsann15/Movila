import { View, Image, TextInput, StyleSheet } from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'

interface Props {
  placeholder: string;
  onPress?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
}

const SearchBar = ({ placeholder, onPress, value, onChangeText }: Props) => {
    return (
        <View style={styles.container}>
            <Image source={icons.search} resizeMode="contain" style={styles.icon} tintColor="#fffafa" />
            <TextInput
                onPress={onPress}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#ccc"
                style={styles.input}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        borderRadius: 9999,
        overflow: 'hidden',
        paddingHorizontal: 20,
        paddingVertical: 4,
    },
    icon: {
        width: 20,
        height: 20,
    },
    input: {
        flex: 1,
        marginLeft: 12,
        color: '#fffafa',
    },
});

export default SearchBar