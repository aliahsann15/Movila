import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import {
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Alert,
} from 'react-native'
import { Link } from 'expo-router'
import Text from '@/components/ui/Text'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '@/constants/icons'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loggingIn, setLoggingIn] = useState(false)
    const { signIn } = useAuth()

    const onSubmit = async () => {
        if (!email.trim()) { Alert.alert('Error', 'Please enter your email'); return }
        if (!password.trim()) { Alert.alert('Error', 'Please enter your password'); return }
        
        setLoggingIn(true)
        try {
            console.log('Starting login with email:', email)
            await signIn(email, password)
            console.log('Login successful!')
        } catch (e) {
            console.error('Login error:', e)
            // @ts-ignore
            Alert.alert('Login Failed', e?.message || 'Login failed')
        } finally {
            setLoggingIn(false)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', gap: 16, backgroundColor: '#040c1c' }}>
            <View style={{ alignItems: 'center', gap: 8, marginVertical: 40 }}>
                <Image style={{ width: 180, height: 180, alignSelf: 'center' }} source={icons.logo} />
                <Text style={styles.heading}>log In</Text>
            </View>

            {/* Profile Pic - Image Input  */}
            <View style={{ gap: 8 }}>
                <Text style={{ marginTop: 12 }}>Email<Text style={{ color: '#ff0000' }}>*</Text></Text>
                <TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder="Enter your email" placeholderTextColor="#888" editable={!loggingIn} />
                <Text style={{ marginTop: 12 }}>Password<Text style={{ color: '#ff0000' }}>*</Text></Text>
                <TextInput value={password} onChangeText={setPassword} style={styles.input} placeholder="Enter your password" placeholderTextColor="#888" secureTextEntry editable={!loggingIn} />
                {/* Action Button */}
                <TouchableOpacity disabled={loggingIn} onPress={onSubmit} style={{ marginTop: 20, backgroundColor: '#6afdff', paddingVertical: 12, borderRadius: 8, alignItems: 'center', opacity: loggingIn ? 0.6 : 1 }}>
                    <Text style={{ color: '#040c1c', fontWeight: '600' }}>{loggingIn ? 'Logging In...' : 'Log In'}</Text>
                </TouchableOpacity>
                <Text style={{ marginTop: 16, color: '#ffffff', textAlign: 'center' }}>
                    Don&apos;t have an account?
                    <Link style={{ color: '#6afdff' }} href="/signup"> Sign Up</Link>
                </Text>
            </View>
        </SafeAreaView>
    )
}

export default Login

const styles = StyleSheet.create({
    heading: {
        fontSize: 32,
        fontWeight: '700' as const,
        color: '#6afdff',
    },
    imageWrapper: {
        width: 180,
        height: 180,
        borderRadius: 90,
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
        marginTop: 1,
        width: 300,
        height: 40,
        borderColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        color: '#fffafa',
    },
})