import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = `http://192.168.0.101:3001/api/auth/verify-otp`;

export default function VerifyOtpScreen() {
    const router = useRouter();
    const { correo } = useLocalSearchParams();
    const [otp, setOtp] = useState('');
    const [isResending, setIsResending] = useState(false);

    console.log("Enviando:", JSON.stringify({ correo, otp }));

    useFocusEffect(
        React.useCallback(() => {
            setOtp('');
            return () => {
                setOtp('');
            };
        }, [])
    );

    const handleVerifyOtp = async () => {
        try {
            const response = await fetch(`${API_URL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, otp }),
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert('✅ Éxito', 'Cuenta activada correctamente');
                router.replace('/inicio_ses');
            } else {
                Alert.alert('⚠️ Error', data.error || 'Código incorrecto o expirado');
            }
        } catch (error) {
            Alert.alert('🚨 Error', 'No se pudo verificar el código.');
        }
    };

    const handleResendOtp = async () => {
        setIsResending(true);
        try {
            const response = await fetch(`${API_URL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo }),
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert('📩 Código enviado', 'Se ha reenviado el código a tu correo.');
            } else {
                Alert.alert('⚠️ Error', data.error || 'No se pudo reenviar el código.');
            }
        } catch (error) {
            Alert.alert('🚨 Error', 'Hubo un problema al reenviar el código.');
        }
        setIsResending(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Verifica tu cuenta</Text>
                <Text style={styles.subtitle}>Introduce el código OTP enviado a</Text>
                <Text style={styles.email}>{correo}</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Código OTP"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="numeric"
                    maxLength={6}
                />

                <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
                    <Text style={styles.buttonText}>Verificar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.resendButton} onPress={handleResendOtp} disabled={isResending}>
                    <Text style={styles.resendText}>{isResending ? 'Reenviando...' : 'Reenviar código'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    card: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
    },
    email: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ff6b00',
        marginVertical: 5,
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginTop: 15,
        fontSize: 18,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#ff6b00',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resendButton: {
        marginTop: 15,
    },
    resendText: {
        color: '#007bff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});