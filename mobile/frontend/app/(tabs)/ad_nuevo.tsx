import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ImageBackground,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

export default function CrearGrupoScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState('Nuevo');
  const [nombreGrupo, setNombreGrupo] = React.useState('');
  const [descripcion, setDescripcion] = React.useState('');
  const [categorias, setCategorias] = React.useState([]);
  const [nuevaCategoria, setNuevaCategoria] = React.useState('');
  const [selectedEstado, setSelectedEstado] = React.useState('Privado');
  const [codigo, setCodigo] = React.useState('');
  const [image, setImage] = React.useState(null);

  // Función para agregar una categoría
  const handleAddCategoria = () => {
    if (nuevaCategoria.trim() !== '') {
      setCategorias([...categorias, nuevaCategoria]);
      setNuevaCategoria('');
    } else {
      alert('Por favor ingresa un nombre para la categoría');
    }
  };

  // Función para eliminar una categoría
  const handleRemoveCategoria = (index) => {
    const updatedCategorias = categorias.filter((_, i) => i !== index);
    setCategorias(updatedCategorias);
  };

  // Función para seleccionar una imagen del grupo
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

  // Función para crear el grupo
  const handleCreateGroup = () => {
    if (nombreGrupo.trim() === '' || descripcion.trim() === '' || categorias.length === 0) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (selectedEstado === 'Privado' && (codigo.trim() === '' || !/^\d{9}$/.test(codigo))) {
      alert('Por favor ingrese un código de 9 dígitos numéricos');
      return;
    }

    const nuevoGrupo = {
      nombreGrupo,
      descripcion,
      categorias,
      image,
      selectedEstado,
      codigo,
    };

    Alert.alert('Grupo Creado', 'El grupo ha sido creado exitosamente.', [
      { text: 'OK', onPress: () => { } },
    ]);

    // Limpiar el formulario
    setNombreGrupo('');
    setDescripcion('');
    setNuevaCategoria('');
    setCategorias([]);
    setImage(null);
    setSelectedEstado('Privado');
    setCodigo('');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/ad_fondo.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/ad_menu')}>
            <Ionicons name="menu" size={30} color="#000" />
          </TouchableOpacity>
        
          <Text style={styles.title}>GRUPOS</Text>
        
          <TouchableOpacity onPress={() => router.push('/(tabs)/ad_usuario')}>
            <Ionicons name="person-circle" size={30} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          {[{ name: 'Nuevo', route: '/(tabs)/ad_nuevo' }, { name: 'Míos', route: '/(tabs)/ad_grupos' }, { name: 'Ver', route: '/(tabs)/ad_ver' }].map(({ name, route }) => (
            <TouchableOpacity
              key={name}
              style={[styles.tab, activeTab === name && styles.activeTab]}
              onPress={() => {
                setActiveTab(name);
                router.push(route);
              }}
            >
              <Text style={[styles.tabText, activeTab === name && styles.activeTabText]}>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={styles.scrollViewContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del grupo"
              value={nombreGrupo}
              onChangeText={setNombreGrupo}
            />

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

            <View style={styles.categoriesList}>
              {categorias.map((categoria, index) => (
                <View key={index} style={styles.categoryItem}>
                  <Text>{categoria}</Text>
                  <TouchableOpacity onPress={() => handleRemoveCategoria(index)}>
                    <Ionicons name="trash" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={styles.input}
              placeholder="Definición de la descripción"
              value={descripcion}
              onChangeText={setDescripcion}
            />

            <Text style={styles.label}>Estado</Text>
            <Picker
              selectedValue={selectedEstado}
              onValueChange={(itemValue) => setSelectedEstado(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Privado" value="Privado" />
              <Picker.Item label="Público" value="Público" />
            </Picker>

            {selectedEstado === 'Privado' && (
              <>
                <Text style={styles.label}>Código</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Código de 9 dígitos"
                  keyboardType="numeric"
                  maxLength={9}
                  value={codigo}
                  onChangeText={(text) => {
                    if (/^\d*$/.test(text)) {
                      setCodigo(text);
                    }
                  }}
                />
              </>
            )}

            <Text style={styles.label}>Imagen del Grupo</Text>
            <TouchableOpacity style={styles.imageButton} onPress={handleSelectImage}>
              <Ionicons name="image" size={24} color="#fff" />
              <Text style={styles.buttonText}>Seleccionar Imagen</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.selectedImage} />}
            {!image && <Text style={styles.label}>Sin imagen seleccionada</Text>}

            <TouchableOpacity style={styles.submitButton} onPress={handleCreateGroup}>
              <Text style={styles.buttonText}>Crear Grupo</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    backgroundColor: '#1b5e20',
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 16,
    color: '#fff',
  },
  activeTabText: {
    color: '#1b5e20',
    fontWeight: 'bold',
  },
  scrollViewContainer: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
  },
  categoryContainer: {
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#1b5e20',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  categoriesList: {
    marginBottom: 15,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  picker: {
    height: 50,
    marginBottom: 15,
  },
  imageButton: {
    backgroundColor: '#1b5e20',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#1b5e20',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
});

