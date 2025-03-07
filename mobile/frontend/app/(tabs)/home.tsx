import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ImageBackground, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  // Para navegar a otras pantallas con el nuevo router
  const router = useRouter(); // Corregido

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/personas_2.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >

        {/* Capa opcional para oscurecer o aclarar el fondo */}
        <View style={styles.overlay} />

        <View style={styles.contentContainer}>
          {/* Logo */}
          <Image
            source={require('@/assets/images/ardilla_naranja.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Título */}
          <Text style={styles.title}>Chipmunks Network</Text>

          {/* Subtítulo o descripción */}
          <Text style={styles.subtitle}>
            Únete a la mejor comunidad para estudiantes,
            forma grupos de estudio y comparte tus conocimientos.
          </Text>

          {/* Botón de Iniciar sesión */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/inicio_ses')} // Navega a la pantalla de inicio de sesión
          >
            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>

          {/* Enlace para registrarse */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No estás registrado? </Text>
            <TouchableOpacity
              onPress={() => {
                router.push('/registro'); // Navega a la pantalla de registro
              }}
            >
              <Text style={styles.registerLink}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 2,
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 190,
    height: 190,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#ff6b00',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerText: {
    color: '#fff',
    fontSize: 16,
  },
  registerLink: {
    color: '#ff6b00',
    fontWeight: 'bold',
    fontSize: 16,
  },
});