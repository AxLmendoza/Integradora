import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

// Componente principal de pantalla de grupos
export default function GruposScreen() {
  const router = useRouter();
  // Variables para controlar la pestaña activa y el estado del grupo editado
  const [activeTab, setActiveTab] = React.useState('Nuevo');
  const [selectedEstado, setSelectedEstado] = React.useState('Privado');
  const [editing, setEditing] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const [categorias, setCategorias] = React.useState([]);
  const [nuevaCategoria, setNuevaCategoria] = React.useState('');
  const [nombreGrupo, setNombreGrupo] = React.useState('');
  const [descripcion, setDescripcion] = React.useState('');
  const [codigo, setCodigo] = React.useState('');
  const [grupos, setGrupos] = React.useState([]);
  const [grupoEditado, setGrupoEditado] = React.useState(null);

  // Selección de imagen usando el picker de imágenes
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

  // Agrega una categoría a la lista
  const handleAddCategoria = () => {
    if (nuevaCategoria.trim() !== '') {
      setCategorias([...categorias, nuevaCategoria]);
      setNuevaCategoria('');
    } else {
      alert('Por favor ingresa un nombre para la categoría');
    }
  };

  // Elimina una categoría por índice
  const handleRemoveCategoria = (index) => {
    const updatedCategorias = categorias.filter((_, i) => i !== index);
    setCategorias(updatedCategorias);
  };

  // Guarda los cambios del grupo editado
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

    // Reemplaza el grupo editado por el actualizado
    const updatedGrupos = grupos.map((grupo) =>
      grupo.nombreGrupo === grupoEditado.nombreGrupo ? updatedGroup : grupo
    );

    setGrupos(updatedGrupos);
    setEditing(false);
    setGrupoEditado(null);

    Alert.alert('Grupo Actualizado', 'Los cambios se han guardado exitosamente.', [
      { text: 'OK', onPress: () => {} },
    ]);

    // Limpia los campos
    setNombreGrupo('');
    setDescripcion('');
    setNuevaCategoria('');
    setCategorias([]);
    setImage(null);
    setSelectedEstado('Privado');
    setCodigo('');
  };

  // Prepara el formulario para editar un grupo
  const handleEditButton = (grupo) => {
    setEditing(true);
    setGrupoEditado(grupo);
    setNombreGrupo(grupo.nombreGrupo);
    setDescripcion(grupo.descripcion);
    setCategorias(grupo.categorias);
    setImage(grupo.image);
    setSelectedEstado(grupo.selectedEstado);
    setCodigo(grupo.codigo || '');
  };

  // Cancela el modo edición y limpia los campos
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

  // Elimina un grupo con confirmación
  const handleDeleteGroup = (grupo) => {
    Alert.alert(
      'Eliminar Grupo',
      `¿Estás seguro de que quieres eliminar el grupo "${grupo.nombreGrupo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const updatedGrupos = grupos.filter((g) => g.nombreGrupo !== grupo.nombreGrupo);
            setGrupos(updatedGrupos);
            Alert.alert('Grupo Eliminado', 'El grupo ha sido eliminado exitosamente.', [
              { text: 'OK', onPress: () => {} },
            ]);
            setEditing(false);
          },
        },
      ]
    );
  };

  // Crea un nuevo grupo
  const handleCreateGroup = () => {
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

    const nuevoGrupo = {
      nombreGrupo,
      descripcion,
      categorias,
      image,
      selectedEstado,
      codigo,
    };

    setGrupos([...grupos, nuevoGrupo]);

    Alert.alert('Grupo Creado', 'El grupo ha sido creado exitosamente.', [
      { text: 'OK', onPress: () => {} },
    ]);

    // Limpia el formulario
    setNombreGrupo('');
    setDescripcion('');
    setNuevaCategoria('');
    setCategorias([]);
    setImage(null);
    setSelectedEstado('Privado');
    setCodigo('');
  };

  // Botón de administración (placeholder)
  const handleAdminButton = () => {
    console.log('Administrando grupo');
  };

  // Render principal de la interfaz
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/ad_fondo.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/ad_menu')}>
            <Ionicons name="menu" size={30} color="#000" />
          </TouchableOpacity>

          <Text style={styles.title}>GRUPOS</Text>

          <TouchableOpacity onPress={() => router.push('/(tabs)/ad_usuario')}>
            <Ionicons name="person-circle" size={30} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
          {['Nuevo', 'Míos', 'Guardados'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => {
                setActiveTab(tab);
                setEditing(false);
                setNombreGrupo('');
                setDescripcion('');
                setNuevaCategoria('');
                setCategorias([]);
                setImage(null);
                setSelectedEstado('Privado');
                setCodigo('');
              }}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'Nuevo' || (activeTab === 'Míos' && editing) ? (
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

              <View style={styles.buttonColumn}>
                {editing && (
                  <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                    <Text style={styles.cancelButtonText}>Cancelar Edición</Text>
                  </TouchableOpacity>
                )}
                {editing && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteGroup(grupoEditado)}
                  >
                    <Text style={styles.deleteButtonText}>Eliminar Grupo</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.button}
                  onPress={editing ? handleSaveChanges : handleCreateGroup}
                >
                  <Text style={styles.buttonText}>{editing ? 'Guardar Cambios' : 'Crear'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        ) : activeTab === 'Guardados' ? (
          <ScrollView style={styles.groupsContainer}>
            {grupos.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No tienes grupos guardados.</Text>
              </View>
            ) : (
              grupos.map((grupo, index) => (
                <View key={index} style={styles.groupCard}>
                  {grupo.image ? (
                    <Image source={{ uri: grupo.image }} style={styles.groupImage} />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Ionicons name="image" size={40} color="#000" />
                    </View>
                  )}
                  <View style={styles.groupInfo}>
                    <Text style={styles.groupTitle}>{grupo.nombreGrupo}</Text>
                    <Text style={styles.groupDescription}>{grupo.descripcion}</Text>
                    {grupo.selectedEstado === 'Privado' && (
                      <Text style={styles.groupCode}>Código: {grupo.codigo}</Text>
                    )}
                    <View style={styles.separator} />
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity style={styles.viewButton} onPress={() =>  router.push ('/grupo_detalle') }>
                        <Text style={styles.viewButtonText}>Ver</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        ) : (
          <ScrollView style={styles.groupsContainer}>
            {grupos.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No tienes grupos creados.</Text>
              </View>
            ) : (
              grupos.map((grupo, index) => (
                <View key={index} style={styles.groupCard}>
                  {grupo.image ? (
                    <Image source={{ uri: grupo.image }} style={styles.groupImage} />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Ionicons name="image" size={40} color="#000" />
                    </View>
                  )}
                  <View style={styles.groupInfo}>
                    <Text style={styles.groupTitle}>{grupo.nombreGrupo}</Text>
                    <Text style={styles.groupDescription}>{grupo.descripcion}</Text>
                    {grupo.selectedEstado === 'Privado' && (
                      <Text style={styles.groupCode}>Código: {grupo.codigo}</Text>
                    )}
                    <View style={styles.separator} />
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={styles.adminButton}
                        onPress={() =>  router.push ('/ejemplo') }>
                        <Text style={styles.adminText}>Administrar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleEditButton(grupo)}
                      >
                        <Text style={styles.actionText}>Editar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </ImageBackground>
    </View>
  );
}

const colors = {
  primary: 'green',
  secondary: '#FF4D4D',
  white: '#fff',
  black: '#000',
  backgroundOverlay: 'rgba(255,165,0,0.3)',
  gray: '#f0f0f0',
  blue: 'blue',
};

const baseStyles = {
  flexRow: {
    flexDirection: 'row',
  },
  flexRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexRowAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  flexRowEvenly: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  borderRadius: {
    borderRadius: 5,
  },
  borderRadiusRound: {
    borderRadius: 25,
  },
  paddingSmall: {
    padding: 10,
  },
  paddingMedium: {
    padding: 15,
  },
  paddingLarge: {
    padding: 20,
  },
  marginBottomSmall: {
    marginBottom: 10,
  },
  marginBottomMedium: {
    marginBottom: 15,
  },
  marginBottomLarge: {
    marginBottom: 20,
  },
};

export const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1, justifyContent: 'flex-start' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
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
    color: '#fff',
  },
  tabs: {
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
  },
  activeTab: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  tabText: {
    fontSize: 16,
    color: '#fff',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#1b5e20',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#888',
    paddingVertical: 8,
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 10,
    top: 8,
  },
  categoriesList: {
    marginVertical: 10,
  },
  categoryItem: {
    fontSize: 14,
    marginVertical: 3,
    color: '#555',
  },
  picker: {
    marginTop: 10,
  },
  imageButton: {
    backgroundColor: '#3b9d9b',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#1b5e20',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  groupCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  groupImage: {
    width: '100%',
    height: 150,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
  },
  groupDescription: {
    fontSize: 14,
    marginHorizontal: 10,
    color: '#555',
  },
  groupActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  editButton: {
    backgroundColor: '#3b9d9b',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  manageButton: {
    backgroundColor: '#9c27b0',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
  },
  manageText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
  },
});
