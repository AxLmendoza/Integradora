import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [matricula, setMatricula] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesitan permisos para acceder a la galería.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.5 });
    if (!pickerResult.canceled) {
      const asset = pickerResult.assets[0];
      setImageUri(asset.uri);
      analyzeImage(asset.base64!);
    }
  };

  const analyzeImage = async (base64Image: string) => {
    setLoading(true);
    const apiKey = 'K89755268888957';
    const url = 'https://api.ocr.space/parse/image';
    const formData = new FormData();
    formData.append('apikey', apiKey);
    formData.append('base64Image', 'data:image/png;base64,' + base64Image);
    formData.append('language', 'spa');

    try {
      const response = await fetch(url, { method: 'POST', body: formData });
      const data = await response.json();
      console.log('OCR Response:', data);

      if (data.ParsedResults?.length > 0) {
        let extractedText = data.ParsedResults[0].ParsedText;
        console.log('Texto extraído:', extractedText);

        const lines = extractedText
        .split(/\r?\n/)
        .map((line: string) => line.trim()) // Aquí ya declaramos el tipo
        .filter((line: string) => line !== ''); // Aquí también      
      
        const extractedMatricula = lines.find((line: string) => /^\d{8}$/.test(line)) || ''
        const extractedNombre = lines.find((line: string) => /^[a-zA-Z\sÁÉÍÓÚÑáéíóúñ]+$/.test(line)) || '';

        setMatricula(extractedMatricula);
        setNombre(extractedNombre);
      }
    } catch (error) {
      console.error('Error en OCR:', error);
      Alert.alert('Error', 'Hubo un problema al procesar la imagen.');
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.83.127:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: matricula, contrasena: password }), // Asegúrate de usar "correo" en lugar de "matricula"
      });
  
      const data = await response.json();
      console.log('Respuesta del backend:', data); // <-- Agrega esto
  
      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        Alert.alert('Bienvenido', `Hola, ${nombre}.`);
        router.push('/grupos');
      } else {
        Alert.alert('Error', data.message || 'Credenciales incorrectas.');
      }
    } catch (error) {
      console.error('Error en login:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Subir imagen</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      {loading && <ActivityIndicator size="large" color="#ff6b00" />}
      <TextInput style={styles.input} placeholder="Matrícula" value={matricula} editable={false} />
      <TextInput style={styles.input} placeholder="Nombre" value={nombre} editable={false} />
      <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
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
  image: { width: 200, height: 200, marginVertical: 10, borderRadius: 10 },
});