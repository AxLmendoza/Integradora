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
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import CustomModal from '@/components/CustomModal';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'http://192.168.0.101:3001/api/auth';

// Obtener dimensiones de la pantalla
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isAndroid = Platform.OS === 'android';


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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const showModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };



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
      showModal('Error', 'No se pudo cargar la imagen. Intenta de nuevo.');
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
          showModal('Credencial verificada', 'Hemos extraído tu información correctamente.');;
        } else {
          showModal('Credencial no reconocida', 'Por favor verifica que la imagen sea clara y completa.');;
        }
      }
    } catch (error) {
      showModal('Error de conexión', 'No se pudo procesar la imagen. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const validarDatos = () => {
    if (!matricula || !nombre || !correo || !password || !carrera) {
      showModal('Campos incompletos', 'Todos los campos son obligatorios para registrarte.');
      return false;
    }

    if (!/^\d{8}$/.test(matricula)) {
      showModal('Matrícula inválida', 'La matrícula debe tener exactamente 8 dígitos.');
      return false;
    }

    if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(nombre)) {
      showModal('Nombre inválido', 'El nombre solo puede contener letras y espacios.');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      showModal('Correo inválido', 'Ingresa un correo electrónico válido (ejemplo@dominio.com).');
      return false;
    }

    if (password.length < 6) {
      showModal('Contraseña insegura', 'La contraseña debe tener al menos 6 caracteres.');
      return false;
    }

    if (/['"<>]/.test(password)) {
      showModal('Caracteres no permitidos', 'La contraseña contiene caracteres especiales no permitidos.');
      return false;
    }

    if (!imageUri) {
      showModal('Credencial requerida', 'Debes subir una foto de tu credencial para verificar tu identidad.'
      );
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
        showModal('¡Registro exitoso!', 'Hemos enviado un código de verificación a tu correo.');

        setTimeout(() => {
          router.replace(`/VerifyOtpScreen?correo=${encodeURIComponent(correo)}`);
        }, 2000);
      } else {
        showModal('Error en registro', data.error || 'No se pudo completar el registro. Intenta de nuevo.');
      }
    } catch (error) {
      showModal('Error de conexión', 'No se pudo conectar con el servidor. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={isAndroid ? 'height' : 'padding'}
      style={styles.container}
      keyboardVerticalOffset={isAndroid ? StatusBar.currentHeight : 0}
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

          <View style={styles.readOnlyInput}>
            <Text style={styles.readOnlyInputText}>
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
              mode="dropdown"
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
      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />  
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: 1000,
    justifyContent: 'center'
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
    marginTop: isAndroid ? StatusBar.currentHeight : 0
  },
  switchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  switchButtonActive: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ff6b00',
  },
  switchTextInactive: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500'
  },
  switchTextActive: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  logo: {
    width: '80%',
    height: 180,
    marginBottom: 20,
    maxWidth: 350
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20
  },
  readOnlyInput: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'center',
    minHeight: 50,
    elevation: 2,
  },
  readOnlyInputText: {
    fontSize: 16,
    color: '#000',
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
    minHeight: 50,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  pickerContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)'
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
    paddingRight: 15,
    minHeight: 50,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)'
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
    backgroundColor: 'rgba(255, 107, 0, 0.9)',
    padding: 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 50,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  imageButtonSuccess: {
    backgroundColor: 'rgba(40, 167, 69, 0.9)'
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
    marginTop: 10,
    minHeight: 50,
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
    fontSize: 18,
    fontWeight: '600'
  },
});