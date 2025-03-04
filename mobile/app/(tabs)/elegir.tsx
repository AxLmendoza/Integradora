import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ElegirScreen() {
    const router = useRouter();

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
                    <TouchableOpacity onPress={() => router.push('/menu')}>
                        <Ionicons name="menu" size={30} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/usuario')}>
                        <Ionicons name="person-sharp" size={30} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Título */}
                <Text style={styles.title}>ELIGE QUÉ HACER</Text>

                {/* Opciones con iconos */}
                <TouchableOpacity style={styles.option} onPress={() => router.push('/comunidad')}>
                    <Ionicons name="people-outline" size={24} color="#000" style={styles.icon} />
                    <View style={styles.optionTextContainer}>
                        <Text style={styles.optionText}>Comunidad Chipmunks</Text>
                        <Text style={styles.description}>En esta sección podrás encontrar preguntas para contestar.</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.option} onPress={() => router.push('/compartir_info')}>
                    <Ionicons name="share-social-outline" size={24} color="#000" style={styles.icon} />
                    <View style={styles.optionTextContainer}>
                        <Text style={styles.optionText}>Compartir información</Text>
                        <Text style={styles.description}>En esta sección podrás compartir tu conocimiento.</Text>
                    </View>
                </TouchableOpacity>
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
        justifyContent: 'flex-start',
        padding: 20, // Agregado padding para dar espacio entre los elementos y los bordes
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 30,
    },

    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 50,
        color: '#000', // Agregado color para el texto
    },
    option: {
        flexDirection: 'row', // Asegura que el icono y el texto estén en fila
        alignItems: 'center', // Centra el icono y el texto verticalmente
        padding: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Fondo semitransparente para el texto
    },
    icon: {
        marginRight: 15, // Espacio entre el icono y el texto
    },
    optionTextContainer: {
        flex: 1, // Asegura que el texto ocupe el espacio restante
    },
    optionText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
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
