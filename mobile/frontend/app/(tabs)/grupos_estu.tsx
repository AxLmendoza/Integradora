import * as React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    BackHandler
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function GruposEstuScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = React.useState('');

    // Manejar el botón físico de retroceso
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                router.push('/grupos');
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [router])
    );

    // Filtrar grupos
    const filteredGroups = groups.filter(group =>
        group.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
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
                        onPress={() => router.push('/grupos')}
                        style={styles.headerButton}
                    >
                        <Ionicons name="arrow-back" size={28} color="#fff" />
                    </TouchableOpacity>
                    
                    <Text style={styles.headerTitle}>Grupos de Estudio</Text>
                    
                    <TouchableOpacity 
                        onPress={() => router.push('/(tabs)/usuario')}
                        style={styles.headerButton}
                    >
                        <Ionicons name="person-sharp" size={28} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Barra de búsqueda */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar grupos..."
                        placeholderTextColor="#666"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close" size={20} color="#666" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Contenido */}
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {filteredGroups.length > 0 ? (
                        filteredGroups.map((group, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.groupCard}
                                onPress={() => {
                                    if (group.title === 'MATEMÁTICAS SIUUU') {
                                        router.push('/verificacion_cod');
                                    } else {
                                        router.push({
                                            pathname: '/grupo_detalle',
                                            params: { 
                                                titulo: group.title, 
                                                descripcion: group.description 
                                            }
                                        });
                                    }
                                }}
                            >
                                <Image 
                                    source={group.image} 
                                    style={styles.groupImage}
                                    resizeMode="cover"
                                />
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                                    style={styles.imageOverlay}
                                />
                                
                                <View style={styles.groupContent}>
                                    <Text style={styles.groupTitle}>{group.title}</Text>
                                    <Text style={styles.groupDescription}>
                                        {group.description}
                                    </Text>
                                </View>
                                
                                <TouchableOpacity
                                    style={styles.joinButton}
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        if (group.title === 'MATEMÁTICAS SIUUU') {
                                            router.push('/verificacion_cod');
                                        } else {
                                            router.push({
                                                pathname: '/grupo_detalle',
                                                params: { 
                                                    titulo: group.title, 
                                                    descripcion: group.description 
                                                }
                                            });
                                        }
                                    }}
                                >
                                    <Text style={styles.joinButtonText}>UNIRSE</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="people-outline" size={60} color="#888" />
                            <Text style={styles.emptyText}>No se encontraron grupos</Text>
                        </View>
                    )}
                </ScrollView>

                {/* Barra de navegación (mismo diseño que GruposDetalleScreen) */}
                <View style={styles.navbar}>
                    <View style={styles.navIndicator} />
                    <TouchableOpacity onPress={() => router.push('/grupos')}>
                        <Ionicons name="home" size={28} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/chat')}>
                        <Ionicons name="chatbubbles" size={28} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/elegir')}>
                        <Ionicons name="add-circle" size={28} color="#fff" />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
}

// Datos de grupos
const groups = [
    {
        title: 'PROGRAMACIÓN Y MÁS',
        description: 'Grupo para personas que les gusta programar. Reglas: Ser amable, compartir código, pasar las tareas.',
        image: require('../../assets/images/fondo_programacion.jpeg')
    },
    {
        title: 'REDES Y CIBERSEGURIDAD',
        description: 'Bienvenidos al mejor grupo para aprender sobre redes. Reglas: Compartir material, pasar los apuntes.',
        image: require('../../assets/images/ciberseguridad_fondo.jpeg')
    },
    {
        title: 'MATEMÁTICAS SIUUU',
        description: 'En este grupo todos nos apoyamos. Reglas: Resolver ejercicios, ayudar a otros, saber sumar.',
        image: require('../../assets/images/fondo_matematicas.jpeg')
    },
    {
        title: 'INGLÉS BÁSICO',
        description: 'Grupo para compartir trabajos y tareas de inglés. Reglas: Ser respetuoso, responder, no publicar groserías.',
        image: require('../../assets/images/fondo_ingles.jpeg')
    }
];

// Estilos (consistentes con GruposDetalleScreen)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F1E1',
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
        paddingTop: 50,
        paddingBottom: 10,
    },
    headerButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        padding: 8,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 15,
        marginHorizontal: 20,
        marginVertical: 15,
        height: 50,
    },
    searchInput: {
        flex: 1,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    searchIcon: {
        marginRight: 10,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 80,
    },
    groupCard: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 15,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    groupImage: {
        width: '100%',
        height: 150,
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        top: '50%',
    },
    groupContent: {
        padding: 15,
    },
    groupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    groupDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    joinButton: {
        backgroundColor: '#FF6B00',
        padding: 12,
        alignItems: 'center',
    },
    joinButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
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
    navIndicator: {
        position: 'absolute',
        top: -5,
        left: '10%',
        width: '20%',
        height: 5,
        backgroundColor: '#fff',
        borderRadius: 3,
    },
});