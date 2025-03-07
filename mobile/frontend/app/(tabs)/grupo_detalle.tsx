import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const groupImages: Record<string, any> = {
    'PROGRAMACIÓN Y MÁS': require('@/assets/images/fondo_programacion.jpeg'),
    'REDES Y CIBERSEGURIDAD': require('@/assets/images/ciberseguridad_fondo.jpeg'),
    'MATEMÁTICAS SIUUU': require('@/assets/images/fondo_matematicas.jpeg'),
    'INGLÉS BÁSICO': require('@/assets/images/fondo_ingles.jpeg'),
};

export default function GrupoDetalleScreen() {
    const router = useRouter();
    const { titulo, descripcion } = useLocalSearchParams();
    const tituloString = Array.isArray(titulo) ? titulo[0] : titulo;
    const groupImage = groupImages[tituloString] || require('@/assets/images/fondo.jpeg');

    return (
        <View style={styles.container}>
            {/* Imagen de fondo con degradado */}
            <ImageBackground source={groupImage} style={styles.backgroundImage}>
                <LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent']} style={styles.gradient} />

                {/* Íconos en la parte superior */}
                <View style={styles.topIcons}>
                    <TouchableOpacity onPress={() => router.push('/grupos_estu')}>
                        <Ionicons name="arrow-back" size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/usuario')}>
                        <Ionicons name="person-sharp" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>
            </ImageBackground>

            {/* Contenedor del título */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{tituloString}</Text>
            </View>

            {/* Contenido desplazable */}
            <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 58 }]}>

                {/* Contenedor de la descripción */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Descripción</Text>
                    <Text style={styles.description}>{descripcion}</Text>
                </View>

                {/* Sección de Videos */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Videos</Text>
                    <View style={styles.row}>
                        <View style={styles.card}>
                            <Ionicons name="videocam-outline" size={40} color="#FF8C00" />
                            <Text style={styles.cardTitle}>Título del Video</Text>
                            <Text style={styles.cardDescription}>Descripción del video</Text>
                        </View>
                        <View style={styles.card}>
                            <Ionicons name="videocam-outline" size={40} color="#FF8C00" />
                            <Text style={styles.cardTitle}>Título del Video</Text>
                            <Text style={styles.cardDescription}>Descripción del video</Text>
                        </View>
                    </View>
                </View>

                {/* Sección de Documentos */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Documentos</Text>
                    <View style={styles.row}>
                        <View style={styles.card}>
                            <Ionicons name="document-text-outline" size={40} color="#FF8C00" />
                            <Text style={styles.cardTitle}>Título del Documento</Text>
                        </View>
                        <View style={styles.card}>
                            <Ionicons name="document-text-outline" size={40} color="#FF8C00" />
                            <Text style={styles.cardTitle}>Título del Documento</Text>
                        </View>
                    </View>
                </View>

                {/* Sección de Imágenes */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Imágenes</Text>
                    <View style={styles.row}>
                        <View style={styles.card}>
                            <Ionicons name="image-outline" size={40} color="#FF8C00" />
                            <Text style={styles.cardTitle}>Título de la Imagen</Text>
                        </View>
                        <View style={styles.card}>
                            <Ionicons name="image-outline" size={40} color="#FF8C00" />
                            <Text style={styles.cardTitle}>Título de la Imagen</Text>
                        </View>
                    </View>
                </View>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e1e9f1', // Gris azulado
    },
    backgroundImage: {
        width: '100%',
        height: 250,
        position: 'relative',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    topIcons: {
        position: 'absolute',
        top: 40,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    titleContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingVertical: 4,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginTop: -40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    content: {
        padding: 20,
    },
    sectionContainer: {
        marginBottom: 20,
        backgroundColor: '#f5f8fc',
        padding: 15,
        borderRadius: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#5c6c7c',
    },
    description: {
        fontSize: 16,
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    card: {
        backgroundColor: '#d0dae0',
        padding: 15,
        borderRadius: 10,
        width: '48%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5,
        color: '#2e3d4d',
    },
    cardDescription: {
        fontSize: 12,
        textAlign: 'center',
        color: '#5c6c7c',
    },
    navbar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
        backgroundColor: '#f5f8fc',
    },
});
