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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Definir los grupos antes del componente
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

export default function GruposEstuScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = React.useState('Ver');
    const [searchQuery, setSearchQuery] = React.useState('');

    // Filtrar grupos según la búsqueda
    const filteredGroups = groups.filter(group =>
        group.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../assets/images/ad_fondo.jpg')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/ad_menu')}>
                        <Ionicons name="menu" size={30} color="#000" />
                    </TouchableOpacity>

                    <Text style={styles.title}>GRUPOS</Text>

                    <TouchableOpacity onPress={() => router.push('/(tabs)/ad_usuario')}>
                        <Ionicons name="person-circle" size={30} color="#000" />
                    </TouchableOpacity>
                </View>

                <View style={styles.tabContainer}>
                    {[{ name: 'Nuevo', route: '/(tabs)/ad_nuevo' }, { name: 'Míos', route: '/(tabs)/ad_grupos' }, { name: 'Ver', route: '/(tabs)/ad_ver' }].map(({ name, route }) => (
                        <TouchableOpacity
                            key={name}
                            style={[styles.tab, activeTab === name && styles.activeTab]}
                            onPress={() => {
                                setActiveTab(name);
                                router.push(route);
                            }}
                        >
                            <Text style={[styles.tabText, activeTab === name && styles.activeTabText]}>{name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Barra de búsqueda */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Nombre del grupo"
                        placeholderTextColor="#666"
                        value={searchQuery}
                        onChangeText={setSearchQuery} // Filtra en tiempo real
                        returnKeyType="search"
                    />
                    <Ionicons name="search" size={20} color="#000" style={styles.searchIcon} />
                </View>

                {/* Lista de grupos filtrados */}
                <ScrollView contentContainerStyle={[styles.groupsContainer, { paddingBottom: 57 }]}>
                    {filteredGroups.length > 0 ? (
                        filteredGroups.map((group, index) => (
                            <View key={index} style={styles.groupCard}>
                                <Image source={group.image} style={styles.groupImage} />
                                <Text style={styles.groupTitle}>{group.title}</Text>
                                <Text style={styles.groupDescription}>{group.description}</Text>
                                <TouchableOpacity
                                    style={styles.joinButton}
                                    onPress={() => {
                                        if (group.title === 'MATEMÁTICAS SIUUU') {
                                            router.push('/verificacion_cod'); // Redirigir a la pantalla de verificación de código
                                        } else {
                                            router.push({
                                                pathname: '/grupo_detalle',
                                                params: { titulo: group.title, descripcion: group.description }
                                            });
                                        }
                                    }}
                                >
                                    <Text style={styles.joinButtonText}>UNIRTE</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noResults}>No se encontraron grupos</Text>
                    )}
                </ScrollView>
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
    
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
      },
      title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#',
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
        borderWidth: 2, 
        borderColor: '#000', 
    },
    
    searchInput: {
        flex: 1,
        paddingVertical: 10,
    },
    searchIcon: {
        marginLeft: 10,
    },
    groupsContainer: {
        alignItems: 'center',
        
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
        backgroundColor: '#1b5e20',
        paddingVertical: 10,
        borderRadius: 10,
        marginHorizontal: 10,
      },
      tab: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
      },
      activeTab: {
        backgroundColor: '#fff',
      },
      tabText: {
        fontSize: 16,
        color: '#fff',
      },
      activeTabText: {
        color: '#1b5e20',
        fontWeight: 'bold',
      },
    groupCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        width: '90%',
        marginBottom: 15,
        alignItems: 'center',
        borderWidth: 0.2, 
        borderColor: '#000',
    },
    groupImage: {
        width: '100%',
        height: 100,
        borderRadius: 10,
    },
    groupTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },
    groupDescription: {
        fontSize: 14,
        textAlign: 'center',
        marginVertical: 5,
    },
    joinButton: {
        backgroundColor: '#FF8C00',
        padding: 8,
        borderRadius: 5,
    },
    joinButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    noResults: {
        fontSize: 16,
        color: '#555',
        marginTop: 20,
        textAlign: 'center',
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
