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
  Alert,
  Dimensions,
  StatusBar,
  ScrollView,
  BackHandler
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InvalidIdModal from '@/components/InvalidIdModal';
import IncompleteFieldsModal from '@/components/IncompleteFieldsModal';
import { Ionicons } from '@expo/vector-icons';
import WelcomeModal from '@/components/WelcomeModal';

const API_URL = 'http://192.168.1.107:3001/api/auth';
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
const isSmallDevice = screenHeight < 600;

const showAlert = (title: string, message: string) => {
  Alert.alert(title, message, [{ text: 'OK' }]);
};

export default function LoginScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [showInvalidIdModal, setShowInvalidIdModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Manejo del botón físico de retroceso
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.push('/home');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [router])
  );

  const validarDatos = () => {
    const mat = matricula.trim();
    const pass = password.trim();

    if (!mat || !pass) {
      setShowIncompleteModal(true);
      return false;
    }

    if (!/^\d+$/.test(mat)) {
      setShowInvalidIdModal(true);
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
        setUserName(data.nombre);
        setShowWelcomeModal(true);
        await AsyncStorage.setItem('matricula', data.matricula);
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('nombre', data.nombre);
        await AsyncStorage.setItem('carrera', data.carrera);

        setTimeout(() => {
          router.replace(data.isAdmin ? '/ad_principal' : '/grupos');
        }, 2000);
      } else {
        showAlert('Credenciales incorrectas', 'Verifica tu matrícula y contraseña e intenta de nuevo.');
      }
    } catch (error) {
      showAlert('Error de conexión', 'No se pudo conectar con el servidor. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    showAlert('Restablecer contraseña', 'Se enviará un enlace a tu correo institucional para restablecer tu contraseña.');
  };

  // Limpiar campos al enfocar
  useFocusEffect(
    useCallback(() => {
      setMatricula('');
      setPassword('');
    }, [])
  );

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <ImageBackground
        source={require('@/assets/images/fondo_registro.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.contentContainer}>
          <Image
            source={require('@/assets/images/ardilla.png')}
            style={styles.logo}
            resizeMode="contain"
          />

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

          <TouchableOpacity 
            style={styles.forgotPasswordButton}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

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

      <IncompleteFieldsModal
        visible={showIncompleteModal}
        onClose={() => setShowIncompleteModal(false)}
      />
      <InvalidIdModal
        visible={showInvalidIdModal}
        onClose={() => setShowInvalidIdModal(false)}
      />
      <WelcomeModal
        visible={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        userName={userName}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    minHeight: screenHeight,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  backgroundImage: {
    flex: 1,
    width: screenWidth,
    minHeight: screenHeight,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  contentContainer: {
    alignItems: 'center',
    padding: 20,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    paddingTop: (StatusBar.currentHeight || 0) + (isSmallDevice ? 10 : 20),
    paddingBottom: 80,
  },
  switchContainer: {
    flexDirection: 'row',
    marginBottom: isSmallDevice ? 15 : 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 25,
    width: '100%',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  switchButtonInactive: {
    paddingVertical: isSmallDevice ? 10 : 12,
    paddingHorizontal: 20,
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  switchButtonActive: {
    paddingVertical: isSmallDevice ? 10 : 12,
    paddingHorizontal: 20,
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ff6b00',
  },
  switchTextInactive: {
    color: '#666',
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: '500'
  },
  switchTextActive: {
    color: '#fff',
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: 'bold'
  },
  logo: {
    width: isSmallDevice ? '70%' : '80%',
    height: isSmallDevice ? 140 : 180,
    marginBottom: isSmallDevice ? 15 : 20,
    maxWidth: 350
  },
  title: {
    color: '#fff',
    fontSize: isSmallDevice ? 22 : 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: isSmallDevice ? 12 : 14,
    marginBottom: isSmallDevice ? 15 : 20,
    textAlign: 'center',
    paddingHorizontal: 20
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: isSmallDevice ? 12 : 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: isSmallDevice ? 14 : 16,
    color: '#000',
    minHeight: isSmallDevice ? 45 : 50,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  passwordContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15,
    minHeight: isSmallDevice ? 45 : 50,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  passwordInput: {
    flex: 1,
    padding: isSmallDevice ? 12 : 15,
    fontSize: isSmallDevice ? 14 : 16,
    color: '#000'
  },
  eyeIcon: {
    padding: 5
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: '#ff6b00',
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#ff6b00',
    padding: isSmallDevice ? 12 : 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    minHeight: isSmallDevice ? 45 : 50,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: '#fff',
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: '600'
  }
});