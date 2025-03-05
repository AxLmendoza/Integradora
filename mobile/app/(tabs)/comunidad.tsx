import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ComunidadChipmunksScreen() {
  const router = useRouter();

  // Lista de preguntas
  const preguntas = [
    { id: '1', titulo: '¿Cómo funciona React Native?', autor: 'Alejandra M', avatar: require('../../assets/images/user.png'), votos: 0 },
    { id: '2', titulo: '¿Qué es Expo Router?', autor: 'Memo M', avatar: require('../../assets/images/user.png'), votos: 0 },
    { id: '3', titulo: '¿Cómo manejar estado en React Native?', autor: 'Karla Luna', avatar: require('../../assets/images/user.png'), votos: 0 },
  ];

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
          <TouchableOpacity onPress={() => router.push('/usuario')}>
            <Ionicons name="person" size={30} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Título */}
        <Text style={styles.title}>COMUNIDAD CHIPMUNKS</Text>

        {/* Lista de preguntas */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {preguntas.map((pregunta) => (
            <View key={pregunta.id} style={styles.questionContainer}>
              <Text style={styles.autor}>{pregunta.autor}</Text>
              <Text>{pregunta.titulo}</Text>
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
    alignItems: 'center',
    paddingTop: 35,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000', // Título en color negro
  },
  userAvatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 10,
  },
  autor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
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
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#000',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
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
