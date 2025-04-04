import React, { useState, useEffect } from 'react';
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

  // Lista de mensajes
  const [messages, setMessages] = useState([
    { id: '1', text: 'Bienvenidos al chat global', time: '06:33 p.m.' },
  ]);

  // Nuevo mensaje a enviar
  const [newMessage, setNewMessage] = useState('');

  // Configurar Pusher
  useEffect(() => {
    const pusher = new Pusher('f124e7a20ba7d2ce4b93', {
      cluster: 'us2',
    });

    const channel = pusher.subscribe('chat-channel');
    channel.bind('new-message', (data: any) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), text: data.message, time: 'Ahora' },
      ]);
    });

    return () => {
      pusher.unsubscribe('chat-channel');
    };
  }, []);

  // Enviar mensaje al backend
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
  
    try {
      await fetch('http://10.1.1.119:3001/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage }), // Asegúrate de enviar el campo "message"
      });
  
      setNewMessage('');
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.messageItem}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timeText}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/fondo.jpeg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Encabezado con iconos */}
                <View style={styles.header}>
                  <TouchableOpacity onPress={() => router.push('/(tabs)/menu')}>
                    <Ionicons name="menu" size={30} color="#000" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push('/(tabs)/usuario')}>
                    <Ionicons name="person-sharp" size={30} color="#000" />
                  </TouchableOpacity>
                </View>

        <View style={styles.content}>
          {/* Lista de mensajes */}
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            style={styles.list}
          />

          {/* Campo para enviar mensajes */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Escribe un mensaje..."
              placeholderTextColor="#999"
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <TouchableOpacity onPress={sendMessage}>
              <Ionicons name="send" size={24} color="#000" />
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
    backgroundColor: '#FFA500',
  },
  backgroundImage: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 50,
  },
  list: {
    flex: 1,
    marginHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  messageItem: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 5,
    borderRadius: 8,
  },
  messageText: {
    color: '#444',
  },
  timeText: {
    color: '#333',
    fontSize: 12,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    color: '#000',
  },
});