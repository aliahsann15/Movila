import React, { useEffect, useState } from 'react'
import {
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
    TextInput,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { Link } from 'expo-router'
import Text from '@/components/ui/Text'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import { useAuth } from '@/context/AuthContext'
const Signup = () => {
    const [imageUri, setImageUri] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [signingUp, setSigningUp] = useState<boolean>(false)
    const [fullName, setFullName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [bio, setBio] = useState<string>('')

    useEffect(() => {
        ; (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
            if (status !== 'granted') {
                Alert.alert('Permission required', 'Please allow access to your media library to select a profile picture.')
            }
        })()
    }, [])

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
            })

            // Handle both new and older result shapes
            if (!result.canceled) {
                const uri = (result as any).assets?.[0]?.uri ?? (result as any).uri
                if (uri) setImageUri(uri)
            }
        } catch (e) {
            console.warn('Image pick error', e)
        }
    }

    const { signUp } = useAuth()

    const handleSignup = async () => {
        setSigningUp(true)
        if (!fullName.trim()) { Alert.alert('Error', 'Please enter your full name'); setSigningUp(false); return }
        if (!email.trim()) { Alert.alert('Error', 'Please enter your email'); setSigningUp(false); return }
        if (!password.trim()) { Alert.alert('Error', 'Please enter a password'); setSigningUp(false); return }

        try {
            await signUp({ fullName, email, password, bio, profilePictureUrl: imageUri || undefined })
            setSigningUp(false)
        } catch (e) {
            // @ts-ignore
            Alert.alert('Signup Failed', e?.message || 'An error occurred during signup. Please try again.')
            setSigningUp(false)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, backgroundColor: '#040c1c' }}>
            <View>
                <Text style={styles.heading}>Sign Up</Text>
            </View>

            {/* Profile Pic - Image Input  */}
            <View style={{ alignItems: 'center', gap: 8 }}>
                <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.image} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Text style={styles.placeholderText}>Add Photo</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <Text style={{ color: '#ffffff', textAlign: 'center', marginTop: 8 }}>Profile Pic</Text>
                <View style={{ marginTop: 16 }}>
                    <Text style={{ marginTop: 12 }}>
                        Full Name
                        <Text style={{ color: '#ff0000' }}>*</Text>
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your Full Name"
                        placeholderTextColor="#888"
                        value={fullName}
                        onChangeText={setFullName}
                    />
                    <Text style={{ marginTop: 12 }}>
                        Email
                        <Text style={{ color: '#ff0000' }}>*</Text>
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your E-Mail"
                        placeholderTextColor="#888"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <Text style={{ marginTop: 12 }}>
                        Password
                        <Text style={{ color: '#ff0000' }}>*</Text>
                    </Text>
                    <View style={styles.passwordWrapper}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Set a Password"
                            placeholderTextColor="#888"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.iconButton}>
                            <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#fffafa" />
                        </TouchableOpacity>
                    </View>

                    {/* Optional Information */}
                    <Text style={{ marginTop: 12 }}>Bio</Text>
                    <TextInput
                        style={styles.areaInput}
                        placeholder="Write About Yourself"
                        placeholderTextColor="#888"
                        multiline
                        numberOfLines={4}
                        value={bio}
                        onChangeText={setBio}
                    />

                    {/* Action Button */}
                    <TouchableOpacity
                        onPress={handleSignup}
                        style={{ marginTop: 20, backgroundColor: '#6afdff', paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}>
                        <Text style={{ color: '#040c1c', fontWeight: '600' }}>
                            {signingUp ? 'Signing Up...' : 'Sign Up'}
                        </Text>
                    </TouchableOpacity>
                    <Text style={{ marginTop: 16, color: '#ffffff', textAlign: 'center' }}>
                        Already have an account?
                        <Link style={{ color: '#6afdff' }} href="/login"> Log In</Link>
                    </Text>
                </View>
            </View>

        </SafeAreaView>
    )
}

export default Signup


const styles = StyleSheet.create({
    heading: {
        fontSize: 32,
        fontWeight: '700' as const,
        color: '#6afdff',
    },
    imageWrapper: {
        width: 150,
        height: 150,
        borderRadius: 75,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholder: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1e293b',
    },
    placeholderText: {
        color: '#fffafa',
        fontSize: 14,
    },
    input: {
        textAlignVertical: 'center' as const,
        marginTop: 1,
        width: 300,
        height: 40,
        borderColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        color: '#fffafa',
    },
    areaInput: {
        textAlignVertical: 'top' as const,
        marginTop: 1,
        width: 300,
        height: 100,
        borderColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        color: '#fffafa',
    },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 300,
        height: 40,
        borderColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    passwordInput: {
        flex: 1,
        height: '100%',
        color: '#fffafa',
        paddingHorizontal: 4,
    },
    iconButton: {
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
})