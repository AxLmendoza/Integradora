import * as React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Importar useRouter
import { Ionicons } from '@expo/vector-icons';

export default function VerPregun() {
  const { id } = useLocalSearchParams(); // Obtener el ID de la pregunta seleccionada
  const router = useRouter(); // Inicializar el enrutador

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
        <Text style={styles.answerTitle}>RESPUESTA</Text>
        <Text style={styles.answerText}>
          React Native permite el desarrollo de aplicaciones móviles usando JavaScript y React, compilando el código a componentes nativos.
        </Text>
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
    backgroundColor: '#FF9800',
  },

  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-start',
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
  answerText: {
    fontSize: 16,
    color: '#000',
    backgroundColor: '#FFC107',
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Fondo semitransparente
  },
});
