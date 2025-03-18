import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.1.1.118:3001/api/auth'; // Asegúrate de que la IP y puerto sean correctos

export default function LoginScreen() {
  const router = useRouter();
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Función para iniciar sesión
  const handleLogin = async () => {
    if (!matricula || !password) {
      Alert.alert('Error', 'Debe ingresar matrícula y contraseña.');
      return;
    }

    setLoading(true);
    try {
      console.log('Enviando login con:', { matricula, password });
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricula, password }),
      });

      const data = await response.json();
      console.log('Respuesta login:', data);

      if (response.ok) {
        // Guardamos el token recibido
        await AsyncStorage.setItem('token', data.token);
        // Guardamos la carrera del usuario si viene en la respuesta
        if (data.carrera) {
          await AsyncStorage.setItem('carrera', data.carrera);
        }
        Alert.alert('Bienvenido', 'Inicio de sesión exitoso.');
        router.push('/grupos'); // Redirige a la pantalla principal
      } else {
        throw new Error(data.error || 'Error en el inicio de sesión');
      }
    } catch (error) {
      console.error('Error en login:', error);
      Alert.alert('Error', 'Verifica el usuario o la contraseña.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Matrícula"
        value={matricula}
        onChangeText={setMatricula}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#ff6b00' },
  input: { width: '100%', backgroundColor: '#eee', padding: 10, borderRadius: 10, marginBottom: 10 },
  button: { backgroundColor: '#ff6b00', padding: 12, borderRadius: 25, alignItems: 'center', width: '100%', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
