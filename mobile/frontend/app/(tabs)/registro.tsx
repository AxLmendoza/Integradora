import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message'; // ✅ Importar Toast

const API_URL = process.env.API_URL || 'http://10.1.1.106:3001/api/auth';

export default function RegisterScreen() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [matricula, setMatricula] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [carrera, setCarrera] = useState('');
  const [loading, setLoading] = useState(false);

  // 📌 Solicita permisos de galería al iniciar
  useEffect(() => {
    (async () => {
      try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'Ve a configuración para permitir el acceso a la galería.');
        }
      } catch (error) {
        console.error('Error al solicitar permisos:', error);
      }
    })();
  }, []);

  // 📸 Seleccionar imagen y extraer datos con OCR
  const pickImage = async () => {
    console.log('📸 Seleccionando imagen...');
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.7,
      allowsEditing: true
    });

    if (!pickerResult.canceled && pickerResult.assets?.length) {
      const asset = pickerResult.assets[0];
      setImageUri(asset.uri);
      console.log('✅ Imagen seleccionada:', asset.uri);
      await analyzeImage(asset.base64!);
    }
  };

  // 🔍 Analizar la imagen con OCR y extraer matrícula y nombre (Corrección TypeScript)
  const analyzeImage = async (base64Image: string) => {
    setLoading(true);
    const apiKey = 'K89755268888957';
    const ocrUrl = 'https://api.ocr.space/parse/image';
    const formData = new FormData();
    formData.append('apikey', apiKey);
    formData.append('base64Image', `data:image/png;base64,${base64Image}`);
    formData.append('language', 'spa');

    try {
      console.log('📤 Enviando imagen a OCR...');
      const response = await fetch(ocrUrl, { method: 'POST', body: formData });
      const data = await response.json();
      console.log('📥 Respuesta OCR:', data);

      if (data.ParsedResults?.length > 0) {
        const extractedText = data.ParsedResults[0].ParsedText;
        console.log('📝 Texto extraído:', extractedText);

        const lines: string[] = extractedText
          .split(/\r?\n/)
          .map((line: string) => line.trim())
          .filter((line: string) => line !== '');

        // 🏷️ Extraer matrícula: Primer número de exactamente 8 dígitos
        const matricula = lines.find((line) => /^\d{8}$/.test(line)) || '';

        // 🔎 Extraer nombre: Buscar la línea de texto más larga sin números
        const nombre = lines
          .filter((line) => /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(line)) // Solo letras y espacios
          .reduce((longest: string, current: string) => (current.length > longest.length ? current : longest), '');

        if (matricula && nombre) {
          const formattedNombre = nombre
            .replace(/\s{2,}/g, ' ') // Eliminar espacios extra
            .trim()
            .split(/\s+/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalizar
            .join(' ');

          setMatricula(matricula);
          setNombre(formattedNombre);
          console.log(`✅ Matrícula: ${matricula}, Nombre: ${formattedNombre}`);
        } else {
          Alert.alert('Error', 'No se pudo extraer la matrícula o el nombre correctamente.');
        }
      } else {
        Alert.alert('Error', 'No se pudo analizar la imagen.');
      }
    } catch (error) {
      console.error('🚨 Error en OCR:', error);
      Alert.alert('Error', 'Hubo un problema al procesar la imagen.');
    }
    setLoading(false);
  };


  // 🔹 Registrar usuario (sin login automático)
  // 🔹 Registrar usuario
  const handleRegister = async () => {
    if (!matricula || !nombre || !correo || !carrera || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Todos los campos son obligatorios.',
      });
      return;
    }

    setLoading(true);
    try {
      console.log('📤 Enviando registro con:', { matricula, nombre, correo, carrera, password });

      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricula, nombre, correo, carrera, password }),
      });

      const data = await response.json();
      console.log('📥 Respuesta registro:', data);

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Registro exitoso',
          text2: 'Tu cuenta ha sido creada correctamente.',
        });

        setTimeout(() => {
          router.push('/inicio_ses'); // 🔹 Redirige manualmente al login
        }, 2000);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error en registro',
          text2: data.error || 'No se pudo registrar el usuario.',
        });
      }
    } catch (error) {
      console.error('🚨 Error en registro:', error);
      Toast.show({
        type: 'error',
        text1: 'Error de conexión',
        text2: 'No se pudo conectar con el servidor.',
      });
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('@/assets/images/fondo_registro.jpeg')} style={styles.backgroundImage}>
        <View style={styles.overlay} />
        <View style={styles.contentContainer}>
          <Image source={require('@/assets/images/ardilla.png')} style={styles.logo} resizeMode="contain" />
          <View style={styles.switchContainer}>
            <TouchableOpacity style={styles.switchButtonActive}>
              <Text style={styles.switchTextActive}>Regístrate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.switchButtonInactive} onPress={() => router.push('/inicio_ses')}>
              <Text style={styles.switchTextInactive}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>📸 Subir imagen (Extraer credencial)</Text>
          </TouchableOpacity>
          {loading && <ActivityIndicator size="large" color="#ff6b00" />}

          <TextInput style={styles.input} placeholder="Matrícula" value={matricula} editable={false} />
          <TextInput style={styles.input} placeholder="Nombre" value={nombre} editable={false} />
          <TextInput style={styles.input} placeholder="Correo" value={correo} onChangeText={setCorreo} />

          <View style={styles.pickerContainer}>
            <Picker selectedValue={carrera} onValueChange={setCarrera} style={styles.picker}>
              <Picker.Item label="Seleccione su carrera" value="" />
              <Picker.Item label="Ingeniería en Software" value="Ingeniería en Software" />
              <Picker.Item label="Administración de Empresas" value="Administración de Empresas" />
              <Picker.Item label="Arquitectura" value="Arquitectura" />
            </Picker>
          </View>

          <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={!matricula || !password || !correo || !carrera}>
            <Text style={styles.buttonText}>Crear cuenta</Text>
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
  backgroundImage: { flex: 1, justifyContent: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  contentContainer: { alignItems: 'center', padding: 20 },
  switchContainer: { flexDirection: 'row', marginBottom: 20, backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 25 },
  switchButtonInactive: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25 },
  switchButtonActive: { backgroundColor: '#ff6b00', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25 },
  switchTextInactive: { color: '#666', fontSize: 16 },
  switchTextActive: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  logo: { width: 150, height: 150, marginBottom: 20 },
  input: { width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: 10, borderRadius: 10, marginBottom: 10 },
  pickerContainer: { width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 10, marginBottom: 10 },
  picker: { width: '100%', height: 50, padding: 10 },
  button: { backgroundColor: '#ff6b00', padding: 12, borderRadius: 25, alignItems: 'center', marginBottom: 20 }, // Añado un margen inferior
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  linkText: { color: '#ff6b00', marginTop: 10, fontWeight: 'bold' },
  image: { width: 200, height: 200, marginBottom: 20 }, // Agrega esta línea
});