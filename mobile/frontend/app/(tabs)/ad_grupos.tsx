import * as React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

export default function GruposScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = React.useState('Nuevo');
    const [selectedEstado, setSelectedEstado] = React.useState('Privado');

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/images/ad_fondo.jpg')} style={styles.backgroundImage} resizeMode="cover">
                <View style={styles.overlay} />

                {/* Encabezado */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/ad_menu')}>
                        <Ionicons name="menu" size={30} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/ad_usuario')}>
                        <Ionicons name="person-sharp" size={30} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Tabs de navegación */}
                <View style={styles.tabs}>
                    {['Nuevo', 'Míos', 'Guardados'].map(tab => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.activeTab]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Formulario */}
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Nombre</Text>
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.input} placeholder="Nombre del grupo" />
                    </View>

                    <Text style={styles.label}>Categorías</Text>
                    <View style={styles.row}>
                        <TextInput style={[styles.input, { flex: 1 }]} placeholder="Nombre de la categoría" />
                        <TouchableOpacity style={styles.addButton}>
                            <Ionicons name="add" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Descripción</Text>
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.input} placeholder="Definición de la descripción" />
                    </View>

                    <Text style={styles.label}>Estado</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedEstado}
                            onValueChange={(itemValue) => setSelectedEstado(itemValue)}
                            style={styles.picker}
                            mode="dropdown"
                        >
                            <Picker.Item label="Privado" value="Privado" />
                            <Picker.Item label="Público" value="Público" />
                        </Picker>
                    </View>

                    <Text style={styles.label}>Imagen</Text>
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.input} placeholder="Foto" />
                    </View>

                    <Text style={styles.label}>Código</Text>
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.input} placeholder="Cinco números" keyboardType="numeric" />
                    </View>
                </View>

                {/* Botón de acción */}
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>{activeTab === 'Nuevo' ? 'Crear' : 'Guardar cambios'}</Text>
                </TouchableOpacity>

                {/* Barra de navegación inferior */}
                <View style={styles.navbar}>
                    {/* Barra blanca justo encima del ícono Home */}
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
    backgroundImage: { flex: 1, justifyContent: 'flex-start' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,165,0,0.3)' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#000' },
    tabs: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10, backgroundColor: 'green', paddingVertical: 5, borderRadius: 20 },
    tab: { paddingVertical: 10, paddingHorizontal: 20 },
    activeTab: { backgroundColor: '#fff', borderRadius: 20 },
    tabText: { fontSize: 16, color: '#fff' },
    activeTabText: { fontWeight: 'bold', color: 'green' },
    formContainer: { paddingHorizontal: 20, marginTop: 10 },
    label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
    inputContainer: { borderBottomWidth: 1, borderBottomColor: '#000', marginBottom: 10 },
    input: { paddingVertical: 10 },
    row: { flexDirection: 'row', alignItems: 'center' },
    addButton: { backgroundColor: '#000', padding: 10, borderRadius: 5, marginLeft: 10 },
    pickerContainer: { borderBottomWidth: 1, borderBottomColor: '#000', marginBottom: 10, justifyContent: 'center' },
    picker: { height: 40, width: '100%' },
    button: { backgroundColor: 'green', padding: 15, borderRadius: 5, alignItems: 'center', marginHorizontal: 50, marginTop: 20 },
    buttonText: { color: '#fff', fontSize: 18 },
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
    }
});