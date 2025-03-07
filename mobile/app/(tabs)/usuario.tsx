import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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
          <Image source={require('../../assets/images/user.png')} style={styles.avatar} />
          <Text style={styles.rank}>CHIPMUNK EXPLORADOR</Text>
          <Text style={styles.name}>MEMO M</Text>
          <Text style={styles.subtitle}>ESTUDIANTE DE SOFTWARE</Text>
        </View>

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
    backgroundColor: '#F6F1E1', // Un fondo claro, suave y elegante
  },
  scrollView: {
    paddingBottom: 80, // Espacio para la barra de navegación inferior
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#F6F1E1', // Naranja vibrante para la cabecera
    paddingBottom: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFB74D', // Bordes de avatar dorado suave
    marginBottom: 10,
  },
  rank: {
    fontSize: 16,
    color: '#333', // Texto suave para el rango
    marginTop: 5,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
  statBox: {
    alignItems: 'center',
    marginHorizontal: 25,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2', // Azul suave para las estadísticas
  },
  statText: {
    fontSize: 14,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 15,
    marginVertical: 10,
  },
  card: {
    backgroundColor: 'rgba(25, 118, 210, 0.7)', // Azul translúcido suave para las tarjetas
    padding: 20,
    borderRadius: 10,
    marginRight: 15,
    width: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardText: {
    color: '#fff', // Texto blanco en las tarjetas
    fontSize: 14,
    lineHeight: 20,
  },
  groupCard: {
    backgroundColor: 'rgba(255, 87, 34, 0.7)', // Naranja translúcido para los grupos
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
    paddingLeft: 15,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#000', // Fondo oscuro para la barra de navegación
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
