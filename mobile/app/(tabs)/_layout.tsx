import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { Tabs } from 'expo-router'
import React from 'react'
import { Image, ImageBackground, Text, View, StyleSheet } from 'react-native'

const TabStyle = ({ focused, icon, title }: any) => {
    if (focused) {
        return (
            <ImageBackground
                source={images.highlight}
                style={styles.focusedTab}
            >
                <Image source={icon} tintColor="#040c1c" style={styles.icon} />
                <Text style={styles.focusedTitle}>{title}</Text>
            </ImageBackground>
        )
    }
    return (
        <View style={styles.unfocusedTab}>
            <Image source={icon} tintColor="#fff" style={styles.icon} />
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

const styles = StyleSheet.create({
    focusedTab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 14,
        minHeight: 59,
        minWidth: 112,
        borderRadius: 9999,
        overflow: 'hidden',
    },
    unfocusedTab: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9999,
        marginTop: 14,
    },
    icon: {
        width: 20,
        height: 20,
    },
    focusedTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
        color: '#040c1c',
    },
});