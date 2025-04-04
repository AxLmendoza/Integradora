import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ImageBackground, TouchableOpacity, 
  FlatList, Image, TextInput, Modal, Alert 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// URL de la API
const API_PREGUNTA = "http://192.168.1.100:3001/api/preguntas"; // Para obtener la pregunta por id
const API_RESPUESTAS = "http://192.168.1.100:3001/api/respuestas"; // Endpoint correcto para respuestas

export default function VerPregun() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [pregunta, setPregunta] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [modalAnswerVisible, setModalAnswerVisible] = useState(false);

  // Cargar la pregunta cuando el id esté disponible
  useEffect(() => {
    if (!id) return;
    fetch(`${API_PREGUNTA}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPregunta(data);
      })
      .catch((error) => console.error("❌ Error cargando la pregunta:", error));
  }, [id]);

  // Cargar respuestas para la pregunta cuando el id esté definido
  useEffect(() => {
    if (!id) return;
    fetch(`${API_RESPUESTAS}?preguntaId=${id}`)
    .then((res) => res.json())
      .then((data) => {
        const respuestasArray = Array.isArray(data)
          ? data
          : (Array.isArray(data.data) ? data.data : []);
        setRespuestas(respuestasArray);
        if (!Array.isArray(data) && !Array.isArray(data.data)) {
          console.error("La respuesta no es un array", data);
        }
      })
      .catch((error) => console.error("❌ Error cargando respuestas:", error));
  }, [id]);

  // Función para votar una respuesta
  const votarRespuesta = (idRespuesta) => {
    setRespuestas((prevRespuestas) =>
      prevRespuestas.map((resp) =>
        String(resp.id) === String(idRespuesta)
          ? { ...resp, votos: (resp.votos || 0) + 1 }
          : resp
      )
    );
  };

  // Función para agregar una nueva respuesta
  const addAnswer = async () => {
    if (newAnswer.trim() === '') {
      return Alert.alert("Error", "La respuesta no puede estar vacía");
    }

    try {
      const response = await fetch(API_RESPUESTAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preguntaId: id,
          usuarioId: 1, // ⚠ Reemplazar con el ID del usuario autenticado
          contenido: newAnswer,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al publicar la respuesta");
      }

      const createdAnswer = await response.json();
      console.log("✅ Respuesta creada:", createdAnswer);

      // Validar que la respuesta tenga el formato esperado
      if (!createdAnswer || !createdAnswer.data) {
        throw new Error("El servidor no devolvió la respuesta esperada");
      }

      setRespuestas((prev) => [createdAnswer.data, ...prev]);
      setNewAnswer("");
      setModalAnswerVisible(false);
    } catch (error) {
      console.error("❌ Error al agregar respuesta:", error);
      Alert.alert("Error", error.message || "No se pudo publicar la respuesta");
    }
  };

  // Función para formatear la fecha
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

        {pregunta && (
          <View style={styles.questionContainer}>
            <View style={styles.questionHeader}>
              <Image 
                source={require('../../assets/images/user.png')} 
                style={styles.userAvatar} 
              />
              <View style={styles.questionInfo}>
                <Text style={styles.questionAuthor}>{pregunta?.autor || "Anónimo"}</Text>
                <Text style={styles.questionDate}>
                  {pregunta?.createdAt ? formatearFecha(pregunta.createdAt) : "Fecha desconocida"}
                </Text>
              </View>
            </View>
            <Text style={styles.questionText}>
              {pregunta?.pregunta || pregunta?.contenido || "Sin contenido"}
            </Text>
          </View>
        )}

        <Text style={styles.answerTitle}>RESPUESTAS</Text>

        <FlatList
          data={respuestas}
          keyExtractor={(item, index) =>
            item && item.id ? item.id.toString() : index.toString()
          }
          renderItem={({ item }) => (
            <View style={styles.answerContainer}>
              <View style={styles.userContainer}>
                <Image 
                  source={item.avatar ? { uri: item.avatar } : require('../../assets/images/user.png')} 
                  style={styles.userAvatar} 
                />
                <Text style={styles.autor}>{item.autor || "Usuario Anónimo"}</Text>
              </View>
              <Text style={styles.answerText}>{item.contenido || item.texto}</Text>
              <Text style={styles.answerDate}>
                {item?.createdAt ? formatearFecha(item.createdAt) : "Sin fecha"}
              </Text>
              <View style={styles.voteContainer}>
                <Text style={styles.voteCount}>Votos: {item.votos || 0}</Text>
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

        <TouchableOpacity 
          style={styles.newAnswerButton} 
          onPress={() => setModalAnswerVisible(true)}
        >
          <Text style={styles.newAnswerButtonText}>Responder</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalAnswerVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Nueva Respuesta</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Escribe tu respuesta..."
              placeholderTextColor="#666"
              multiline
              value={newAnswer}
              onChangeText={setNewAnswer}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalAnswerVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={addAnswer}
              >
                <Text style={styles.modalButtonText}>Publicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingBottom: 80 },
  backgroundImage: { flex: 1, justifyContent: 'flex-start' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50 },
  headerText: { fontSize: 26, fontWeight: 'bold', color: '#FFF', textShadowColor: '#000', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 },
  questionContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginVertical: 10, marginHorizontal: 20 },
  questionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  userAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  questionInfo: { flexDirection: 'column' },
  questionAuthor: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  questionDate: { fontSize: 14, color: '#888' },
  questionText: { fontSize: 20, color: '#333', fontWeight: '600' },
  answerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF', marginTop: 20, marginLeft: 20 },
  answerContainer: { marginTop: 20, backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 18, borderRadius: 12, marginHorizontal: 20 },
  userContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  autor: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  answerText: { fontSize: 16, color: '#333' },
  answerDate: { fontSize: 14, color: '#666', marginTop: 4 },
  voteContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  voteCount: { fontSize: 16, color: '#000' },
  voteButton: { padding: 8, backgroundColor: '#4CAF50', borderRadius: 6 },
  newAnswerButton: { marginTop: 20, alignSelf: 'center', backgroundColor: '#2196F3', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  newAnswerButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalInput: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, marginBottom: 20, height: 100 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, alignItems: 'center' },
  cancelButton: { backgroundColor: '#f44336' },
  submitButton: { backgroundColor: '#4CAF50' },
  modalButtonText: { color: '#fff', fontWeight: 'bold' },
  navbar: { position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 15, backgroundColor: '#000', borderTopWidth: 2, borderTopColor: '#333' },
  whiteLine: { width: 65, height: 5, backgroundColor: '#fff', position: 'absolute', top: 0.5, left: '13%', marginLeft: -20, zIndex: 100 },
});