import * as React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AdGrupos() {
    const router = useRouter();
    const [nombreGrupo, setNombreGrupo] = React.useState('');
    const [categoria, setCategoria] = React.useState('');
    const [descripcion, setDescripcion] = React.useState('');
    const [estado, setEstado] = React.useState('Privado'); // Estado por defecto
    const [codigo, setCodigo] = React.useState('');
    const [grupos, setGrupos] = React.useState([
        { id: '1', nombre: 'Grupo 1', descripcion: 'Descripción 1' },
        { id: '2', nombre: 'Grupo 2', descripcion: 'Descripción 2' },
        { id: '3', nombre: 'Grupo 3', descripcion: 'Descripción 3' },
    ]);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../assets/images/ad_fondo.jpg')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.overlay} />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/buscar_pre')}>
                        <Ionicons name="menu" size={30} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>GRUPOS</Text>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/elegir')}>
                        <Ionicons name="person-sharp" size={30} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity style={styles.tab}>
                        <Text style={styles.tabText}>Nuevo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab}>
                        <Text style={styles.tabText}>Míos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab}>
                        <Text style={styles.tabText}>Guardados</Text>
                    </TouchableOpacity>
                </View>

                {/* Formulario Nuevo Grupo */}
                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre del grupo"
                        value={nombreGrupo}
                        onChangeText={setNombreGrupo}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre de la categoría"
                        value={categoria}
                        onChangeText={setCategoria}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Definición de la descripción"
                        value={descripcion}
                        onChangeText={setDescripcion}
                    />

                    {/* Botón para cambiar estado */}
                    <TouchableOpacity
                        style={styles.estadoButton}
                        onPress={() => setEstado(estado === 'Privado' ? 'Público' : 'Privado')}
                    >
                        <Text style={styles.estadoButtonText}>{estado}</Text>
                    </TouchableOpacity>

                    {/* Campo de código solo si el estado es "Público" */}
                    {estado === 'Público' && (
                        <TextInput
                            style={styles.input}
                            placeholder="Código (Cinco números)"
                            value={codigo}
                            keyboardType="numeric"
                            onChangeText={setCodigo}
                        />
                    )}

                    {/* Botón para subir imagen (no funcional aún) */}
                    <TouchableOpacity
                        style={styles.imageButton}
                        onPress={() => alert('Función de subida aún no implementada')}
                    >
                        <Text style={styles.imageButtonText}>Subir imagen</Text>
                    </TouchableOpacity>

                    {/* Botón Crear */}
                    <TouchableOpacity style={styles.createButton}>
                        <Text style={styles.createButtonText}>Crear</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={grupos}
                    keyExtractor={(item) => item.id}
                    style={{ flex: 1 }}
                    renderItem={({ item }) => (
                        <View style={styles.groupCard}>
                            <Text style={styles.groupTitle}>{item.nombre}</Text>
                            <Text style={styles.groupDescription}>{item.descripcion}</Text>
                            <View style={styles.groupButtons}>
                                <TouchableOpacity style={styles.adminButton}>
                                    <Text style={styles.adminButtonText}>Administrar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.editButton}
                                    onPress={() => router.push('/(tabs)/grupo_detalle')}
                                >
                                    <Text style={styles.editButtonText}>Editar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />


                {/* Barra de navegación */}
                <View style={styles.navbar}>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/home')}>
                        <Ionicons name="home-outline" size={28} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/home')}>
                        <Ionicons name="chatbubble-ellipses-outline" size={28} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/home')}>
                        <Ionicons name="arrow-up-circle-outline" size={28} color="#fff" />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
}

// Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'flex-start',
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
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: 'green',
        borderRadius: 5,
    },
    tabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    formContainer: {
        paddingHorizontal: 20,
    },
    input: {
        borderBottomWidth: 1,
        marginVertical: 10,
        paddingVertical: 5,
    },
    estadoButton: {
        backgroundColor: '#ffcc00',
        padding: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    estadoButtonText: {
        fontWeight: 'bold',
    },
    imageButton: {
        backgroundColor: '#999',
        padding: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    imageButtonText: {
        color: '#fff',
    },
    createButton: {
        backgroundColor: 'green',
        padding: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    createButtonText: {
        color: '#fff',
    },
    groupCard: {
        padding: 15,
        backgroundColor: '#fff',
        marginVertical: 5,
    },
    groupTitle: {
        fontWeight: 'bold',
    },
    groupButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    editButton: {
        backgroundColor: 'green',
        padding: 5,
    },
    editButtonText: {
        color: '#fff',
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#000',
        paddingVertical: 15,
    },

    adminButton: {
        backgroundColor: 'blue',
        padding: 5,
    },
    adminButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    groupDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },

});