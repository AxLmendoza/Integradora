import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  TextInput,
  Keyboard,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [carrera, setCarrera] = React.useState<string | null>(null);

  // Obtener la carrera desde AsyncStorage
  React.useEffect(() => {
    const fetchCarrera = async () => {
      try {
        const storedCarrera = await AsyncStorage.getItem('carrera');
        if (storedCarrera) {
          setCarrera(storedCarrera);
        } else {
          Alert.alert('Error', 'No se pudo obtener la carrera.');
        }
      } catch (error) {
        console.error('Error obteniendo la carrera:', error);
      }
    };

    fetchCarrera();
  }, []);

  const handleSearchSubmit = () => {
    if (searchQuery.trim() !== '') {
      router.push(`/buscar_pre?query=${searchQuery}`);
      Keyboard.dismiss(); // Ocultar el teclado después de enviar la búsqueda
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
          <TouchableOpacity onPress={() => router.push('/(tabs)/menu')}>
            <Ionicons name="menu" size={30} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(tabs)/usuario')}>
            <Ionicons name="person-sharp" size={30} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Muestra la carrera como título */}
        {carrera && <Text style={styles.carreraTitle}>{carrera}</Text>}

        {/* Título */}
        <Text style={styles.title}>Buscar pregunta</Text>

        {/* Barra de búsqueda */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar"
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
          <TouchableOpacity onPress={() => router.push('/grupos_estu')}>
            <Image
              source={require('@/assets/images/grupos_icon.png')}
              style={styles.groupsImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

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
  carreraTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
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
    marginTop: 10,
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
    width: 65,
    height: 5,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0.5,
    left: '13%',
    marginLeft: -20,
    zIndex: 100,
  },
});
