import { View, Image, TextInput } from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'

const SearchBar = ({ placeholder, onPress, value, onChangeText }: any) => {
    return (
        <View className="flex-row items-center bg-light-background rounded-full overflow-hidden px-5 py-1">
            <Image source={icons.search} resizeMode="contain" className='size-5' tintColor="#fffafa" />
            <TextInput
                onPress={onPress}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#ccc"
                className="flex-1 ml-3 text-foreground"
            />
        </View>
    )
}

export default SearchBar