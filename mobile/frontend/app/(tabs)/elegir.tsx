import * as React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ImageBackground,
  BackHandler,
  Animated,
  Dimensions,
  Image
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

type AppRoute = 
  | '/grupos'
  | '/chat'
  | '/elegir'
  | '/(tabs)/usuario'
  | '/comunidad'
  | '/(tabs)/menu';

export default function ElegirScreen() {
    const router = useRouter();
    const [activeRoute, setActiveRoute] = React.useState<AppRoute>('/elegir');
    const indicatorPosition = React.useRef(new Animated.Value(2)).current;

    // Mapeo de rutas a posiciones del indicador (0-3)
    const routePositions: Record<AppRoute, number> = {
        '/grupos': 0,
        '/chat': 1,
        '/elegir': 2,
        '/(tabs)/usuario': 3,
        '/comunidad': 2,
        '/(tabs)/menu': 0
    };

    // Función para navegar y actualizar el indicador
    const navigateWithIndicator = (route: AppRoute) => {
        setActiveRoute(route);
        
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

    // Manejar el botón físico de retroceso
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

    // Actualizar la ruta activa cuando se enfoca la pantalla
    useFocusEffect(
        React.useCallback(() => {
            setActiveRoute('/elegir');
            Animated.spring(indicatorPosition, {
                toValue: 2,
                useNativeDriver: true,
                speed: 20,
                bounciness: 0
            }).start();
        }, [])
    );

    return (
        <View style={styles.container}>
            {/* Imagen de fondo */}
            <ImageBackground
                source={require('../../assets/images/fondo.jpeg')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.5)', 'transparent']}
                    style={styles.gradient}
                />

                {/* Encabezado */}
                <View style={styles.header}>
                    <TouchableOpacity 
                        onPress={() => navigateWithIndicator('/(tabs)/menu')}
                        style={styles.headerButton}
                    >
                        <Ionicons name="menu" size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => navigateWithIndicator('/(tabs)/usuario')}
                        style={styles.headerButton}
                    >
                        <Ionicons name="person-sharp" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Contenido principal */}
                <View style={styles.content}>
                    {/* Título */}
                    <Text style={styles.title}>ELIGE QUÉ HACER</Text>

                    {/* Opción de comunidad */}
                    <TouchableOpacity 
                        style={styles.optionCard} 
                        onPress={() => navigateWithIndicator('/comunidad')}
                    >
                        <LinearGradient
                            colors={['rgba(255,165,0,0.7)', 'rgba(255,165,0,0.3)']}
                            style={styles.optionGradient}
                        >
                            <Ionicons name="people" size={40} color="#fff" style={styles.icon} />
                            <View style={styles.optionTextContainer}>
                                <Text style={styles.optionTitle}>Comunidad Chipmunks</Text>
                                <Text style={styles.optionDescription}>
                                    En esta sección podrás encontrar preguntas para contestar.
                                </Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Imagen de la ardilla */}
                    <View style={styles.imageContainer}>
                        <Image 
                            source={require('../../assets/images/ardilla2d.png')}
                            style={styles.ardillaImage}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                {/* Barra de navegación */}
                <View style={styles.navbar}>
                    <Animated.View 
                        style={[
                            styles.navIndicator,
                            {
                                transform: [{
                                    translateX: indicatorPosition.interpolate({
                                        inputRange: [0, 3],
                                        outputRange: [0, screenWidth * 0.75]
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
    },
    backgroundImage: {
        flex: 1,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,  // Reducido para subir el encabezado
        paddingBottom: 10,
    },
    headerButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        padding: 8,
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 20,  // Reducido para subir el contenido
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,  // Reducido para subir el título
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    optionCard: {
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    optionGradient: {
        padding: 25,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 20,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    optionDescription: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 20,
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    ardillaImage: {
        width: 200,
        height: 200,
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
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
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