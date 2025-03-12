import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import * as ImagePicker from 'expo-image-picker';

export default function LoginScreen() {
  const router = useRouter();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [matricula, setMatricula] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Se necesitan permisos para acceder a la galería.');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        base64: true,
        quality: 0.5,
      });

      if (!pickerResult.canceled && pickerResult.assets.length > 0) {
        const asset = pickerResult.assets[0];
        setImageUri(asset.uri);
        if (asset.base64) {
          analyzeImage(asset.base64);
        }
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
      alert('Hubo un error al seleccionar la imagen.');
    }
  };

  const analyzeImage = async (base64Image: string) => {
    setLoading(true);
    const apiKey = 'K89755268888957'; // Reemplazar con una variable segura
    const url = 'https://api.ocr.space/parse/image';

    const formData = new FormData();
    formData.append('apikey', apiKey);
    formData.append('base64Image', `data:image/png;base64,${base64Image}`);
    formData.append('language', 'spa');

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.ParsedResults && data.ParsedResults.length > 0) {
        let extractedText = data.ParsedResults[0].ParsedText || '';
        console.log('Texto extraído:', extractedText);

        const lines = extractedText
          .split(/\r?\n/)
          .map(line => line.trim())
          .filter(line => line !== '' && !/^\d{10,}$/.test(line));

        let extractedMatricula = '';
        let extractedNombre = '';

        const matriculaRegex = /\b\d{8}\b/;
        for (const line of lines) {
          if (matriculaRegex.test(line)) {
            extractedMatricula = line.match(matriculaRegex)?.[0] || '';
            break;
          }
        }

        for (const line of lines) {
          if (!/\d/.test(line)) {
            const words = line.split(/\s+/);
            const countUpper = words.filter(word => /^[A-ZÁÉÍÓÚÑ]/.test(word)).length;
            if (countUpper >= 2) {
              extractedNombre = line;
              break;
            }
          }
        }

        setMatricula(extractedMatricula);
        setNombre(extractedNombre);
      }
    } catch (error) {
      console.error('Error en OCR:', error);
      alert('Hubo un error al procesar la imagen.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (!matricula.trim() || !password.trim()) {
      alert('Por favor ingresa tu matrícula y contraseña.');
      return;
    }

    console.log('Iniciando sesión con:', { usuario: matricula, contraseña: password });
    alert(`Bienvenido, ${nombre}. Has iniciado sesión correctamente.`);
    alert('Si tus datos están mal, vuelve a crear tu usuario. Validaremos que seas de la universidad UTTECAM; si no eres de la universidad, no podrás acceder a la aplicación y serás dado de baja.');
    
    router.push('/grupos');
  };

  return (
    <div>
      <h1>Pantalla de Inicio de Sesión</h1>
      {/* Aquí iría el formulario y los botones */}
    </div>
  );
}


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      {/* Botón para seleccionar imagen */}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Subir imagen</Text>
      </TouchableOpacity>

      {/* Mostrar imagen seleccionada */}
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      {loading && <ActivityIndicator size="large" color="#ff6b00" />}

      {/* Campos de entrada */}
      <TextInput
        style={styles.input}
        placeholder="Matrícula"
        placeholderTextColor="#666"
        value={matricula}
        editable={false}
        onChangeText={setMatricula}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#666"
        value={nombre}
        editable={false}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#666"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Botón de inicio de sesión */}
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