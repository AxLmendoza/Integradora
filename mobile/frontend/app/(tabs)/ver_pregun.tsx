import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, FlatList, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function VerPregun() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [respuestas, setRespuestas] = useState([
    {
      id: '1',
      autor: 'Alejandra M',
      avatar: require('../../assets/images/user.png'),
      texto: 'React Native permite el desarrollo de aplicaciones móviles usando JavaScript y React, compilando el código a componentes nativos.',
      votos: 5,
      fecha: '2025-03-05T08:30:00',
    },
    {
      autor: 'Axel M',
      avatar: require('../../assets/images/user.png'),
      id: '2',
      texto: 'React Native es una librería que permite crear interfaces de usuario nativas para iOS y Android utilizando JavaScript.',
      votos: 3,
      fecha: '2025-03-05T09:15:00',
    },
  ]);

  const votarRespuesta = (idRespuesta) => {
    setRespuestas((prevRespuestas) =>
      prevRespuestas.map((resp) =>
        resp.id === idRespuesta ? { ...resp, votos: resp.votos + 1 } : resp
      )
    );
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <ImageBackground
      source={require('../../assets/images/fondo.jpeg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

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

        <View style={styles.questionContainer}>
          <View style={styles.questionHeader}>
            <Image source={require('../../assets/images/user.png')} style={styles.userAvatar} />
            <View style={styles.questionInfo}>
              <Text style={styles.questionAuthor}>Alejandra M</Text>
              <Text style={styles.questionDate}>5 de Marzo, 2025</Text>
            </View>
          </View>
          <Text style={styles.questionText}>¿Cómo funciona React Native?</Text>
        </View>

        <Text style={styles.answerTitle}>RESPUESTAS</Text>

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
                  <Ionicons name="thumbs-up" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      <View style={styles.navbar}>
        <View style={styles.whiteLine}></View>
        <TouchableOpacity onPress={() => router.push('/grupos')}>
          <Ionicons name="home-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/chat')}>
          <Ionicons name="chatbubble-ellipses-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/elegir')}>
          <Ionicons name="arrow-up-circle-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 63, // Evitar que se tapen las respuestas por el navbar
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  questionContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    marginHorizontal: 20,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  questionInfo: {
    flexDirection: 'column',
  },
  questionAuthor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  questionDate: {
    fontSize: 14,
    color: '#888',
  },
  questionText: {
    fontSize: 20,
    color: '#333',
    fontWeight: '600',
  },
  answerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 20,
  },
  answerContainer: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 18,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  autor: {
    fontSize: 16,
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
    marginTop: 12,
  },
  voteCount: {
    fontSize: 16,
    color: '#000',
  },
  voteButton: {
    padding: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  navbar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#000',
    borderTopWidth: 2,
    borderTopColor: '#333',
  },
  whiteLine: {
    width: 65,
    height: 5,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0.5,
    left: '13%',
    marginLeft: -20,
    zIndex: 100,
  },
});