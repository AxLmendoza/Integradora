import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

export default function GruposScreen() {
  const [activeTab, setActiveTab] = React.useState('Nuevo');
  const [selectedEstado, setSelectedEstado] = React.useState('Privado');
  const [editing, setEditing] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const [categorias, setCategorias] = React.useState([]);  // Estado para las categorías
  const [nuevaCategoria, setNuevaCategoria] = React.useState(''); // Estado para la nueva categoría
  

  const handleSelectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
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

  // Función para agregar una nueva categoría
  const handleAddCategoria = () => {
    if (nuevaCategoria.trim() !== '') {
      setCategorias([...categorias, nuevaCategoria]);
      setNuevaCategoria(''); // Limpiar el campo después de agregar la categoría
    } else {
      alert('Por favor ingresa un nombre para la categoría');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('@/assets/images/ad_fondo.jpg')} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.overlay} />

        {/* Encabezado */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="menu" size={30} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>GRUPOS</Text>
          <TouchableOpacity>
            <Ionicons name="person-circle" size={30} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Tabs de navegación */}
        <View style={styles.tabs}>
          {['Nuevo', 'Míos', 'Guardados'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => {
                setActiveTab(tab);
                setEditing(false);
              }}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'Nuevo' || (activeTab === 'Míos' && editing) ? (
          <View style={styles.formContainer}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput style={styles.input} placeholder="Nombre del grupo" />

            <View style={styles.categoryContainer}>
              <Text style={styles.label}>Categorías</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Nombre de la categoría" 
                value={nuevaCategoria}
                onChangeText={setNuevaCategoria} 
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAddCategoria}>
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Mostrar las categorías agregadas */}
            <View style={styles.categoriesList}>
              {categorias.map((categoria, index) => (
                <Text key={index} style={styles.categoryItem}>{categoria}</Text>
              ))}
            </View>

            <Text style={styles.label}>Descripción</Text>
            <TextInput style={styles.input} placeholder="Definición de la descripción" />

            <Text style={styles.label}>Estado</Text>
            <Picker
              selectedValue={selectedEstado}
              onValueChange={(itemValue) => setSelectedEstado(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Privado" value="Privado" />
              <Picker.Item label="Público" value="Público" />
            </Picker>

            {selectedEstado === 'Público' && (
              <>
                <Text style={styles.label}>Código</Text>
                <TextInput style={styles.input} placeholder="Cinco números" keyboardType="numeric" />
              </>
            )}

            <Text style={styles.label}>Imagen del Grupo</Text>
            <TouchableOpacity style={styles.imageButton} onPress={handleSelectImage}>
              <Ionicons name="image" size={24} color="#fff" />
              <Text style={styles.buttonText}>Seleccionar Imagen</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.selectedImage} />}

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>{activeTab === 'Nuevo' ? 'Crear' : 'Guardar cambios'}</Text>
            </TouchableOpacity>
          </View>
          
        ) : (
          <ScrollView style={styles.groupsContainer}>
            {[1, 2, 3].map((item, index) => (
              <View key={index} style={styles.groupCard}>
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image" size={40} color="#000" />
                </View>
                <View style={styles.groupInfo}>
                  <Text style={styles.groupTitle}>Nombre del grupo</Text>
                  <Text style={styles.groupDescription}>Descripción</Text>
                  <View style={styles.separator} />
                  <View style={styles.buttonContainer}>
                    {activeTab === 'Míos' && (
                      <TouchableOpacity style={styles.adminButton}>
                        <Text style={styles.adminText}>Administrar</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.actionButton} onPress={() => setEditing(true)}>
                      <Text style={styles.actionText}>{activeTab === 'Míos' ? 'Editar' : 'Ver'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
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
  tabs: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10, backgroundColor: 'green', paddingVertical: 5, borderRadius: 0 },
  tab: { paddingVertical: 10, paddingHorizontal: 20 },
  activeTab: { backgroundColor: '#fff', borderRadius: 0 },
  tabText: { fontSize: 16, color: '#fff' },
  activeTabText: { fontWeight: 'bold', color: 'green' },
  formContainer: { paddingHorizontal: 20, marginTop: 10 },
  categoryContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 5 
  },
  addButton: {
    backgroundColor: 'green', 
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesList: {
    marginTop: 10,
  },
  categoryItem: {
    fontSize: 16,
    marginVertical: 5,
    color: '#000',
    backgroundColor: '#f0f0f0', 
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  input: { borderBottomWidth: 1, borderBottomColor: '#000', paddingVertical: 10, marginBottom: 10 },
  button: { backgroundColor: 'green', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 18 },
  groupsContainer: { flex: 1, paddingHorizontal: 20 },
  groupCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, elevation: 3 },
  adminButton: { backgroundColor: '#FF4D4D', padding: 8, borderRadius: 0, marginRight: 10 },
  adminText: { color: '#fff' },
  actionButton: { backgroundColor: 'green', padding: 8, borderRadius: 0 },
  actionText: { color: '#fff' },
  imageButton: {
    flexDirection: 'row',
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  selectedImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 0
  },

  buttonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-evenly', 
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
});
