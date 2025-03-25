import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message'; // ✅ Importar Toast


const API_URL = process.env.API_URL || 'http://192.168.1.94:3001/api/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!matricula || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Todos los campos son obligatorios.',
      });
      return;
    }

    setLoading(true);
    try {
      console.log('📤 Enviando login con:', { matricula, password });

      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricula, password }),
      });

      const data = await response.json();
      console.log('📥 Respuesta login completa:', data);

      if (response.ok) {
        if (data.matricula) {
          await AsyncStorage.setItem('matricula', data.matricula);
        } else {
          console.warn("⚠️ Matricula no definida en la respuesta del servidor.");
        }

        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('nombre', data.nombre);
        await AsyncStorage.setItem('carrera', data.carrera);

        Alert.alert('Bienvenido', `Hola, ${data.nombre}`);

        // **Asegúrate de que data.isAdmin está correctamente procesado**
        if (data.isAdmin === true) {
          console.log("🛠️ Usuario es administrador, redirigiendo...");
          router.push('/ad_principal'); // 🔹 Redirige a admin
        } else {
          console.log("👤 Usuario normal, redirigiendo...");
          router.push('/grupos'); // 🔹 Redirige a grupos normales
        }
      } else {
        console.log("❌ Error en login:", data.error);
        Alert.alert('Error', data.error || 'Credenciales incorrectas.');
      }
    } catch (error) {
      console.error('🚨 Error en login:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('@/assets/images/inicio_ses2.jpeg')} style={styles.backgroundImage}>
        <View style={styles.overlay} />
        <View style={styles.contentContainer}>
          <Image source={require('@/assets/images/ardilla.png')} style={styles.logo} resizeMode="contain" />
          <View style={styles.switchContainer}>
            <TouchableOpacity style={styles.switchButtonInactive} onPress={() => router.push('/registro')}>
              <Text style={styles.switchTextInactive}>Regístrate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.switchButtonActive}>
              <Text style={styles.switchTextActive}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
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
      </ImageBackground>
      {/* ✅ Mostrar las notificaciones estilo WhatsApp */}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8))', // Gradiente de arriba a abajo
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  contentContainer: { alignItems: 'center', padding: 20 },
  switchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 25
  },
  switchButtonInactive: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25 },
  switchButtonActive: { backgroundColor: '#ff6b00', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25 },
  switchTextInactive: { color: '#666', fontSize: 16 },
  switchTextActive: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  logo: { width: 450, height: 230, marginBottom: 20 },
  input: { width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: 10, borderRadius: 10, marginBottom: 10 },
  button: { backgroundColor: '#ff6b00', padding: 12, borderRadius: 25, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  linkText: { color: '#ff6b00', marginTop: 10, fontWeight: 'bold' },
  forgotPassword: { color: '#ff6b00', marginBottom: 10, fontWeight: 'bold' },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerText: {
    color: '#ff6b00',
    fontSize: 16,
  },
  registerLink: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});



/*import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  ImageBackground,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.94:3001/api/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (!matricula || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Todos los campos son obligatorios.',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricula, password }),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('nombre', data.nombre);
        await AsyncStorage.setItem('carrera', data.carrera);
        Alert.alert('Bienvenido', `Hola, ${data.nombre}`);
        router.push(data.isAdmin ? '/ad_principal' : '/grupos');
      } else {
        Alert.alert('Error', data.error || 'Credenciales incorrectas.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('@/assets/images/inicio_ses2.jpeg')} style={styles.backgroundImage}>
        <View style={styles.overlay} />
        <View style={styles.contentContainer}>
          <Image source={require('@/assets/images/ardilla.png')} style={styles.logo} resizeMode="contain" />
          <TextInput
            style={styles.input}
            placeholder="Matrícula"
            value={matricula}
            onChangeText={setMatricula}
            keyboardType="numeric"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputPassword}
              placeholder="Contraseña"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Cargando...' : 'Iniciar Sesión'}</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1, justifyContent: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' },
  contentContainer: { alignItems: 'center', padding: 20 },
  logo: { width: 450, height: 230, marginBottom: 20 },
  input: { width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: 10, borderRadius: 10, marginBottom: 10 },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  inputPassword: { flex: 1 },
  button: { backgroundColor: '#ff6b00', padding: 12, borderRadius: 25, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
}); */