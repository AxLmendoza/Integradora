import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MenuScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('@/assets/images/fondo.jpeg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Encabezado */}
        <View style={styles.header}>
          {/* Botón de regreso (opcional) */}
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={30} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}>MENÚ</Text>

          {/* Icono de usuario en la esquina */}
          <TouchableOpacity>
            <Ionicons name="person-circle" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Opciones del menú */}
        <View style={styles.menuItems}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push('/(tabs)/usuario')} // Navega a usuarios.tsx
          >
            <Ionicons name="person" size={20} color="#000" />
            <Text style={styles.menuButtonText}>CUENTA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push('/(tabs)/grupos')}
          >
            <Ionicons name="shield-checkmark" size={20} color="#000" />
            <Text style={styles.menuButtonText}>PRIVACIDAD</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push('/(tabs)/grupos')}
          >
            <Ionicons name="book" size={20} color="#000" />
            <Text style={styles.menuButtonText}>PUBLICACIONES</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push('/(tabs)/grupos')}
          >
            <Ionicons name="exit-outline" size={20} color="#000" />
            <Text style={styles.menuButtonText}>CERRAR SESIÓN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push('/(tabs)/grupos')}
          >
            <Ionicons name="trash" size={20} color="#000" />
            <Text style={styles.menuButtonText}>ELIMINAR CUENTA</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1
  },
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  menuItems: {
    marginTop: 20
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginVertical: 8,
    padding: 12,
    borderRadius: 10
  },
  menuButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000'
  }
});
