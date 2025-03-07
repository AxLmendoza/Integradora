import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ResponderScreen() {
  const router = useRouter();
  const [respuesta, setRespuesta] = React.useState('');

  const handleEnviarRespuesta = () => {
    if (respuesta.trim() !== '') {
      console.log('Respuesta enviada:', respuesta);
      setRespuesta(''); // Limpiar el campo después de enviar
    }
  };

  return (
    <View style={styles.container}>
      {/* Imagen de fondo */}
      <ImageBackground
        source={require('@/assets/images/fondo.jpeg')}
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

        {/* Título */}
        <Text style={styles.title}>RESPONDER PREGUNTA</Text>

        {/* Información de la pregunta */}
        <View style={styles.preguntaContainer}>
          <Text>Name User • Puntos • Hora de publicación</Text>
          <Text style={styles.preguntaTexto}>Texto de la pregunta...</Text>
        </View>

        {/* Contenedor de respuesta centrado */}
        <View style={styles.formContainer}>
          {/* Campo de respuesta */}
          <TextInput
            style={styles.input}
            placeholder="Escribe tu respuesta aquí..."
            multiline
            value={respuesta}
            onChangeText={setRespuesta}
          />

          {/* Botón de enviar respuesta */}
          <TouchableOpacity style={styles.button} onPress={handleEnviarRespuesta}>
            <Text style={styles.buttonText}>Enviar</Text>
          </TouchableOpacity>
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
    </View>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center', // Centra los elementos sobre el fondo
    padding: 20, // Padding para asegurar que los elementos no toquen los bordes
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 35,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000', // Color negro para el título
  },
  preguntaContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 20
  },
  preguntaTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center', // Centra el contenido horizontalmente
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
    width: '100%', // Hace que el campo ocupe todo el ancho disponible
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#000',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    width: '100%' // Hace que el botón ocupe el 100% del ancho disponible
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center'
  },
  navbar: {
    position: 'absolute',
    bottom: 0,
    width: '115%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
});
