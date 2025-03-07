import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Ionicons name="person-circle" size={100} color="#3b3b3b" style={styles.avatar} />
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
            <Ionicons name="people" size={50} color="#3b3b3b" />
            <Text style={styles.groupText}>{item.nombre}</Text>
          </View>
        )}
        contentContainerStyle={styles.horizontalList}
      />
    </ScrollView>

    
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFA500' 
  },
  profileContainer: { 
    alignItems: 'center', 
    marginBottom: 20 
  },
  avatar: { 
    marginBottom: 10 
  },
  rank: { 
    backgroundColor: '#ddd', 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 10, 
    marginTop: 10 
  },
  name: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginTop: 5 
  },
  subtitle: { 
    fontSize: 14, 
    color: '#333' 
  },
  statsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginVertical: 10 
  },
  statBox: { 
    alignItems: 'center', 
    marginHorizontal: 20 
  },
  statNumber: { 
    fontSize: 22, 
    fontWeight: 'bold' 
  },
  statText: { 
    fontSize: 14, 
    color: '#444' 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginHorizontal: 15, 
    marginTop: 20,
    borderBottomColor: '#ccc',
    paddingBottom: 13
  },
  horizontalList: { 
    paddingLeft: 20, 
    paddingRight: 20 
  },
  card: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 10, 
    marginRight: 10, 
    width: 320 
  },
  cardText: { 
    color: '#444' 
  },
  groupCard: { 
    backgroundColor: '#fff', 
    padding: 17, 
    borderRadius: 20, 
    marginRight: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: 105 
  },
  groupText: { 
    marginTop: 5, 
    fontSize: 14, 
    color: '#444' 
  }
});
