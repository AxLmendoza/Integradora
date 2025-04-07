import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground, 
  BackHandler, 
  ActivityIndicator,
  Modal,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoutModal from '../../components/CloseSesModal';

export default function MenuScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Bloquear botón de retroceso físico
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.push('/grupos');
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [router])
  );

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      setLoading(true);
      setShowLogoutModal(false);
      
      // Limpiar solo las claves relevantes para mejorar rendimiento
      await AsyncStorage.multiRemove([
        'userToken',
        'userData',
        'sessionData',
        'authState',
        'lastLogin'
      ]);
      
      // Redirigir inmediatamente
      router.replace({
        pathname: '/inicio_ses',
        params: { forceRefresh: Date.now() }
      });
      
      // Mostrar feedback visual breve
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setLoading(false);
        setShowSuccess(false);
      }, 800); // Tiempo reducido al mínimo necesario
      
      return () => clearTimeout(timer);
      
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setLoading(false);
      Alert.alert('Error', 'Ocurrió un error al cerrar sesión', [
        {
          text: 'OK',
          onPress: () => router.replace('/inicio_ses')
        }
      ]);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/fondo.jpeg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      
      {/* Modal de carga ultra rápido */}
      <Modal
        transparent
        animationType="none" // Sin animación para máxima velocidad
        visible={loading}
        statusBarTranslucent
      >
        <View style={styles.loadingContainer}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#ff6b00" />
            <Text style={styles.loadingText}>Cerrando sesión...</Text>
          </View>
        </View>
      </Modal>
      
      {/* Modal de éxito instantáneo */}
      <Modal
        transparent
        animationType="fade"
        visible={showSuccess}
        statusBarTranslucent
      >
        <View style={styles.successContainer}>
          <View style={styles.successBox}>
            <Ionicons name="checkmark-circle" size={40} color="#4CAF50" />
            <Text style={styles.successText}>¡Sesión cerrada!</Text>
          </View>
        </View>
      </Modal>

      {/* Modal personalizado de confirmación */}
      <LogoutModal
        visible={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        loading={loading}
      />

      <View style={styles.container}>
        {/* Encabezado */}
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

        {/* Opciones del menú */}
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
            style={[styles.menuButton, loading && styles.disabledButton]}
            onPress={handleLogout}
            activeOpacity={0.7}
            disabled={loading}
          >
            <View style={styles.buttonContent}>
              {loading ? (
                <ActivityIndicator size="small" color="#ff6b00" />
              ) : (
                <Ionicons name="exit-outline" size={28} color="#ff6b00" />
              )}
              <Text style={styles.menuButtonText}>
                {loading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
              </Text>
            </View>
            {!loading && <Ionicons name="chevron-forward" size={24} color="#ff6b00" />}
          </TouchableOpacity>
        </View>

        {/* Pie de página */}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 200,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  successBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 200,
  },
  successText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  disabledButton: {
    opacity: 0.6,
  }
});