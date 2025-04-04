import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Modal, ImageBackground, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// URL de la API: Asegúrate de que coincide con la dirección de tu backend
const API_URL = "http://192.168.1.100:3001/api/preguntas";

export default function BuscarPre() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState([]);

  // Obtener preguntas del backend al cargar la pantalla
  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        console.log("Estado de la respuesta:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Datos recibidos:", data);
        if (Array.isArray(data)) {
          setQuestions(data);
        } else {
          console.error("La respuesta no es un array", data);
        }
      })
      .catch((error) => console.error("❌ Error cargando preguntas:", error));
  }, []);


  

  // Filtrar preguntas por el texto de búsqueda
  const filteredQuestions = Array.isArray(questions)
    ? questions.filter((item) =>
        // Usamos item.pregunta, ya que el backend devuelve esa propiedad
        item.pregunta.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Agregar una nueva pregunta en la API y actualizar la lista
  const addQuestion = async () => {
    if (newQuestion.trim() === '') {
      return Alert.alert("Error", "La pregunta no puede estar vacía");
    }
  
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pregunta: newQuestion,      // Pregunta que se está agregando
          autor: "Usuario Anónimo",  // Autor de la pregunta
          // Si es necesario enviar más datos, agréguelos aquí.
        }),
      });
  
      // Comprobar si la respuesta es exitosa
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al publicar la pregunta:", errorData);
        throw new Error(errorData.error || "Error desconocido");
      }
  
      const newQ = await response.json();
      setQuestions([newQ, ...questions]); // Actualiza la lista con la nueva pregunta
      setNewQuestion("");  // Limpiar el campo de la nueva pregunta
      setModalVisible(false);  // Cerrar el modal
    } catch (error) {
      console.error("❌ Error al agregar pregunta:", error);
      Alert.alert("Error", error.message || "No se pudo publicar la pregunta");
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
          <TouchableOpacity onPress={() => router.push('/grupos')}>
            <Ionicons name="arrow-back" size={30} color="#000" />
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

        {/* Lista de preguntas */}
        <FlatList
          data={filteredQuestions}
          keyExtractor={(item) => item.id.toString()} 
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push(`/ver_pregun?id=${item.id}`)}
              >
              <View style={styles.userContainer}>
                <Image
                  source={require('@/assets/images/user.png')}
                  style={styles.userAvatar}
                />
                <Text style={styles.autor}>{item.autor}</Text>
              </View>
              {/* Mostramos la pregunta */}
              <Text style={styles.itemText}>{item.pregunta}</Text>
            </TouchableOpacity>
          )}
        />

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

        {/* Barra de navegación inferior */}
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
  container: { flex: 1, backgroundColor: '#E0E0E0' },
  backgroundImage: { flex: 1, justifyContent: 'center', padding: 20 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.3)' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 0, paddingTop: 30 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 25, paddingHorizontal: 20, marginHorizontal: 20, marginBottom: 20, marginTop: 30 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 16, color: '#333' },
  item: { padding: 20, backgroundColor: 'rgba(255, 255, 255, 0.8)', marginVertical: 10, borderRadius: 12 },
  userContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  userAvatar: { width: 35, height: 35, borderRadius: 17.5, marginRight: 10 },
  autor: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  itemText: { fontSize: 18, color: '#333', fontWeight: '500' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalInput: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, marginBottom: 20, height: 100 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, alignItems: 'center' },
  cancelButton: { backgroundColor: '#f44336' },
  submitButton: { backgroundColor: '#4CAF50' },
  modalButtonText: { color: '#fff', fontWeight: 'bold' },
  navbar: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 15, backgroundColor: '#000', position: 'absolute', bottom: 0, left: 0, right: 0 },
  whiteLine: { width: 65, height: 5, backgroundColor: '#fff', position: 'absolute', top: 0.5, left: '13%', marginLeft: -20, zIndex: 100 },
});