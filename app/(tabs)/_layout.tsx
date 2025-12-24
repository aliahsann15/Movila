import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { Tabs } from 'expo-router'
import React from 'react'
import { Image, ImageBackground, Text, View } from 'react-native'

const TabStyle = ({ focused, icon, title }: any) => {
    if (focused) {
        return (
            <ImageBackground
                source={images.highlight}
                className='flex flex-1 flex-row items-center justify-center mt-3.5 min-h-[3.7rem] min-w-[112px] rounded-full overflow-hidden'
            >
                <Image source={icon} tintColor='#040c1c' className='size-5' />
                <Text className="text-base font-medium ml-2">{title}</Text>
            </ImageBackground>
        )
    }
    return (
        <View className='size-full items-center justify-center rounded-full mt-3.5'>
            <Image source={icon} tintColor='#fff' className='size-5' />
        </View>
    )
}

const _layout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    width: '100%',
                    height: "100%",
                    justifyContent: 'center',
                    alignItems: 'center'
                },
                tabBarStyle: {
                    backgroundColor: '#1e293b',
                    borderRadius: 50,
                    marginHorizontal: 20,
                    marginBottom: 30,
                    height: 52,
                    position: 'absolute',
                    overflow: 'hidden',
                    borderWidth: 0,
                    borderColor: 'transparent',
                    paddingHorizontal: 18,
                }
            }}
        >
            <Tabs.Screen
                name="Index"
                options={{
                    headerShown: false,
                    title: 'Home',
                    tabBarIcon: ({ focused }) => (
                        <TabStyle focused={focused} icon={icons.home} title="Home" />
                    )
                }}
            />
            <Tabs.Screen
                name="Search"
                options={{
                    headerShown: false,
                    title: 'Search',
                    tabBarIcon: ({ focused }) => (
                        <TabStyle focused={focused} icon={icons.search} title="Search" />
                    )
                }}
            />
            <Tabs.Screen
                name="Saved"
                options={{
                    headerShown: false,
                    title: 'Saved',
                    tabBarIcon: ({ focused }) => (
                        <TabStyle focused={focused} icon={icons.save} title="Saved" />
                    )
                }}
            />
            <Tabs.Screen
                name="Profile"
                options={{
                    headerShown: false,
                    title: 'Profile',
                    tabBarIcon: ({ focused }) => (
                        <TabStyle focused={focused} icon={icons.person} title="Profile" />
                    )
                }}
            />
        </Tabs>
    )
}

export default _layout