import * as React from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

export default function NuevoGruposScreen() {
  const router = useRouter();
  const [groupName, setGroupName] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [status, setStatus] = React.useState("Privado");
  const [code, setCode] = React.useState("");
  const [image, setImage] = React.useState(null);

  // Función para seleccionar imagen desde galería
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/ad_fondo.jpg")}
      style={styles.background}
    >

      {/* Encabezado con iconos */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/ad_menu')}>
          <Ionicons name="menu" size={30} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(tabs)/ad_usuario')}>
          <Ionicons name="person-sharp" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Título */}
      <Text style={styles.title}>Pregunta</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Contenido principal */}
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="menu" size={30} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>GRUPOS</Text>
            <Ionicons name="person-circle-outline" size={30} color="white" />
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <Text style={[styles.tab, styles.activeTab]}>Nuevo</Text>
            <Text style={styles.tab}>Míos</Text>
            <Text style={styles.tab}>Guardados</Text>
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del grupo"
              placeholderTextColor="gray"
              value={groupName}
              onChangeText={setGroupName}
            />

            <Text style={styles.label}>Categoría</Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.flexInput]}
                placeholder="Nombre de la categoría"
                placeholderTextColor="gray"
                value={category}
                onChangeText={setCategory}
              />
              <TouchableOpacity style={styles.addButton}>
                <Ionicons name="add-circle-outline" size={30} color="black" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Definición de la descripción"
              placeholderTextColor="gray"
              multiline
              numberOfLines={3}
              value={description}
              onChangeText={setDescription}
            />

            <View style={styles.row}>
              <View style={styles.flexInput}>
                <Text style={styles.label}>Estado</Text>
                <Picker
                  selectedValue={status}
                  style={styles.picker}
                  onValueChange={(itemValue) => setStatus(itemValue)}
                >
                  <Picker.Item label="Privado" value="Privado" />
                  <Picker.Item label="Público" value="Público" />
                </Picker>
              </View>

              <View style={styles.flexInput}>
                <Text style={styles.label}>Imagen</Text>
                <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                  <Text style={styles.imageButtonText}>Foto</Text>
                </TouchableOpacity>
                {image && <Image source={{ uri: image }} style={styles.image} />}
              </View>
            </View>

            <Text style={styles.label}>Código</Text>
            <TextInput
              style={styles.input}
              placeholder="Cinco números"
              placeholderTextColor="gray"
              keyboardType="numeric"
              maxLength={5}
              value={code}
              onChangeText={setCode}
            />
          </View>

          {/* Botón Crear */}
          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createButtonText}>Crear</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 5,
    color: '#000',
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80, // Espacio para que el contenido no se solape con el navbar
  },
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,

  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 8,
  },
  tab: {
    color: "white",
    fontSize: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "white",
  },
  form: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    color: "white",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  flexInput: {
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 50,
  },
  picker: {
    backgroundColor: "white",
    borderRadius: 5,
  },
  imageButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  imageButtonText: {
    color: "black",
    fontSize: 16,
  },
  image: {
    width: 50,
    height: 50,
    marginTop: 5,
    borderRadius: 5,
  },
  createButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  createButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  navbarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#000",
    alignItems: "center",
    paddingVertical: 15,
  },
});
