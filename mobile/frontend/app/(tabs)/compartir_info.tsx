import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ImageBackground 
} from "react-native";
import * as DocumentPicker from "expo-document-picker";

export default function CompartirInformacionScreen() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState(null);

  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "/" });

      if (!result.assets || result.assets.length === 0) return;

      const picked = result.assets[0];
      console.log("Archivo seleccionado:", picked);

      const response = await fetch(picked.uri);
      const blob = await response.blob();
      const file = new File([blob], picked.name, { type: picked.mimeType || "application/octet-stream" });

      setArchivo(file);
    } catch (error) {
      console.error("Error seleccionando archivo:", error);
      Alert.alert("Error", "No se pudo seleccionar el archivo");
    }
  };

  const handleUpload = async () => {
    if (!archivo || !titulo || !descripcion) {
      Alert.alert("Campos incompletos", "Por favor completa todos los campos.");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("archivo", archivo);

    console.log("FormData generado:", formData);

    try {
      const resp = await fetch("http://10.1.1.118:3001/api/files/subir", {
        method: "POST",
        body: formData,
      });

      const data = await resp.json();
      console.log("Respuesta del servidor:", data);

      if (resp.ok) {
        Alert.alert("Éxito", "Archivo subido correctamente.");
        setTitulo("");
        setDescripcion("");
        setArchivo(null);
      } else {
        Alert.alert("Error", data.error || "No se pudo subir el archivo");
      }
    } catch (error) {
      console.error("Error subiendo archivo:", error);
      Alert.alert("Error", "Hubo un problema al subir el archivo.");
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/fondo.jpeg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.label}>Título:</Text>
        <TextInput
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Escribe el título"
          style={styles.input}
        />

        <Text style={styles.label}>Descripción:</Text>
        <TextInput
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Escribe la descripción"
          style={[styles.input, styles.textArea]}
          multiline
        />

        <TouchableOpacity onPress={handleSelectFile} style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Seleccionar archivo</Text>
        </TouchableOpacity>

        {archivo && <Text style={styles.fileText}>📄 {archivo.name}</Text>}

        <TouchableOpacity onPress={handleUpload} style={styles.button}>
          <Text style={styles.buttonText}>Subir</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 60,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  uploadButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 20,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  fileText: {
    marginBottom: 10,
    fontSize: 16,
    color: "#000",
  },
  button: {
    backgroundColor: "#008000",
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: "90%",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});