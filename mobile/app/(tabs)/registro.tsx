import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    TextInput,
    Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

const RegisterScreen = () => {
    const router = useRouter();
    const [selectedProgram, setSelectedProgram] = useState('');

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/images/personas_2.jpg')} style={styles.backgroundImage}>
                <View style={styles.overlay} />
                <View style={styles.contentContainer}>
                    <Image source={require('../../assets/images/ardilla_naranja.png')} style={styles.logo} resizeMode="contain" />
                    <View style={styles.switchContainer}>
                        <TouchableOpacity style={styles.switchButtonActive}>
                            <Text style={styles.switchTextActive}>Regístrate</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.switchButtonInactive} onPress={() => router.push('/inicio_ses')}>
                            <Text style={styles.switchTextInactive}>Inicia sesión</Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput style={styles.input} placeholder="Usuario" placeholderTextColor="#666" />
                    <TextInput style={styles.input} placeholder="Correo electrónico" placeholderTextColor="#666" />
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedProgram}
                            onValueChange={(itemValue) => setSelectedProgram(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Selecciona un programa educativo" value="" />
                            <Picker.Item label="Matemáticas" value="matematicas" />
                            <Picker.Item label="Ciencias" value="ciencias" />
                            <Picker.Item label="Historia" value="historia" />
                            <Picker.Item label="Literatura" value="literatura" />
                        </Picker>
                    </View>
                    <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#666" secureTextEntry />
                    <TextInput style={styles.input} placeholder="Confirmar contraseña" placeholderTextColor="#666" secureTextEntry />
                    <TouchableOpacity style={styles.button} onPress={() => router.push('./inicio_ses')}>
                        <Text style={styles.buttonText}>Crear cuenta</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/inicio_ses')}>
                        <Text style={styles.linkText}>¿Ya tienes una cuenta? Inicia sesión</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

export default RegisterScreen;

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
    pickerContainer: { width: '100%', backgroundColor: '#fff', borderRadius: 10, marginBottom: 10 },
    picker: { width: '100%', height: 50, padding: 10 },
    button: { backgroundColor: '#ff6b00', padding: 12, borderRadius: 25, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
    linkText: { color: '#ff6b00', marginTop: 10, fontWeight: 'bold' }
});