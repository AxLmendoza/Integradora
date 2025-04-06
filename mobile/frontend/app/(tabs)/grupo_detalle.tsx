import React, { useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    BackHandler
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

const groupImages: Record<string, any> = {
    'PROGRAMACIÓN Y MÁS': require('../../assets/images/fondo_programacion.jpeg'),
    'REDES Y CIBERSEGURIDAD': require('../../assets/images/ciberseguridad_fondo.jpeg'),
    'MATEMÁTICAS SIUUU': require('../../assets/images/fondo_matematicas.jpeg'),
    'INGLÉS BÁSICO': require('../../assets/images/fondo_ingles.jpeg'),
};

export default function GrupoDetalleScreen() {
    const router = useRouter();
    const { titulo, descripcion } = useLocalSearchParams();
    const tituloString = Array.isArray(titulo) ? titulo[0] : titulo || 'Grupo';
    const descripcionString = Array.isArray(descripcion) ? descripcion[0] : descripcion || 'Descripción del grupo';
    const groupImage = groupImages[tituloString] || require('@/assets/images/fondo.jpeg');

    // Manejar el botón físico de retroceso en Android
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                router.push('/grupos_estu');
                return true; // Previene el comportamiento por defecto
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => {
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            };
        }, [router])
    );

    return (
        <View style={styles.container}>
            {/* Header con imagen de fondo */}
            <ImageBackground source={groupImage} style={styles.backgroundImage}>
                <LinearGradient
                    colors={['rgba(0,0,0,0.7)', 'transparent']}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                />

                {/* Barra superior con botones */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.push('/grupos_estu')}
                        style={styles.headerButton}
                    >
                        <Ionicons name="arrow-back" size={28} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)/usuario')}
                        style={styles.headerButton}
                    >
                        <Ionicons name="person-sharp" size={28} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Título del grupo */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title} numberOfLines={2}>{tituloString}</Text>
                </View>
            </ImageBackground>

            {/* Contenido principal */}
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Descripción del grupo */}
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>{descripcionString}</Text>
                </View>

                {/* Sección de Recursos */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recursos del Grupo</Text>

                    {/* Videos */}
                    <View style={styles.sectionContent}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="videocam" size={24} color="#FF6B00" />
                            <Text style={styles.sectionSubtitle}>Videos Tutoriales</Text>
                        </View>
                        <View style={styles.cardContainer}>
                            {[1, 2].map((item) => (
                                <TouchableOpacity key={item} style={styles.card}>
                                    <View style={styles.cardIcon}>
                                        <Ionicons name="videocam-outline" size={32} color="#FF6B00" />
                                    </View>
                                    <Text style={styles.cardTitle}>Tutorial {item}</Text>
                                    <Text style={styles.cardDescription}>Duración: 15 min</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Documentos */}
                    <View style={styles.sectionContent}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="document-text" size={24} color="#FF6B00" />
                            <Text style={styles.sectionSubtitle}>Apuntes y Guías</Text>
                        </View>
                        <View style={styles.cardContainer}>
                            {[1, 2].map((item) => (
                                <TouchableOpacity key={item} style={styles.card}>
                                    <View style={styles.cardIcon}>
                                        <Ionicons name="document-text-outline" size={32} color="#FF6B00" />
                                    </View>
                                    <Text style={styles.cardTitle}>Documento {item}</Text>
                                    <Text style={styles.cardDescription}>PDF • 2.4 MB</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Imágenes */}
                    <View style={styles.sectionContent}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="images" size={24} color="#FF6B00" />
                            <Text style={styles.sectionSubtitle}>Diagramas y Fotos</Text>
                        </View>
                        <View style={styles.cardContainer}>
                            {[1, 2].map((item) => (
                                <TouchableOpacity key={item} style={styles.card}>
                                    <View style={styles.cardIcon}>
                                        <Ionicons name="image-outline" size={32} color="#FF6B00" />
                                    </View>
                                    <Text style={styles.cardTitle}>Imagen {item}</Text>
                                    <Text style={styles.cardDescription}>JPG • 1.2 MB</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Barra de navegación inferior */}
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F1E1',
    },
    backgroundImage: {
        width: '100%',
        height: 280,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    header: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 1,
    },
    headerButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        padding: 8,
    },
    titleContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
        flex: 1,
        marginRight: 10,
    },
    content: {
        padding: 20,
        paddingBottom: 80,
    },
    descriptionContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    sectionContent: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionSubtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginLeft: 8,
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    card: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardIcon: {
        backgroundColor: 'rgba(255, 107, 0, 0.1)',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    joinButton: {
        backgroundColor: '#FF6B00',
        borderRadius: 25,
        padding: 16,
        alignItems: 'center',
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    joinButtonSmall: {
        backgroundColor: '#FF6B00',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 15,
        alignSelf: 'flex-start',
    },
    joinButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    joinButtonTextSmall: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
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