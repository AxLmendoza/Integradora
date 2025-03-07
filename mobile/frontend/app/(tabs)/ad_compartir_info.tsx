import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function CompartirInformacionScreen() {
    const router = useRouter();
    const [titulo, setTitulo] = React.useState('');
    const [descripcion, setDescripcion] = React.useState('');
    const [image, setImage] = React.useState(null);

    const handleCompartir = () => {
        if (titulo.trim() !== '' && descripcion.trim() !== '') {
            console.log('Información compartida:', { titulo, descripcion });
            setTitulo('');
            setDescripcion('');
        } else {
            Alert.alert('Error', 'Por favor, ingresa tanto el título como la descripción.');
        }
    };

    const handleSelectImage = async () => {
        // Pedir permisos para acceder a la galería
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert('Permiso requerido', 'Se necesita permiso para acceder a la galería.');
            return;
        }

        // Abrir el selector de imágenes
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri); // Establecer la imagen seleccionada
        }
    };

    return (
        <View style={styles.container}>
            {/* Imagen de fondo */}
            <ImageBackground
                source={require('../../assets/images/ad_fondo.jpg')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                {/* Encabezado */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.push('/ad_elegir')}>
                        <Ionicons name="arrow-back" size={30} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/ad_usuario')}>
                        <Ionicons name="person" size={30} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Título */}
                <Text style={styles.title}>COMPARTIR INFORMACIÓN</Text>

                {/* Contenedor de campos de entrada centrados */}
                <View style={styles.formContainer}>
                    {/* Campos de entrada */}
                    <TextInput
                        style={styles.input}
                        placeholder="Título"
                        placeholderTextColor="#888"
                        value={titulo}
                        onChangeText={setTitulo}
                    />
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Descripción"
                        placeholderTextColor="#888"
                        multiline
                        value={descripcion}
                        onChangeText={setDescripcion}
                    />

                    {/* Opción para subir contenido (Imagen) */}
                    <TouchableOpacity style={styles.uploadButton} onPress={handleSelectImage}>
                        <Text style={styles.uploadButtonText}>Subir Contenido</Text>
                    </TouchableOpacity>

                    {/* Mostrar imagen subida */}
                    {image && <Image source={{ uri: image }} style={styles.uploadedImage} />}

                    {/* Botón de compartir */}
                    <TouchableOpacity style={styles.button} onPress={handleCompartir}>
                        <Text style={styles.buttonText}>Subir</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>

            {/* Barra de navegación */}
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center', // Centra los elementos dentro del fondo
        paddingHorizontal: 20, // Espaciado dentro de la imagen de fondo
        paddingTop: 50, // Ajusta el espacio superior
        paddingBottom: 60, // Ajusta el espacio inferior
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 25,
        color: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    formContainer: {
        flex: 1, // Hace que el contenedor ocupe el espacio disponible
        justifyContent: 'flex-start', // Alinea los elementos al principio
        alignItems: 'center', // Centra los elementos horizontalmente
        marginTop: 20, // Da un poco de espacio arriba
    },
    input: {
        width: '100%',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        marginBottom: 15,
        fontSize: 16,
        color: '#333',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    uploadButton: {
        backgroundColor: '#0000', // Negro para el botón de subir contenido
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginBottom: 20,
        alignItems: 'center',
    },
    uploadButtonText: {
        color: '#000',
        fontSize: 16,
    },
    uploadedImage: {
        width: 150,
        height: 150,
        marginBottom: 20,
        borderRadius: 10,
    },
    button: {
        backgroundColor: '#000', // Negro para el botón de "Subir"
        paddingVertical: 16,
        paddingHorizontal: 30,
        borderRadius: 30,
        width: '90%',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
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
        width: 70, // Ajusta el ancho de la línea para que solo cubra el ícono de la casa
        height: 6,
        backgroundColor: '#fff',
        position: 'absolute',
        top: 0.5, // Esto coloca la línea justo encima del ícono de la casita
        left: '81%', // Centra la línea horizontalmente
        marginLeft: -25, // Ajusta el desplazamiento para centrarla exactamente sobre el ícono
        zIndex: 100, // Asegura que la línea esté encima del ícono
    },
});
