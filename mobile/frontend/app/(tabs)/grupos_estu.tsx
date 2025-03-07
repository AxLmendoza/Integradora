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

export default function GruposEstuScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = React.useState('');

    // Filtrar grupos según la búsqueda
    const filteredGroups = groups.filter(group =>
        group.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('@/assets/images/fondo.jpeg')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.overlay} />

                {/* Encabezado */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.push('/menu')}>
                        <Ionicons name="menu" size={30} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>GRUPOS</Text>
                    <TouchableOpacity onPress={() => router.push('/usuario')}>
                        <Ionicons name="person-sharp" size={30} color="#000" />
                    </TouchableOpacity>
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
                                    onPress={() => router.push({ pathname: '/grupo_detalle', params: { titulo: group.title, descripcion: group.description } })}
                                >
                                    <Text style={styles.joinButtonText}>UNIRTE</Text>
                                </TouchableOpacity>

                            </View>
                        ))
                    ) : (
                        <Text style={styles.noResults}>No se encontraron grupos</Text>
                    )}
                </ScrollView>


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

const groups = [
    {
        title: 'PROGRAMACIÓN Y MÁS',
        description: 'Grupo para personas que les gusta programar. Reglas: Ser amable, compartir código, pasar las tareas.',
        image: require('@/assets/images/fondo_programacion.jpeg')
    },
    {
        title: 'REDES Y CIBERSEGURIDAD',
        description: 'Bienvenidos al mejor grupo para aprender sobre redes. Reglas: Compartir material, pasar los apuntes.',
        image: require('@/assets/images/ciberseguridad_fondo.jpeg')
    },
    {
        title: 'MATEMÁTICAS SIUUU',
        description: 'En este grupo todos nos apoyamos. Reglas: Resolver ejercicios, ayudar a otros, saber sumar.',
        image: require('@/assets/images/fondo_matematicas.jpeg')
    },
    {
        title: 'INGLÉS BÁSICO',
        description: 'Grupo para compartir trabajos y tareas de inglés. Reglas: Ser respetuoso, responder, no publicar groserías.',
        image: require('@/assets/images/fondo_ingles.jpeg')
    }
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
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
        marginLeft: 10,
    },
    groupsContainer: {
        alignItems: 'center',
    },
    groupCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        width: '90%',
        marginBottom: 15,
        alignItems: 'center',
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
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
        backgroundColor: '#fff',
    },
});
