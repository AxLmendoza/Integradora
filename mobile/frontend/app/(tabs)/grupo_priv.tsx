import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function GrupoScreen() {
    const [selectedFile, setSelectedFile] = useState('');
    const router = useRouter();

    // Seleccionar un video
    const pickVideo = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Se requieren permisos para acceder a la galería.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled && result.assets?.[0]?.uri) {
            setSelectedFile(result.assets[0].uri);
        }
    };

    // Seleccionar un documento
    const pickDocument = async () => {
        const result = await DocumentPicker.getDocumentAsync({});
        if (result.type === 'success') {
            setSelectedFile(result.uri);
        }
    };

    // Seleccionar una imagen
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Se requieren permisos para acceder a la galería.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets?.[0]?.uri) {
            setSelectedFile(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            {/* Imagen de fondo con degradado */}
            <ImageBackground
                source={require('../../assets/images/fondo_matematicas.jpeg')}
                style={styles.backgroundImage}
            >
                <LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent']} style={styles.gradient} />

                {/* Íconos en la parte superior */}
                <View style={styles.topIcons}>
                    <TouchableOpacity onPress={() => router.push('./grupos_estu')}>
                        <Ionicons name="arrow-back" size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('./usuario')}>
                        <Ionicons name="person-sharp" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Título de la sección */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>MATEMÁTICAS SIUUU</Text>
                </View>
            </ImageBackground>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Descripción del curso */}
                <Text style={styles.description}>
                    En este grupo todos nos apoyamos. Reglas: Resolver ejercicios, ayudar a otros, saber sumar.
                </Text>

                {/* Sección de VIDEOS */}
                <View style={styles.cardContainer}>
                    <Text style={styles.sectionTitle}>VIDEOS</Text>
                    <TouchableOpacity style={styles.card} onPress={pickVideo}>
                        <Ionicons name="videocam-outline" size={40} color="#FF8C00" />
                        <Text style={styles.cardTitle}>Subir Video</Text>
                        <Text style={styles.cardDescription}>Selecciona un video de tu galería</Text>
                    </TouchableOpacity>
                </View>

                {/* Sección de DOCUMENTOS */}
                <View style={styles.cardContainer}>
                    <Text style={styles.sectionTitle}>DOCUMENTOS</Text>
                    <TouchableOpacity style={styles.card} onPress={pickDocument}>
                        <Ionicons name="document-text-outline" size={40} color="#FF8C00" />
                        <Text style={styles.cardTitle}>Subir Documento</Text>
                        <Text style={styles.cardDescription}>Selecciona un archivo</Text>
                    </TouchableOpacity>
                </View>

                {/* Sección de IMÁGENES */}
                <View style={styles.cardContainer}>
                    <Text style={styles.sectionTitle}>IMÁGENES</Text>
                    <TouchableOpacity style={styles.card} onPress={pickImage}>
                        <Ionicons name="image-outline" size={40} color="#FF8C00" />
                        <Text style={styles.cardTitle}>Subir Imagen</Text>
                        <Text style={styles.cardDescription}>Selecciona una imagen</Text>
                    </TouchableOpacity>
                </View>

                {/* Vista para mostrar la ruta del archivo seleccionado */}
                {selectedFile ? (
                    <View style={styles.selectedFileContainer}>
                        <Text style={styles.selectedFileText}>
                            Archivo seleccionado: {selectedFile}
                        </Text>
                    </View>
                ) : null}
            </ScrollView>

            {/* Barra de navegación inferior */}
            <View style={styles.navbar}>
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
    content: {
        padding: 20,
        paddingBottom: 80, // Deja espacio para la barra inferior
    },
    titleContainer: {
        position: 'absolute', // Esto asegura que el título esté sobre la imagen
        top: 197, // Ajusta el valor para posicionar correctamente el título sobre la imagen
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Fondo oscuro para el título
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    description: {
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#5c6c7c', // Azul grisáceo
    },
    cardContainer: {
        marginBottom: 20,
        backgroundColor: '#f5f8fc', // Fondo gris azulado suave
        padding: 10,
        borderRadius: 10,
    },
    card: {
        backgroundColor: '#d0dae0', // Gris suave
        padding: 15,
        borderRadius: 10,
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
        color: '#2e3d4d', // Azul grisáceo oscuro
    },
    cardDescription: {
        fontSize: 12,
        textAlign: 'center',
        color: '#5c6c7c', // Azul grisáceo
    },
    selectedFileContainer: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
    },
    selectedFileText: {
        color: '#444',
        fontSize: 14,
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
});
