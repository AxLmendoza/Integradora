import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MenuScreen() {
  const router = useRouter();

  return (
    <ImageBackground
    source={require('../../assets/images/ad_fondo.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Encabezado */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/ad_principal')}>
            <Ionicons name="arrow-back" size={30} color="#000" />
          </TouchableOpacity>

          {/* Icono de usuario */}
          <TouchableOpacity onPress={() => router.push('/(tabs)/ad_usuario')}>
            <Ionicons name="person-sharp" size={30} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Título MENÚ centrado */}
        <Text style={styles.title}>MENÚ</Text>

        {/* Opciones del menú */}
        <View style={styles.menuItems}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push('/(tabs)/usuario')}
          >
            <Ionicons name="person" size={26} color="#000" />
            <Text style={styles.menuButtonText}>Cuenta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push('/(tabs)/grupos')}
          >
            <Ionicons name="shield-checkmark" size={26} color="#000" />
            <Text style={styles.menuButtonText}>Privacidad</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push('/(tabs)/grupos')}
          >
            <Ionicons name="book" size={26} color="#000" />
            <Text style={styles.menuButtonText}>Publicaciones</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push('/inicio_ses')}
          >
            <Ionicons name="exit-outline" size={26} color="#000" />
            <Text style={styles.menuButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push('/registro')}
          >
            <Ionicons name="trash" size={26} color="#000" />
            <Text style={styles.menuButtonText}>Eliminar cuenta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push('/grupos')}
          >
            <Ionicons name="hammer" size={26} color="#000" />
            <Text style={styles.menuButtonText}>Usuario</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Ajuste para crear un espaciado equilibrado
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop:10,
    marginBottom: 10, // Reducido para mejorar el espaciado
    alignSelf: 'stretch',
  },

    title: {
    fontSize: 32, // Aumenté el tamaño del texto
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginVertical: 10, // Mantuve el margen vertical para separación adecuada
  },
  menuItems: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    
    paddingVertical: 20, // Aumenté el padding vertical
    marginVertical: 12, // Aumenté el espacio entre los botones
    borderRadius: 12, // Bordes redondeados más pronunciados
    elevation: 6, // Sombra más pronunciada para dar el efecto flotante
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonText: {
    marginLeft: 20, // Aumenté el espacio entre el icono y el texto
    fontSize: 20, // Aumenté el tamaño del texto
    color: '#000',
    fontWeight: '500',
  },
});

