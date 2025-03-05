import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CompartirInformacionScreen() {
  const router = useRouter();
  const [titulo, setTitulo] = React.useState('');
  const [descripcion, setDescripcion] = React.useState('');

  const handleCompartir = () => {
    if (titulo.trim() !== '' && descripcion.trim() !== '') {
      console.log('Información compartida:', { titulo, descripcion });
      setTitulo('');
      setDescripcion('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Imagen de fondo */}
      <ImageBackground
        source={require('../../assets/images/fondo.jpeg')}
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
        <Text style={styles.title}>COMPARTIR INFORMACIÓN</Text>

        {/* Contenedor de campos de entrada centrados */}
        <View style={styles.formContainer}>
          {/* Campos de entrada */}
          <TextInput
            style={styles.input}
            placeholder="Título"
            value={titulo}
            onChangeText={setTitulo}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descripción"
            multiline
            value={descripcion}
            onChangeText={setDescripcion}
          />

          {/* Botón de compartir */}
          <TouchableOpacity style={styles.button} onPress={handleCompartir}>
            <Text style={styles.buttonText}>Subir</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center', // Centra los elementos dentro del fondo
    padding: 20, // Espaciado dentro de la imagen de fondo
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
  formContainer: {
    flex: 1, // Hace que el contenedor ocupe el espacio disponible
    justifyContent: 'center', // Centra los elementos dentro del contenedor
    alignItems: 'center', // Centra los elementos horizontalmente
    marginTop: 20, // Da un poco de espacio arriba
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%', // Hace que el campo de entrada ocupe todo el ancho disponible
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    width: '100%', // El botón también ocupa el 100% del ancho disponible
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
});
