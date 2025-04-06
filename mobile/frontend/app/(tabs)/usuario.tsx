import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Image, TouchableOpacity, AppState } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const publicaciones = [
  { id: '1', texto: 'Publicación 1: Programar es el arte de dar instrucciones a una computadora...' },
  { id: '2', texto: 'Publicación 2: Ejemplo de otra publicación.' }
];

const respuestas = [
  { id: '1', texto: 'Respuesta 1: Las redes informáticas permiten la conexión y el intercambio de datos...' },
  { id: '2', texto: 'Respuesta 2: Otra respuesta interesante.' }
];

const grupos = [
  { id: '1', nombre: 'Inglés' },
  { id: '2', nombre: 'DMM' },
  { id: '3', nombre: 'DSM' }
];

export default function PerfilScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    nombre: 'Cargando...',
    carrera: 'Cargando...',
    matricula: 'Cargando...'
  });

  const loadUserData = async () => {
    try {
      const [nombre, carrera, matricula] = await Promise.all([
        AsyncStorage.getItem('nombre'),
        AsyncStorage.getItem('carrera'),
        AsyncStorage.getItem('matricula')
      ]);
      
      if (nombre && carrera && matricula) {
        setUserData({
          nombre,
          carrera,
          matricula
        });
      } else {
        router.replace('/inicio_ses');
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      router.replace('/inicio_ses');
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        loadUserData();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/grupos')}>
          <Ionicons name="arrow-back" size={30} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/menu')}>
          <Ionicons name="menu" size={30} color="#000" />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.profileContainer}>
          <Image 
            source={require('../../assets/images/user_ardilla.png')} 
            style={styles.avatar} 
          />
          <Text style={styles.rank}>CHIPMUNK EXPLORADOR</Text>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {userData.nombre}
          </Text>
          <Text style={styles.subtitle}>
            ESTUDIANTE DE {userData.carrera.toUpperCase()}
          </Text>
          <Text style={styles.matricula}>
            Mi matrícula: {userData.matricula}
          </Text>
        </View>

        {/* Resto del código permanece igual */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>56</Text>
            <Text style={styles.statText}>PUBLICACIONES</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statText}>RESPUESTAS</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>MIS PUBLICACIONES</Text>
        <FlatList
          data={publicaciones}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardText}>{item.texto}</Text>
            </View>
          )}
          contentContainerStyle={styles.horizontalList}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={styles.sectionTitle}>MIS RESPUESTAS</Text>
        <FlatList
          data={respuestas}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardText}>{item.texto}</Text>
            </View>
          )}
          contentContainerStyle={styles.horizontalList}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={styles.sectionTitle}>MIS GRUPOS</Text>
        <FlatList
          data={grupos}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.groupCard}>
              <Ionicons name="people" size={50} color="#fff" />
              <Text style={styles.groupText}>{item.nombre}</Text>
            </View>
          )}
          contentContainerStyle={styles.horizontalList}
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>

      {/* Barra de navegación inferior */}
      <View style={styles.navbar}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F1E1',
  },
  scrollView: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#F6F1E1',
    paddingBottom: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFB74D',
    marginBottom: 10,
    backgroundColor: '#E0E0E0',
  },
  rank: {
    fontSize: 16,
    color: '#FF6B00',
    marginTop: 5,
    fontWeight: '600',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    maxWidth: '90%',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 5,
  },
  matricula: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 5,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    paddingVertical: 10,
    marginHorizontal: 20,
    elevation: 3,
  },
  statBox: {
    alignItems: 'center',
    marginHorizontal: 25,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  statText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
    marginVertical: 10,
    marginTop: 20,
  },
  card: {
    backgroundColor: 'rgba(25, 118, 210, 0.8)',
    padding: 20,
    borderRadius: 10,
    marginRight: 15,
    width: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  groupCard: {
    backgroundColor: 'rgba(255, 87, 34, 0.8)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 15,
    width: 120,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  groupText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  horizontalList: {
    paddingLeft: 20,
    paddingBottom: 10,
    paddingRight: 5,
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
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
});