import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  TextInput,
  Keyboard
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchSubmit = () => {
    if (searchQuery.trim() !== '') {
      router.push(`/ad_buscar_pre?query=${searchQuery}`);
      Keyboard.dismiss(); // Ocultar el teclado después de enviar la búsqueda
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/ad_fondo.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        {/* Encabezado con iconos */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/ad_menu')}>
            <Ionicons name="menu" size={30} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(tabs)/ad_usuario')}>
            <Ionicons name="person-sharp" size={30} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Título */}
        <Text style={styles.title}>Pregunta</Text>

        {/* Barra de búsqueda */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar pregunta"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit} // Detecta cuando presionan Enter
            returnKeyType="search"
          />
          <TouchableOpacity onPress={handleSearchSubmit}>
            <Ionicons name="search" size={20} color="#000" style={styles.searchIcon} />
          </TouchableOpacity>
        </View>

        {/* Imagen de Grupos */}
        <View style={styles.contentContainer}>
          <TouchableOpacity onPress={() => router.push('./ad_grupos')}>
            <Image
              source={require('@/assets/images/grupos_icon.png')}
              style={styles.groupsImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Barra de navegación inferior */}
        <View style={styles.navbar}>
          {/* Barra blanca justo encima del ícono Home */}
          <View style={styles.whiteLine}></View>
          <TouchableOpacity onPress={() => router.push('/ad_principal')}>
            <Ionicons name="home-outline" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/ad_chat')}>
            <Ionicons name="chatbubble-ellipses-outline" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/ad_elegir')}>
            <Ionicons name="arrow-up-circle-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,165,0,0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 5,
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginHorizontal: 30,
    marginBottom: 15,
    marginTop: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
  },
  searchIcon: {
    marginLeft: 50,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupsImage: {
    width: 500,
    height: 250,
    marginTop: 100,
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
  },
  whiteLine: {
    width: 65,  // Ajusta el ancho de la línea para que solo cubra el ícono de la casa
    height: 5,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0.5, // Esto coloca la línea justo encima del ícono de la casita
    left: '13%', // Centra la línea horizontalmente
    marginLeft: -20, // Ajusta el desplazamiento para centrarla exactamente sobre el ícono
    zIndex: 100, // Asegura que la línea esté encima del ícono
  },
});

