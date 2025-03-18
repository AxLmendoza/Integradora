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
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.1.1.118:3001/api/auth';

export default function RegisterScreen() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [matricula, setMatricula] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [carrera, setCarrera] = useState('');
  const [loading, setLoading] = useState(false);

  // Solicita permisos al iniciar la app
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

  // Seleccionar imagen y extraer texto con OCR
  const pickImage = async () => {
    console.log('Seleccionando imagen...');
    const pickerResult = await ImagePicker.launchImageLibraryAsync({ 
      base64: true, 
      quality: 0.7, // Aumenta la calidad de la imagen
      allowsEditing: true // Permite recortar imagen antes de procesarla
    });
  
    if (!pickerResult.canceled && pickerResult.assets?.length) {
      const asset = pickerResult.assets[0];
      setImageUri(asset.uri);
      console.log('Imagen seleccionada:', asset.uri);
      await analyzeImage(asset.base64!);
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
    formData.append('isTable', 'true'); // Activa el modo tabla si la imagen tiene estructura
  
    try {
      console.log('Enviando imagen a OCR...');
      const response = await fetch(ocrUrl, { method: 'POST', body: formData });
      const data = await response.json();
      console.log('Respuesta OCR:', data);
  
      if (data.ParsedResults?.length > 0) {
        const extractedText = data.ParsedResults[0].ParsedText;
        console.log('Texto extraído:', extractedText);
  
        const lines = extractedText
          .split(/\r?\n/)
          .map((line: string) => line.trim())
          .filter((line: string) => line !== '');
  
        const extractedMatricula = lines.find((line: string) => /^\d{8}$/.test(line)) || '';
        let extractedNombre = lines.find((line: string) => /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(line)) || '';
  
        if (extractedMatricula && extractedNombre) {
          // Formateo más inteligente del nombre
          extractedNombre = extractedNombre
          .replace(/\s{2,}/g, ' ') // Eliminar espacios extra
          .split(/\s+/)
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Especificar tipo string
          .join(' ');
        
  
          setMatricula(extractedMatricula);
          setNombre(extractedNombre);
        } else {
          Alert.alert('Error', 'No se pudo extraer la matrícula o el nombre correctamente.');
        }
      }
    } catch (error) {
      console.error('Error en OCR:', error);
      Alert.alert('Error', 'Hubo un problema al procesar la imagen.');
    }
    setLoading(false);
  };
  
    

  // Inicio de sesión o registro automático
  const handleLogin = async () => {
    if (!matricula || !password || !correo || !carrera) {
      Alert.alert('Error', 'Debe ingresar todos los datos.');
      return;
    }

    try {
      console.log('Enviando login con:', { matricula, password });
      let response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricula, password }),
      });
      let data = await response.json();
      console.log('Respuesta login:', data);

      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('carrera', carrera);  // Guardar carrera en AsyncStorage
        Alert.alert('Bienvenido', `Hola, ${nombre}.`);
        router.push('/grupos');
        return;
      }

      // Si el error indica "Usuario no encontrado", registramos automáticamente
      if (data.error && data.error.toLowerCase().includes('no encontrado')) {
        console.log('Usuario no encontrado, registrando...');
        const regResponse = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matricula, nombre, correo, carrera, password }),
        });
        const regData = await regResponse.json();
        console.log('Respuesta registro:', regData);

        if (!regResponse.ok) {
          throw new Error(regData.error || 'Error en el registro');
        }

        Alert.alert('Registro', 'Usuario registrado. Iniciando sesión...');

        // Luego, intenta login nuevamente
        response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matricula, password }),
        });
        data = await response.json();
        if (response.ok) {
          await AsyncStorage.setItem('token', data.token);
          await AsyncStorage.setItem('carrera', carrera);  // Guardar carrera en AsyncStorage después del registro
          Alert.alert('Bienvenido', `Hola, ${nombre}.`);
          router.push('/inicio_ses');
          return;
        } else {
          throw new Error(data.error || 'Error al iniciar sesión después del registro');
        }
      } else {
        throw new Error(data.error || 'Error en el login');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error en login:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor: ' + errorMessage);
    }
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
            <Text style={styles.buttonText}>Subir imagen (Extraer credencial)</Text>
          </TouchableOpacity>
          {loading && <ActivityIndicator size="large" color="#ff6b00" />}
          <TextInput style={styles.input} placeholder="Matrícula" value={matricula} editable={false} />
          <TextInput style={styles.input} placeholder="Nombre" value={nombre} editable={false} />
          <TextInput style={styles.input} placeholder="Correo electrónico" value={correo} onChangeText={setCorreo} />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={carrera}
              onValueChange={(value) => setCarrera(value)}
              style={styles.picker}
            >
              <Picker.Item label="Seleccione su carrera" value="" />
              <Picker.Item label="Ingeniería en Software" value="Ingeniería en Software" />
              <Picker.Item label="Administración de Empresas" value="Administración de Empresas" />
              <Picker.Item label="Arquitectura" value="Arquitectura" />
            </Picker>
          </View>
          <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={!matricula || !password || !correo || !carrera}>
          <Text style={styles.buttonText}>Crear cuenta</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
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