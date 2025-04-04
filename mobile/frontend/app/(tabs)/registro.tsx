import React, { useState, useEffect, useCallback } from 'react';
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
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'http://172.17.49.242:3001/api/auth';

export default function RegisterScreen() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [matricula, setMatricula] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [carrera, setCarrera] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  // Limpieza de estados
  useFocusEffect(
    useCallback(() => {
      setImageUri(null);
      setMatricula('');
      setNombre('');
      setCorreo('');
      setPassword('');
      setCarrera('');
      setIsImageUploaded(false);
      return () => {
        setImageUri(null);
        setMatricula('');
        setNombre('');
        setCorreo('');
        setPassword('');
        setCarrera('');
        setIsImageUploaded(false);
      };
    }, [])
  );

  // Solicitar permisos
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permiso requerido', 
          'Para continuar con tu registro, necesitamos acceso a tu galería para verificar tu credencial.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Abrir configuración', onPress: () => ImagePicker.requestMediaLibraryPermissionsAsync() }
          ]
        );
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        base64: true,
        quality: 0.7,
        allowsEditing: true,
        aspect: [4, 3]
      });

      if (!pickerResult.canceled && pickerResult.assets?.length) {
        const asset = pickerResult.assets[0];
        setImageUri(asset.uri);
        setIsImageUploaded(true);
        await analyzeImage(asset.base64!);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo cargar la imagen. Intenta de nuevo.',
      });
    }
  };

  const analyzeImage = async (base64Image: string) => {
    setLoading(true);
    const apiKey = 'K89755268888957';
    const ocrUrl = 'https://api.ocr.space/parse/image';
    const formData = new FormData();
    formData.append('apikey', apiKey);
    formData.append('base64Image', `data:image/png;base64,${base64Image}`);
    formData.append('language', 'spa');

    try {
      const response = await fetch(ocrUrl, { method: 'POST', body: formData });
      const data = await response.json();

      if (data.ParsedResults?.length > 0) {
        const extractedText = data.ParsedResults[0].ParsedText;
        const lines: string[] = extractedText
          .split(/\r?\n/)
          .map((line: string) => line.trim())
          .filter((line: string) => line !== '');

        const matricula = lines.find((line) => /^\d{8}$/.test(line)) || '';
        const nameLines = lines.filter(line => /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(line));
        const sortedNames = nameLines.sort((a, b) => b.length - a.length);
        const probableFullName = sortedNames.slice(0, 3).join(' ');
        const cleanedName = probableFullName
          .replace(/\s{2,}/g, ' ')
          .trim()
          .split(' ')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(' ');

        if (matricula && cleanedName) {
          setMatricula(matricula);
          setNombre(cleanedName);
          Toast.show({
            type: 'success',
            text1: 'Credencial verificada',
            text2: 'Hemos extraído tu información correctamente.',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Credencial no reconocida',
            text2: 'Por favor verifica que la imagen sea clara y completa.',
          });
        }
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error de conexión',
        text2: 'No se pudo procesar la imagen. Intenta de nuevo.',
      });
    } finally {
      setLoading(false);
    }
  };

  const validarDatos = () => {
    if (!matricula || !nombre || !correo || !password || !carrera) {
      Toast.show({
        type: 'error',
        text1: 'Campos incompletos',
        text2: 'Todos los campos son obligatorios para registrarte.',
      });
      return false;
    }

    if (!/^\d{8}$/.test(matricula)) {
      Toast.show({
        type: 'error',
        text1: 'Matrícula inválida',
        text2: 'La matrícula debe tener exactamente 8 dígitos.',
      });
      return false;
    }

    if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(nombre)) {
      Toast.show({
        type: 'error',
        text1: 'Nombre inválido',
        text2: 'El nombre solo puede contener letras y espacios.',
      });
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      Toast.show({
        type: 'error',
        text1: 'Correo inválido',
        text2: 'Ingresa un correo electrónico válido (ejemplo@dominio.com).',
      });
      return false;
    }

    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Contraseña insegura',
        text2: 'La contraseña debe tener al menos 6 caracteres.',
      });
      return false;
    }

    if (/['"<>]/.test(password)) {
      Toast.show({
        type: 'error',
        text1: 'Caracteres no permitidos',
        text2: 'La contraseña contiene caracteres especiales no permitidos.',
      });
      return false;
    }

    if (!imageUri) {
      Toast.show({
        type: 'error',
        text1: 'Credencial requerida',
        text2: 'Debes subir una foto de tu credencial para verificar tu identidad.',
      });
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validarDatos()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricula, nombre, correo, carrera, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: '¡Registro exitoso!',
          text2: 'Hemos enviado un código de verificación a tu correo.',
        });

        setTimeout(() => {
          router.replace(`/VerifyOtpScreen?correo=${encodeURIComponent(correo)}`);
        }, 2000);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error en registro',
          text2: data.error || 'No se pudo completar el registro. Intenta de nuevo.',
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

  const readOnlyInputStyles = StyleSheet.create({
    container: {
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
      justifyContent: 'center',
      height: 50,
    },
    text: {
      fontSize: 16,
      color: matricula ? '#000' : '#666',
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ImageBackground source={require('@/assets/images/fondo_registro.jpg')} style={styles.backgroundImage}>
          <View style={styles.overlay} />
          <View style={styles.contentContainer}>
            <Image source={require('@/assets/images/ardilla.png')} style={styles.logo} resizeMode="contain" />

            <View style={styles.switchContainer}>
              <TouchableOpacity style={styles.switchButtonActive}>
                <Text style={styles.switchTextActive}>Regístrate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.switchButtonInactive}
                onPress={() => router.push('/inicio_ses')}
              >
                <Text style={styles.switchTextInactive}>Inicia sesión</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Crear Cuenta</Text>
            <Text style={styles.subtitle}>Completa tus datos para registrarte</Text>

            <TouchableOpacity
              style={[styles.imageButton, isImageUploaded && styles.imageButtonSuccess]}
              onPress={pickImage}
              disabled={loading}
            >
              <Ionicons 
                name={isImageUploaded ? 'checkmark-circle' : 'camera'} 
                size={24} 
                color="#fff" 
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>
                {isImageUploaded ? 'Credencial verificada' : 'Subir credencial'}
              </Text>
            </TouchableOpacity>

            <View style={readOnlyInputStyles.container}>
              <Text style={readOnlyInputStyles.text}>
                {matricula || 'Matrícula (se autocompleta)'}
              </Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              placeholderTextColor="#666"
              value={nombre}
              onChangeText={(text) => {
                const sanitizedText = text.replace(/[^a-zA-ZÁÉÍÓÚÑáéíóúñ\s]/g, '');
                setNombre(sanitizedText);
              }}
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#666"
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={carrera}
                onValueChange={setCarrera}
                style={styles.picker}
                enabled={!loading}
                dropdownIconColor="#666"
              >
                <Picker.Item label="Selecciona tu carrera" value="" />
                <Picker.Item label="Ingeniería en Software" value="Ingeniería en Software" />
                <Picker.Item label="Administración de Empresas" value="Administración de Empresas" />
                <Picker.Item label="Arquitectura" value="Arquitectura" />
              </Picker>
            </View>

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
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Registrarse</Text>
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
  pickerContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden'
  },
  picker: {
    height: 50,
    width: '100%',
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
  imageButton: {
    backgroundColor: 'rgba(255, 107, 0, 0.8)',
    padding: 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  imageButtonSuccess: {
    backgroundColor: 'rgba(40, 167, 69, 0.8)'
  },
  buttonIcon: {
    marginRight: 10
  },
  button: {
    backgroundColor: '#ff6b00',
    padding: 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginTop: 10
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
});