import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  ImageBackground
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Questions() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState([
    { id: '1', user: 'Alejandra M', text: '¿Por qué se dice que Nicolás Copérnico fue el primer revolucionario?' },
    { id: '2', user: 'Memo M', text: '¿Cuál es la diferencia entre una base de datos relacional y una NoSQL?' },
    { id: '3', user: 'Karla Luna', text: '¿Cuándo es mejor usar factorización en lugar de la fórmula general?' },
  ]);

  // Agregar una nueva pregunta
  const addQuestion = () => {
    if (newQuestion.trim() !== '') {
      const newQ = { id: Date.now().toString(), user: 'Usuario', text: newQuestion };
      setQuestions([newQ, ...questions]);
      setNewQuestion('');
      setModalVisible(false);
    }
  };

  // Filtra preguntas por texto de búsqueda
  const filteredQuestions = questions.filter(q =>
    q.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/fondo.jpeg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.container}>
          {/* Barra de búsqueda con ícono (+) para abrir modal */}
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar preguntas..."
              placeholderTextColor="#ccc"
              value={search}
              onChangeText={setSearch}
            />
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons name="add-circle-outline" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Lista de preguntas */}
          <FlatList
            data={filteredQuestions}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={styles.questionCard}>
                <Text style={styles.questionUser}>{item.user}</Text>
                <Text style={styles.questionText}>{item.text}</Text>
              </View>
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
            <TouchableOpacity onPress={() => router.push('/(tabs)/grupos')}>
              <Ionicons name="home-outline" size={28} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/preguntas')}>
              <Ionicons name="help-circle-outline" size={28} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/chat')}>
              <Ionicons name="chatbubble-ellipses-outline" size={28} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/subir_Ar')}>
              <Ionicons name="arrow-up-circle-outline" size={28} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#333',
    padding: 10,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#555',
    padding: 8,
    borderRadius: 5,
    color: '#fff',
    marginRight: 10,
  },
  listContainer: {
    padding: 10,
    // Para que la última pregunta no quede oculta tras la barra:
    paddingBottom: 80,
  },
  questionCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  questionUser: {
    fontWeight: 'bold',
    color: '#ff4500',
    marginBottom: 5,
  },
  questionText: {
    fontSize: 14,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  submitButton: {
    backgroundColor: '#ff4500',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // Barra de navegación inferior
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff', // Cambiado a blanco
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});