import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    TextInput,
    Image
} from 'react-native';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/images/personas_2.jpg')} style={styles.backgroundImage}>
                <View style={styles.overlay} />
                <View style={styles.contentContainer}>
                    <Image source={require('../../assets/images/ardilla_naranja.png')} style={styles.logo} resizeMode="contain" />
                    <View style={styles.switchContainer}>
                        <TouchableOpacity style={styles.switchButtonInactive} onPress={() => router.push('/registro')}>
                            <Text style={styles.switchTextInactive}>Regístrate</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.switchButtonActive}>
                            <Text style={styles.switchTextActive}>Inicia sesión</Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput style={styles.input} placeholder="Usuario" placeholderTextColor="#666" />
                    <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#666" secureTextEntry />
                    <TouchableOpacity>
                        <Text style={styles.forgotPassword}>Olvidé mi contraseña</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Iniciar sesión</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/registro')}>
                        <Text style={styles.linkText}>¿No tienes una cuenta? Regístrate</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },
    backgroundImage: { flex: 1, justifyContent: 'center' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
    contentContainer: { alignItems: 'center', padding: 20 },
    switchContainer: { flexDirection: 'row', marginBottom: 20, backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 25 },
    switchButtonInactive: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25 },
    switchButtonActive: { backgroundColor: '#ff6b00', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25 },
    switchTextInactive: { color: '#666', fontSize: 16 },
    switchTextActive: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    logo: { width: 150, height: 150, marginBottom: 20 },
    input: { width: '100%', backgroundColor: '#fff', padding: 10, borderRadius: 10, marginBottom: 10 },
    button: { backgroundColor: '#ff6b00', padding: 12, borderRadius: 25, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
    linkText: { color: '#ff6b00', marginTop: 10, fontWeight: 'bold' },
    forgotPassword: { color: '#ff6b00', marginBottom: 10, fontWeight: 'bold' }
});