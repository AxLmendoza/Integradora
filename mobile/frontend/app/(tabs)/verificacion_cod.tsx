import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function VerificacionCodigoScreen() {
    const [codigo, setCodigo] = useState('');
    const router = useRouter();

    const handleSubmit = () => {
        const codigoCorrecto = '1234';  // Este es el código correcto para unirse
        if (codigo === codigoCorrecto) {
            Alert.alert('Código Correcto', 'Ahora puedes unirte al grupo', [
                { text: 'Aceptar', onPress: () => router.push('/grupo_priv') },  // Redirige al grupo si el código es correcto
            ]);
        } else {
            Alert.alert('Código Incorrecto', 'El código ingresado es incorrecto');
        }
    };

    return (
        <LinearGradient
            colors={['#FF8C00', '#FF4500']}
            style={styles.container}
        >
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Verificación de Código</Text>
                <Text style={styles.instructions}>
                    Ingresa el código para unirte al grupo "MATEMÁTICAS SIUUU"
                </Text>
                <TextInput
                    style={styles.input}
                    value={codigo}
                    onChangeText={setCodigo}
                    placeholder="Código"
                    keyboardType="numeric"
                    placeholderTextColor="#aaa"
                />
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Verificar</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 10,
        width: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FF4500',
        marginBottom: 15,
        textAlign: 'center',
    },
    instructions: {
        fontSize: 16,
        color: '#444',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#FF8C00',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 15,
        fontSize: 16,
        marginBottom: 20,
        width: '100%',
        backgroundColor: '#f5f5f5',
    },
    button: {
        backgroundColor: '#FF8C00',
        paddingVertical: 12,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
