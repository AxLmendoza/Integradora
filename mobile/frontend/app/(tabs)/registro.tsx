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
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

const API_URL = 'http://192.168.0.101:3001/api/auth';

export default function RegisterScreen() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [matricula, setMatricula] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [carrera, setCarrera] = useState('');
  const [loading, setLoading] = useState(false);

  // Limpieza de estados
  useFocusEffect(
    useCallback(() => {
      setImageUri(null);
      setMatricula('');
      setNombre('');
      setCorreo('');
      setPassword('');
      setCarrera('');
      return () => {
        setImageUri(null);
        setMatricula('');
        setNombre('');
        setCorreo('');
        setPassword('');
        setCarrera('');
      };
    }, [])
  );

  // Solicitar permisos
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para subir tu credencial.');
      }
    })();
  }, []);

  // Seleccionar imagen
  const pickImage = async () => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.7,
      allowsEditing: true
    });

    if (!pickerResult.canceled && pickerResult.assets?.length) {
      const asset = pickerResult.assets[0];
      setImageUri(asset.uri);
      await analyzeImage(asset.base64!);
    }
  };

  // Analizar imagen con OCR
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

        // Extraer matrícula (solo lectura)
        const matricula = lines.find((line) => /^\d{8}$/.test(line)) || '';
        
        // Extraer nombre (editable)
        const nombre = lines
          .filter((line) => /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(line))
          .reduce((longest: string, current: string) => 
            (current.length > longest.length ? current : longest), '');

        if (matricula && nombre) {
          const cleanedNombre = nombre
            .replace(/\s{2,}/g, ' ')
            .trim();

          setMatricula(matricula);
          setNombre(cleanedNombre);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'No se pudo extraer la información de la credencial.',
          });
        }
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo procesar la imagen.',
      });
    }
    setLoading(false);
  };

  // Validar datos
  const validarDatos = () => {
    if (!matricula || !nombre || !correo || !password || !carrera) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Todos los campos son obligatorios.',
      });
      return false;
    }

    if (!/^\d{8}$/.test(matricula)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'La matrícula debe tener 8 dígitos.',
      });
      return false;
    }

    if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(nombre)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'El nombre solo puede contener letras y espacios.',
      });
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Ingresa un correo electrónico válido.',
      });
      return false;
    }

    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'La contraseña debe tener al menos 6 caracteres.',
      });
      return false;
    }

    if (/['"<>]/.test(password)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'La contraseña contiene caracteres no permitidos.',
      });
      return false;
    }

    if (!imageUri) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Debes subir una foto de tu credencial.',
      });
      return false;
    }

    return true;
  };

  // Registrar usuario
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
          text1: 'Registro exitoso',
          text2: 'Te hemos enviado un correo de verificación.',
        });

        setTimeout(() => {
          router.replace(`/VerifyOtpScreen?correo=${encodeURIComponent(correo)}`);
        }, 2000);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: data.error || 'No se pudo completar el registro.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo conectar con el servidor.',
      });
    }
    setLoading(false);
  };

  // Estilos dinámicos
  const readOnlyInputStyles = StyleSheet.create({
    container: {
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
    <View style={styles.container}>
      <ImageBackground source={require('@/assets/images/inicio_ses2.jpg')} style={styles.backgroundImage}>
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
          
          <TouchableOpacity 
            style={styles.imageButton}
            onPress={pickImage}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {imageUri ? '✓ Credencial seleccionada' : '📸 Subir credencial'}
            </Text>
          </TouchableOpacity>
          
          {/* Campo de matrícula (NO editable) */}
          <View style={readOnlyInputStyles.container}>
            <Text style={readOnlyInputStyles.text}>
              {matricula || 'Matrícula'}
            </Text>
          </View>
          
          {/* Campo de nombre (editable) */}
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
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
            >
              <Picker.Item label="Selecciona tu carrera" value="" />
              <Picker.Item label="Ingeniería en Software" value="Ingeniería en Software" />
              <Picker.Item label="Administración de Empresas" value="Administración de Empresas" />
              <Picker.Item label="Arquitectura" value="Arquitectura" />
            </Picker>
          </View>
          
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
          
          <TouchableOpacity
            style={styles.button}
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
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
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
    padding: 20 
  },
  switchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 25
  },
  switchButtonInactive: { 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 25 
  },
  switchButtonActive: { 
    backgroundColor: '#ff6b00', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 25 
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
    marginBottom: 20,
    textAlign: 'center'
  },
  input: { 
    width: '100%', 
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    padding: 15,
    borderRadius: 10, 
    marginBottom: 15,
    fontSize: 16
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
  },
  imageButton: {
    backgroundColor: 'rgba(255, 107, 0, 0.8)',
    padding: 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15
  },
  button: { 
    backgroundColor: '#ff6b00', 
    padding: 15, 
    borderRadius: 25, 
    width: '100%',
    alignItems: 'center' 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '600' 
  },
});