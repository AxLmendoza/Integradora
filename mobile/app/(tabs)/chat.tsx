import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MensajesScreen() {
  const router = useRouter();

  // Texto que filtra la lista de mensajes
  const [searchText, setSearchText] = useState('');

  // Lista de mensajes de ejemplo
  const [messages] = useState([
    { id: '1', name: 'MEMO M', text: 'Hola, ¿Cómo estás?', time: '06:33 p.m.' },
    { id: '2', name: 'XIMENA IBAÑEZ', text: '¿Qué dejaron de tarea?', time: '05:00 p.m.' },
    { id: '3', name: 'ANGEL REYES', text: 'Te paso los apuntes de la clase de buki', time: '11:40 a.m.' },
    { id: '4', name: 'MIGUEL LÓPEZ', text: 'Préstame 10 pesos para las copias de...', time: '11:00 a.m.' },
    { id: '5', name: 'ALEJANDRA M', text: 'Ya bájale a tu pedo', time: 'Ayer' },
    { id: '6', name: 'KARLA LUNA', text: 'Puedes corregir el enlace de tu publi...', time: 'Ayer' },
  ]);

  // Filtra mensajes según el texto de búsqueda
  const filteredMessages = messages.filter((msg) =>
    msg.text.toLowerCase().includes(searchText.toLowerCase()) ||
    msg.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.messageItem}>
    <View style={styles.row}>
      <Ionicons name="person-circle" size={42} color="#3b3b3b" style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.messageText} numberOfLines={1}>
          {item.text}
        </Text>
      </View>
      <Text style={styles.timeText}>{item.time}</Text>
    </View>
  </View>
);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/fondo.jpeg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.content}>
          {/* Encabezado con menú y perfil */}
          <View style={styles.header}>
            <TouchableOpacity>
              <Ionicons name="menu" size={30} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="person-circle" size={30} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Barra de búsqueda */}
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar"
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
            <Ionicons name="search" size={20} color="#000" />
          </View>

          {/* Lista de mensajes */}
          <FlatList
            data={filteredMessages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            style={styles.list}
          />

          {/* Barra de navegación inferior */}
          <View style={styles.navbar}>
            <TouchableOpacity onPress={() => router.push('/grupos')}>
              <Ionicons name="home-outline" size={28} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/chat')}>
              <Ionicons name="chatbubble-ellipses-outline" size={28} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/elegir')}>
              <Ionicons name="arrow-up-circle-outline" size={28} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFA500', // Fondo naranja
  },
  backgroundImage: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 50, // Espacio para el encabezado
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 25,
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    color: '#000',
  },
  list: {
    flex: 1,
  },
  messageItem: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    marginBottom: 5,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
    color: '#000',
  },
  messageText: {
    color: '#444',
  },
  timeText: {
    color: '#333',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
  },
});
