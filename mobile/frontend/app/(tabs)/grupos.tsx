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
  ScrollView,
  Dimensions,
  Platform,
  StatusBar,
  BackHandler,
  AppState,
  Animated
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AppRoute =
  | '/'
  | '/inicio_ses'
  | '/buscar_pre'
  | '/grupos_estu'
  | '/chat'
  | '/elegir'
  | '/grupos'
  | '/(tabs)/menu'
  | '/(tabs)/usuario';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isAndroid = Platform.OS === 'android';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [carrera, setCarrera] = React.useState<string>('Cargando carrera...');
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeRoute, setActiveRoute] = React.useState<AppRoute>('/grupos');
  const indicatorPosition = React.useRef(new Animated.Value(0)).current;

  // Mapeo de rutas a posiciones del indicador (0-3)
  const routePositions: Record<AppRoute, number> = {
    '/grupos': 0,
    '/chat': 1,
    '/elegir': 2,
    '/(tabs)/usuario': 3,
    '/': 0,
    '/inicio_ses': 0,
    '/buscar_pre': 0,
    '/grupos_estu': 0,
    '/(tabs)/menu': 0
  };

  // Función para navegar y actualizar el indicador
  const navigateWithIndicator = (route: AppRoute) => {
    setActiveRoute(route);
    setSearchQuery('');
    
    // Animación del indicador
    const position = routePositions[route] || 0;
    Animated.spring(indicatorPosition, {
      toValue: position,
      useNativeDriver: true,
      speed: 20,
      bounciness: 0
    }).start();
    
    router.push(route as never);
  };

  // Función para cargar los datos del usuario
  const loadUserData = async () => {
    try {
      const storedCarrera = await AsyncStorage.getItem('carrera');
      if (storedCarrera) {
        setCarrera(storedCarrera);
      } else {
        setCarrera('No especificado');
        console.warn('No se encontró la carrera en AsyncStorage');
      }
    } catch (error) {
      console.error('Error al cargar la carrera:', error);
      setCarrera('Error al cargar');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos al montar el componente
  React.useEffect(() => {
    loadUserData();
  }, []);

  // Escuchar cambios en el estado de la app
  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        loadUserData();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Recargar datos cuando la pantalla recibe foco
  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
      setSearchQuery('');
      // Actualizar ruta activa cuando se enfoca esta pantalla
      setActiveRoute('/grupos');
      Animated.spring(indicatorPosition, {
        toValue: 0,
        useNativeDriver: true,
        speed: 20,
        bounciness: 0
      }).start();
    }, [])
  );

  // Bloquear el botón de retroceso físico
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigateWithIndicator('/grupos');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const handleSearchSubmit = () => {
    if (searchQuery.trim() !== '') {
      router.push({
        pathname: '/buscar_pre',
        params: { query: searchQuery }
      } as never);
      setSearchQuery('');
      Keyboard.dismiss();
    }
  };

  // Función para formatear el nombre de la carrera
  const formatCarreraName = (name: string) => {
    if (!name) return 'Carrera no especificada';

    // Eliminar "INGENIERÍA EN " si existe
    const formatted = name.replace(/INGENIERÍA EN /i, '');

    // Convertir a mayúsculas solo la primera letra de cada palabra
    return formatted.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/fondo.jpeg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        {/* Encabezado mejorado */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigateWithIndicator('/(tabs)/menu')}
            style={styles.headerButton}
          >
            <Ionicons name="menu" size={30} color="#000" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            {!isLoading && (
              <Text style={styles.carreraTitle} numberOfLines={1} ellipsizeMode="tail">
                {formatCarreraName(carrera)}
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={() => navigateWithIndicator('/(tabs)/usuario')}
            style={styles.headerButton}
          >
            <Ionicons name="person-sharp" size={30} color="#000" />
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Sección de búsqueda mejorada */}
          <View style={styles.searchSection}>
            <Text style={styles.title}>Buscar pregunta</Text>
            <Text style={styles.subtitle}>Encuentra respuestas entre tus compañeros</Text>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar preguntas..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearchSubmit}
                returnKeyType="search"
              />
              <TouchableOpacity
                onPress={handleSearchSubmit}
                style={styles.searchButton}
              >
                <Ionicons name="search" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tarjeta de grupos mejorada */}
          <View style={styles.cardContainer}>
            <Text style={styles.sectionTitle}>Grupos de estudio</Text>
            <Text style={styles.sectionSubtitle}>Únete a grupos de tu carrera</Text>

            <TouchableOpacity
              onPress={() => navigateWithIndicator('/grupos_estu')}
              style={styles.groupsCard}
              activeOpacity={0.8}
            >
              <Image
                source={require('../../assets/images/grupos_icon.png')}
                style={styles.groupsImage}
                resizeMode="contain"
              />
              <View style={styles.cardOverlay}>
                <Text style={styles.cardText}>Explorar Grupos</Text>
                <Ionicons name="arrow-forward" size={24} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Sección de accesos rápidos */}
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Accesos rápidos</Text>

            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigateWithIndicator('/chat')}
              >
                <Ionicons name="chatbubbles" size={28} color="#ff6b00" />
                <Text style={styles.actionText}>Chat</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigateWithIndicator('/elegir')}
              >
                <Ionicons name="add-circle" size={28} color="#ff6b00" />
                <Text style={styles.actionText}>Nueva Pregunta</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigateWithIndicator('/grupos')}
              >
                <Ionicons name="people" size={28} color="#ff6b00" />
                <Text style={styles.actionText}>Mis Grupos</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Barra de navegación mejorada */}
        <View style={styles.navbar}>
          <Animated.View
            style={[
              styles.navIndicator,
              {
                transform: [{
                  translateX: indicatorPosition.interpolate({
                    inputRange: [0, 3],
                    outputRange: [0, screenWidth * 0.75] // 25% * 3
                  })
                }]
              }
            ]}
          />
          <TouchableOpacity
            onPress={() => navigateWithIndicator('/grupos')}
            style={styles.navButton}
          >
            <Ionicons
              name="home"
              size={28}
              color={activeRoute === '/grupos' ? '#ff6b00' : '#fff'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigateWithIndicator('/chat')}
            style={styles.navButton}
          >
            <Ionicons
              name="chatbubbles"
              size={28}
              color={activeRoute === '/chat' ? '#ff6b00' : '#fff'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigateWithIndicator('/elegir')}
            style={styles.navButton}
          >
            <Ionicons
              name="add-circle"
              size={28}
              color={activeRoute === '/elegir' ? '#ff6b00' : '#fff'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigateWithIndicator('/(tabs)/usuario')}
            style={styles.navButton}
          >
            <Ionicons
              name="person"
              size={28}
              color={activeRoute === '/(tabs)/usuario' ? '#ff6b00' : '#fff'}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: isAndroid ? StatusBar.currentHeight : 0,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,165,0,0.3)',
  },
  scrollContainer: {
    paddingBottom: 80, // Espacio para el navbar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerButton: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  carreraTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    maxWidth: screenWidth - 120,
  },
  searchSection: {
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  searchButton: {
    backgroundColor: '#ff6b00',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    paddingHorizontal: 25,
    marginTop: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
  },
  groupsCard: {
    borderRadius: 15,
    overflow: 'hidden',
    height: 200,
    position: 'relative',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  groupsImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  quickActions: {
    paddingHorizontal: 25,
    marginBottom: 30,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    backgroundColor: '#000',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  navButton: {
    width: '25%',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIndicator: {
    position: 'absolute',
    top: 0,
    width: '25%',
    height: 3,
    backgroundColor: '#ff6b00',
  },
});