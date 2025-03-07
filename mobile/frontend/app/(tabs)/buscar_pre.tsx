import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Modal, ImageBackground, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const preguntasEjemplo = [
  { id: '1', titulo: '¿Cómo funciona React Native?', autor: 'Alejandra M', avatar: require('@/assets/images/user.png') },
  { id: '2', titulo: '¿Qué es Expo Router?', autor: 'Memo M', avatar: require('@/assets/images/user.png') },
  { id: '3', titulo: '¿Cómo manejar estado en React Native?', autor: 'Karla Luna', avatar: require('@/assets/images/user.png') },
];

export default function BuscarPre() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState(preguntasEjemplo);

  // Filtra preguntas por el texto de búsqueda
  const filteredQuestions = questions.filter((item) =>
    item.titulo.toLowerCase().includes(query.toLowerCase())
  );

  // Agregar una nueva pregunta
  const addQuestion = () => {
    if (newQuestion.trim() !== '') {
      const newQ = { id: Date.now().toString(), titulo: newQuestion, autor: 'Usuario Anónimo', avatar: require('@/assets/images/user.png') };
      setQuestions([newQ, ...questions]);
      setNewQuestion('');
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/fondo.jpeg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        {/* Encabezado con iconos */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/menu')}>
            <Ionicons name="menu" size={30} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(tabs)/usuario')}>
            <Ionicons name="person-sharp" size={30} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Barra de búsqueda */}
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar preguntas..."
            placeholderTextColor="#666"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle-outline" size={28} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Contenedor de la lista para evitar solapamiento con la navbar */}
        <View style={{ flex: 1 }}>
          <FlatList
            data={filteredQuestions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => router.push(`/ver_pregun?id=${item.id}`)}
              >
                <View style={styles.userContainer}>
                  <Image source={item.avatar} style={styles.userAvatar} />
                  <Text style={styles.autor}>{item.autor}</Text>
                </View>
                <Text style={styles.itemText}>{item.titulo}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 50 }} // Espacio para la navbar
          />
        </View>

        {/* Modal para nueva pregunta */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Nueva Pregunta</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Escribe tu pregunta..."
                placeholderTextColor="#666"
                multiline
                value={newQuestion}
                onChangeText={setNewQuestion}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={addQuestion}
                >
                  <Text style={styles.modalButtonText}>Publicar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
  container: {
    flex: 1,
    backgroundColor: '#E0E0E0',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingTop: 30,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 30,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  item: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginVertical: 10,
    borderRadius: 12,
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
  itemText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },

  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalInput: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, marginBottom: 20, height: 100 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, alignItems: 'center' },
  cancelButton: { backgroundColor: '#f44336' },
  submitButton: { backgroundColor: '#4CAF50' },
  modalButtonText: { color: '#fff', fontWeight: 'bold' },
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
