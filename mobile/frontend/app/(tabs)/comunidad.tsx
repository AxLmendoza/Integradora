import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ImageBackground, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ComunidadChipmunksScreen() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');

  // Lista de preguntas
  const preguntas = [
    { id: '1', titulo: '¿Cómo funciona React Native?', autor: 'Alejandra M', avatar: require('../../assets/images/user.png'), votos: 0, fecha: '2025-03-05' },
    { id: '2', titulo: '¿Qué es Expo Router?', autor: 'Memo M', avatar: require('../../assets/images/user.png'), votos: 0, fecha: '2025-03-04' },
    { id: '3', titulo: '¿Cómo manejar estado en React Native?', autor: 'Karla Luna', avatar: require('../../assets/images/user.png'), votos: 0, fecha: '2025-03-03' },
  ];

  // Filtrar preguntas por nombre
  const filteredPreguntas = preguntas.filter(pregunta =>
    pregunta.titulo.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        {/* Barra de búsqueda */}
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar pregunta..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Título */}
        <Text style={styles.title}>COMUNIDAD CHIPMUNKS</Text>

        {/* Lista de preguntas */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {filteredPreguntas.map((pregunta) => (
            <View key={pregunta.id} style={styles.questionContainer}>
              <View style={styles.questionHeader}>
                <Image source={pregunta.avatar} style={styles.userAvatar} />
                <View>
                  <Text style={styles.autor}>{pregunta.autor}</Text>
                  <Text style={styles.questionDate}>{pregunta.fecha}</Text>
                </View>
              </View>
              <Text style={styles.questionTitle}>{pregunta.titulo}</Text>
              <TouchableOpacity style={styles.button} onPress={() => router.push('/responder')}>
                <Text style={styles.buttonText}>Responder</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Barra de navegación */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 35,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#FFF',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    marginBottom: 20,
    backgroundColor: '#FFF',
    fontSize: 16,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  autor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  questionDate: {
    fontSize: 12,
    color: '#888',
  },
  questionContainer: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80, // Espacio para la barra de navegación
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#000',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  whiteLine: {
    width: 65,
    height: 5,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0.5,
    left: '81%',
    marginLeft: -20,
    zIndex: 100,
  },
});
