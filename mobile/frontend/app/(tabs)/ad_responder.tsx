import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';  // Para seleccionar imágenes

export default function ResponderScreen() {
    const router = useRouter();
    const [respuesta, setRespuesta] = useState('');
    const [image, setImage] = useState(null);

    const pregunta = {
        autor: 'Alejandra M',
        fecha: '2025-03-05',
        texto: '¿Cómo funciona React Native?',
        avatar: require('../../assets/images/user.png'),
    };

    const handleEnviarRespuesta = () => {
        if (respuesta.trim() !== '') {
            console.log('Respuesta enviada:', respuesta);
            setRespuesta('');
        } else {
            Alert.alert('Error', 'Por favor, ingresa una respuesta antes de enviar.');
        }
    };

    const handleSelectImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert('Se necesita permiso para acceder a la galería.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/images/ad_fondo.jpg')} style={styles.backgroundImage} resizeMode="cover">
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.push('/ad_comunidad')}>
                        <Ionicons name="arrow-back" size={30} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/ad_usuario')}>
                        <Ionicons name="person" size={30} color="#000" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.title}>RESPONDER PREGUNTA</Text>

                <View style={styles.preguntaContainer}>
                    <View style={styles.questionHeader}>
                        <Image source={pregunta.avatar} style={styles.userAvatar} />
                        <View>
                            <Text style={styles.preguntaInfo}>{pregunta.autor} • {pregunta.fecha}</Text>
                            <Text style={styles.preguntaTexto}>{pregunta.texto}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Escribe tu respuesta aquí..."
                        multiline
                        value={respuesta}
                        onChangeText={setRespuesta}
                    />

                    <TouchableOpacity style={styles.uploadButton} onPress={handleSelectImage}>
                        <Text style={styles.uploadButtonText}>Subir Contenido</Text>
                    </TouchableOpacity>

                    {image && <Image source={{ uri: image }} style={styles.uploadedImage} />}

                    <TouchableOpacity style={styles.button} onPress={handleEnviarRespuesta}>
                        <Text style={styles.buttonText}>Enviar</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.navbar}>
                    <View style={styles.whiteLine}></View>
                    <TouchableOpacity onPress={() => router.push('/ad_principal')}>
                        <Ionicons name="home-outline" size={28} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/ad_chat')}>
                        <Ionicons name="chatbubble-ellipses-outline" size={28} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/ad_elegir')}>
                        <Ionicons name="arrow-up-circle-outline" size={28} color="#fff" />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 35,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
    },
    preguntaContainer: {
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 12,
        marginBottom: 30,
    },
    questionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    userAvatar: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        marginRight: 12,
    },
    preguntaInfo: {
        fontSize: 14,
        color: '#ddd',
        marginBottom: 6,
    },
    preguntaTexto: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    formContainer: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 60,
    },
    input: {
        height: 180,
        width: '90%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 15,
        backgroundColor: '#fff',
        textAlignVertical: 'top',
        marginBottom: 25,
    },
    uploadButton: {
        backgroundColor: '#0000',
        paddingVertical: 14,
        paddingHorizontal: 35,
        borderRadius: 30,
        marginBottom: 25,
        alignItems: 'center',
    },
    uploadButtonText: {
        color: '#000',
        fontSize: 18,
    },
    uploadedImage: {
        width: 160,
        height: 160,
        marginBottom: 25,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        backgroundColor: '#333',
        paddingVertical: 16,
        paddingHorizontal: 30,
        borderRadius: 30,
        width: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
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
        width: 70,
        height: 6,
        backgroundColor: '#fff',
        position: 'absolute',
        top: 0.5,
        left: '80%',
        marginLeft: -25,
        zIndex: 100,
    },
});
