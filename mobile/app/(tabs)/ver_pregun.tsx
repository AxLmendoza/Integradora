import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, FlatList, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function VerPregun() {
  const { id } = useLocalSearchParams(); // Obtener el ID de la pregunta seleccionada
  const router = useRouter(); // Inicializar el enrutador

  // Ejemplo de datos para respuestas con votos
  const [respuestas, setRespuestas] = useState([
    {
      id: '1',
      autor: 'Alejandra M', 
      avatar: require('../../assets/images/user.png'),
      texto: 'React Native permite el desarrollo de aplicaciones móviles usando JavaScript y React, compilando el código a componentes nativos.',
      votos: 5,
    },
    {
      autor: 'Axel M', 
      avatar: require('../../assets/images/user.png'),
      id: '2',
      texto: 'React Native es una librería que permite crear interfaces de usuario nativas para iOS y Android utilizando JavaScript.',
      votos: 3,
    },
  ]);

  // Función para votar por una respuesta
  const votarRespuesta = (idRespuesta) => {
    setRespuestas((prevRespuestas) => 
      prevRespuestas.map((resp) => 
        resp.id === idRespuesta 
          ? { ...resp, votos: resp.votos + 1 } 
          : resp
      )
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/images/fondo.jpeg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Capa de overlay */}
      <View style={styles.overlay} />

      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/buscar_pre')}>
          <Ionicons name="arrow-back" size={30} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/usuario')}>
          <Ionicons name="person" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Text style={styles.headerText}>PREGUNTA</Text>
        <Text style={styles.questionText}>¿Cómo funciona React Native?</Text>

        <Text style={styles.answerTitle}>RESPUESTAS</Text>

        {/* Mostrar las respuestas con opción de votar */}
        <FlatList
          data={respuestas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.answerContainer}>
              <View style={styles.userContainer}>
                <Image source={item.avatar} style={styles.userAvatar} />
                <Text style={styles.autor}>{item.autor}</Text>
              </View>
              <Text style={styles.answerText}>{item.texto}</Text>
              <View style={styles.voteContainer}>
                <Text style={styles.voteCount}>Votos: {item.votos}</Text>
                <TouchableOpacity
                  style={styles.voteButton}
                  onPress={() => votarRespuesta(item.id)}
                >
                  <Ionicons name="thumbs-up" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      {/* Barra de navegación inferior */}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Fondo semitransparente
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  questionText: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 15,
  },
  answerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
  },
  answerContainer: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 15,
    borderRadius: 8,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  answerText: {
    fontSize: 16,
    color: '#333',
  },
  voteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  voteCount: {
    fontSize: 16,
    color: '#000',
  },
  voteButton: {
    padding: 5,
  },
  navbar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
});
