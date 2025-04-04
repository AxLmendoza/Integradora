import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'http://172.17.49.242:3001/api/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const validarDatos = () => {
    const mat = matricula.trim();
    const pass = password.trim();

    if (!mat || !pass) {
      Toast.show({
        type: 'error',
        text1: 'Campos incompletos',
        text2: 'Por favor ingresa tu matrícula y contraseña.',
      });
      return false;
    }

    if (!/^\d+$/.test(mat)) {
      Toast.show({
        type: 'error',
        text1: 'Matrícula inválida',
        text2: 'La matrícula debe contener solo números.',
      });
      return false;
    }

    if (pass.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Contraseña insegura',
        text2: 'La contraseña debe tener al menos 6 caracteres.',
      });
      return false;
    }

    if (/['"<>]/.test(pass)) {
      Toast.show({
        type: 'error',
        text1: 'Caracteres no permitidos',
        text2: 'La contraseña contiene caracteres especiales no permitidos.',
      });
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validarDatos()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          matricula: matricula.trim(), 
          password: password.trim() 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: '¡Bienvenido!',
          text2: `Hola ${data.nombre}, estamos cargando tu información...`,
        });

        await AsyncStorage.setItem('matricula', data.matricula);
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('nombre', data.nombre);
        await AsyncStorage.setItem('carrera', data.carrera);

        setTimeout(() => {
          router.replace(data.isAdmin ? '/ad_principal' : '/grupos');
        }, 2000);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Credenciales incorrectas',
          text2: 'Verifica tu matrícula y contraseña e intenta de nuevo.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error de conexión',
        text2: 'No se pudo conectar con el servidor. Verifica tu conexión.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/');
  };

  useFocusEffect(
    useCallback(() => {
      setMatricula('');
      setPassword('');
      return () => {
        setMatricula('');
        setPassword('');
      };
    }, [])
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ImageBackground source={require('@/assets/images/inicio_ses2.jpg')} style={styles.backgroundImage}>
          <View style={styles.overlay} />
          <View style={styles.contentContainer}>
            <Image source={require('@/assets/images/ardilla.png')} style={styles.logo} resizeMode="contain" />
            
            <View style={styles.switchContainer}>
              <TouchableOpacity 
                style={styles.switchButtonInactive} 
                onPress={() => router.push('/registro')}
              >
                <Text style={styles.switchTextInactive}>Regístrate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.switchButtonActive}>
                <Text style={styles.switchTextActive}>Inicia sesión</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Iniciar Sesión</Text>
            <Text style={styles.subtitle}>Ingresa tus credenciales para continuar</Text>

            <TextInput
              style={styles.input}
              placeholder="Matrícula"
              placeholderTextColor="#666"
              value={matricula}
              onChangeText={setMatricula}
              keyboardType="numeric"
              editable={!loading}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Contraseña"
                placeholderTextColor="#666"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? 'eye-off' : 'eye'} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.rememberContainer}>
              <TouchableOpacity 
                style={styles.rememberCheckbox}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <Ionicons 
                  name={rememberMe ? 'checkbox' : 'square-outline'} 
                  size={20} 
                  color="#ff6b00" 
                />
                <Text style={styles.rememberText}>Recordar mis datos</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </ScrollView>
      <Toast />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  contentContainer: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40
  },
  switchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 25,
    width: '100%',
    justifyContent: 'center'
  },
  switchButtonInactive: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center'
  },
  switchButtonActive: {
    backgroundColor: '#ff6b00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center'
  },
  switchTextInactive: {
    color: '#666',
    fontSize: 16
  },
  switchTextActive: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  logo: {
    width: 450,
    height: 230,
    marginBottom: 20
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center'
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#000'
  },
  passwordContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#000'
  },
  eyeIcon: {
    padding: 5
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
    alignItems: 'center'
  },
  rememberCheckbox: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rememberText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 14
  },
  forgotPassword: {
    color: '#ff6b00',
    fontSize: 14,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#ff6b00',
    padding: 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  registerText: {
    color: '#fff',
    fontSize: 16
  },
  registerLink: {
    color: '#ff6b00',
    fontWeight: 'bold',
    fontSize: 16
  }
});