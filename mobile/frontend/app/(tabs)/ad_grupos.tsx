import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function GruposScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState('Míos');
  const [grupos, setGrupos] = React.useState([
    {
      nombreGrupo: 'PROGRAMACIÓN Y MÁS',
      descripcion: 'Grupo para personas que les gusta programar...',
      image: require('../../assets/images/fondo_programacion.jpeg'),
      categorias: ['Desarrollo Web', 'React Native'],
      estado: 'Privado',
      codigo: '123456789',
    },
  ]);
  const [editing, setEditing] = React.useState(false);
  const [grupoEditado, setGrupoEditado] = React.useState(null);
  const [nombreGrupo, setNombreGrupo] = React.useState('');
  const [descripcion, setDescripcion] = React.useState('');
  const [categorias, setCategorias] = React.useState([]);
  const [nuevaCategoria, setNuevaCategoria] = React.useState('');
  const [image, setImage] = React.useState(null);
  const [selectedEstado, setSelectedEstado] = React.useState('Privado');
  const [codigo, setCodigo] = React.useState('');

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

  const handleAddCategoria = () => {
    if (nuevaCategoria.trim() !== '') {
      setCategorias([...categorias, nuevaCategoria]);
      setNuevaCategoria('');
    } else {
      alert('Por favor ingresa un nombre para la categoría');
    }
  };

  const handleRemoveCategoria = (index) => {
    const updatedCategorias = categorias.filter((_, i) => i !== index);
    setCategorias(updatedCategorias);
  };

  const handleSaveChanges = () => {
    if (nombreGrupo.trim() === '' || descripcion.trim() === '' || categorias.length === 0) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (selectedEstado === 'Privado') {
      if (codigo.trim() === '' || !/^\d{9}$/.test(codigo)) {
        alert('Por favor ingrese un código de 9 dígitos numéricos');
        return;
      }
    }

    const updatedGroup = {
      nombreGrupo,
      descripcion,
      categorias,
      image,
      selectedEstado,
      codigo,
    };

    const updatedGrupos = grupos.map((grupo) =>
      grupo.nombreGrupo === grupoEditado.nombreGrupo ? updatedGroup : grupo
    );

    setGrupos(updatedGrupos);
    setEditing(false);
    setGrupoEditado(null);

    Alert.alert('Grupo Actualizado', 'Los cambios se han guardado exitosamente.');

    setNombreGrupo('');
    setDescripcion('');
    setNuevaCategoria('');
    setCategorias([]);
    setImage(null);
    setSelectedEstado('Privado');
    setCodigo('');
  };

  const handleEditButton = (grupo) => {
    setEditing(true);
    setGrupoEditado(grupo);
    setNombreGrupo(grupo.nombreGrupo);
    setDescripcion(grupo.descripcion);
    setCategorias(grupo.categorias);
    setImage(grupo.image);
    setSelectedEstado(grupo.estado);
    setCodigo(grupo.codigo || '');
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setGrupoEditado(null);
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
        source={require('@/assets/images/ad_fondo.jpg')}
        style={styles.backgroundImage}
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
          {[{ name: 'Nuevo', route: '/(tabs)/ad_nuevo' }, { name: 'Míos', route: '/(tabs)/ad_grupos' }, { name: 'ver', route: '/(tabs)/ad_ver' }].map(({ name, route }) => (
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

        <ScrollView style={styles.groupsContainer}>
          {grupos.map((grupo, index) => (
            <View key={index} style={styles.groupCard}>
              {grupo.image ? (
                <Image source={grupo.image} style={styles.groupImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image" size={40} color="#000" />
                </View>
              )}
              <Text style={styles.groupTitle}>{grupo.nombreGrupo}</Text>
              <Text style={styles.groupDescription}>{grupo.descripcion}</Text>
              <View style={styles.groupActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => router.push(`./ad_ver/${grupo.nombreGrupo}`)}
                >
                  <Ionicons name="eye" size={20} color="#fff" />
                  <Text style={styles.actionText}>Ver</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEditButton(grupo)}
                >
                  <Ionicons name="create" size={20} color="#fff" />
                  <Text style={styles.actionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    Alert.alert(
                      'Eliminar Grupo',
                      '¿Estás seguro de que deseas eliminar este grupo?',
                      [
                        { text: 'Cancelar', style: 'cancel' },
                        { text: 'Eliminar', onPress: () => { /* Lógica para eliminar el grupo */ } },
                      ]
                    );
                  }}
                >
                  <Ionicons name="trash" size={20} color="#fff" />
                  <Text style={styles.actionText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {editing && (
          <View style={styles.editContainer}>
            <ScrollView contentContainerStyle={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nombre del grupo"
                value={nombreGrupo}
                onChangeText={setNombreGrupo}
              />
              <TextInput
                style={styles.input}
                placeholder="Descripción"
                value={descripcion}
                onChangeText={setDescripcion}
              />
              <View style={styles.input}>
                <Text style={styles.label}>Estado:</Text>
                <TextInput
                  style={styles.input}
                  value={selectedEstado}
                  onChangeText={setSelectedEstado}
                />
              </View>

              {/* Solo mostrar el código si el estado es "Privado" */}
              {selectedEstado === 'Privado' && (
                <View style={styles.input}>
                  <Text style={styles.label}>Código (si es privado):</Text>
                  <TextInput
                    style={styles.input}
                    value={codigo}
                    onChangeText={setCodigo}
                    keyboardType="numeric"
                  />
                </View>
              )}

              <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
                <Text style={styles.buttonText}>Guardar Cambios</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                <Text style={styles.cancelButtonText}>Cancelar Edición</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    color: '#000', 
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
  backgroundImage: { flex: 1, justifyContent: 'flex-start' },
  groupCard: { backgroundColor: '#ffffff', marginVertical: 10, borderRadius: 12, overflow: 'hidden', marginHorizontal: 15, elevation: 5 },
  groupImage: { width: '100%', height: 150, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  groupTitle: { fontSize: 18, fontWeight: 'bold', margin: 10 },
  groupDescription: { fontSize: 14, marginHorizontal: 10, color: '#555' },
  groupActions: { flexDirection: 'row', justifyContent: 'space-between', padding: 10 },
  actionButton: { backgroundColor: '#1b5e20', padding: 10, borderRadius: 5, flexDirection: 'row', alignItems: 'center' },
  actionText: { color: '#fff', fontSize: 14, marginLeft: 5 },
  editContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo opaco
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginTop: 250, // Ajuste para bajar un poco el formulario
  },
  input: {
    paddingVertical: 12, // Aumenta el padding vertical para más espacio
    marginBottom: 20, // Más espacio entre los inputs
    fontSize: 16,
    height: 50, // Aumenta la altura del input
  },
  label: { fontSize: 14, color: '#333', marginBottom: 5 },
  button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, alignItems: 'center', marginVertical: 10 },
  cancelButton: { backgroundColor: '#f44336', padding: 10, borderRadius: 10, alignItems: 'center', marginVertical: 10 },
  cancelButtonText: { color: '#fff', fontSize: 16 },
  buttonText: { color: '#fff', fontSize: 16 },
});
