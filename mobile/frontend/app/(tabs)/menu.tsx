import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, BackHandler, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function MenuScreen() {
  const router = useRouter();

  // Bloquear botón de retroceso físico
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.push('/grupos'); // Redirige a grupos en lugar de permitir retroceso
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [router])
  );

  return (
    <ImageBackground
      source={require('../../assets/images/fondo.jpeg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        {/* Encabezado mejorado */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.push('/grupos')}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={30} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Menú</Text>

          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/usuario')}
            style={styles.userButton}
          >
            <Ionicons name="person-sharp" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Opciones del menú simplificado */}
        <View style={styles.menuItems}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push('/(tabs)/usuario')}
            activeOpacity={0.7}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="person" size={28} color="#ff6b00" />
              <Text style={styles.menuButtonText}>Mi Cuenta</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ff6b00" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              Alert.alert(
                'Cerrar sesión',
                '¿Estás seguro que deseas salir?',
                [
                  {
                    text: 'Cancelar',
                    style: 'cancel'
                  },
                  {
                    text: 'Salir',
                    onPress: () => router.push('/inicio_ses')
                  }
                ]
              );
            }}
            activeOpacity={0.7}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="exit-outline" size={28} color="#ff6b00" />
              <Text style={styles.menuButtonText}>Cerrar Sesión</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ff6b00" />
          </TouchableOpacity>
        </View>

        {/* Pie de página con versión */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>Versión 1.0.0</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,165,0,0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  userButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  menuItems: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButtonText: {
    marginLeft: 15,
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});