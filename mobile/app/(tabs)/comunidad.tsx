import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ComunidadChipmunksScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Imagen de fondo */}
      <ImageBackground
        source={require('../../assets/images/fondo.jpeg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/elegir')}>
            <Ionicons name="arrow-back" size={30} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="person" size={30} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Título */}
        <Text style={styles.title}>COMUNIDAD CHIPMUNKS</Text>

        {/* Lista de preguntas */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.questionContainer}>
              <Text>Name User • Puntos • Hora de publicación</Text>
              <Text>Texto de la pregunta...</Text>
              <TouchableOpacity style={styles.button} onPress={() => router.push('/responder')}>
                <Text style={styles.buttonText}>Responder</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Barra de navegación */}
        <View style={styles.navbar}>
          <TouchableOpacity onPress={() => router.push('/grupos')}>
            <Ionicons name="home-outline" size={28} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/chat')}>
            <Ionicons name="chatbubble-ellipses-outline" size={28} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/elegir')}>
            <Ionicons name="arrow-up-circle-outline" size={28} color="#000" />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20, // Asegura un padding alrededor de los elementos
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 20, 
    color: '#000', // Título en color negro
  },
  scrollContainer: {
    flexGrow: 1, // Permite que el contenido de ScrollView ocupe todo el espacio disponible
    paddingBottom: 80, // Para dejar espacio suficiente para la barra de navegación
  },
  questionContainer: { 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ddd', 
    marginBottom: 10, 
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo ligeramente transparente para las preguntas
    borderRadius: 5
  },
  button: { 
    backgroundColor: '#000', 
    padding: 10, 
    marginTop: 10, 
    borderRadius: 5 
  },
  buttonText: { 
    color: '#fff', 
    textAlign: 'center' 
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
