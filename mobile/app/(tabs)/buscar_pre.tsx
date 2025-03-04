import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Modal, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const preguntasEjemplo = [
  { id: '1', titulo: '¿Cómo funciona React Native?' },
  { id: '2', titulo: '¿Qué es Expo Router?' },
  { id: '3', titulo: '¿Cómo manejar estado en React Native?' },
];

export default function BuscarPre() {
  const router = useRouter();
  const [query, setQuery] = useState(''); // Usamos "query" para la búsqueda
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
      const newQ = { id: Date.now().toString(), titulo: newQuestion };
      setQuestions([newQ, ...questions]);
      setNewQuestion('');
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/fondo.jpeg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        {/* Barra de navegación superior */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/grupos')}>
            <Ionicons name="arrow-back" size={30} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/usuario')}>
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

        {/* Lista de preguntas */}
        <FlatList
          data={filteredQuestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push(`/ver_pregun?id=${item.id}`)}
            >
              <Text style={styles.itemText}>{item.titulo}</Text>
            </TouchableOpacity>
          )}
        />

        {/* Modal para crear nueva pregunta */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF9800',
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
    paddingHorizontal: 1,
    paddingTop: 30,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    marginBottom: 15,
    marginTop: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
  },
  item: {
    padding: 15,
    backgroundColor: '#FFC107',
    marginVertical: 5,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    height: 100,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff', 
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
