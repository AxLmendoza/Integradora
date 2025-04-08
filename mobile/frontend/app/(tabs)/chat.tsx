import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import axios from 'axios';
import Pusher from 'pusher-js';
import { v4 as uuidv4 } from 'uuid';  // <- importamos uuid

interface Message {
  id: string;            // <- nuevo campo
  username: string;
  message: string;
  timestamp: string;
}

const ChatScreen = () => {
  const [username, setUsername] = useState('Anon');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const pusher = new Pusher('f124e7a20ba7d2ce4b93', { cluster: 'us2' });
    const channel = pusher.subscribe('chat');

    channel.bind('new-message', (data: Message) => {
      // ❌ Ignorar si ya existe ese id
      if (messages.some(msg => msg.id === data.id)) return;
      setMessages(prev => [...prev, data]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]); // <-- añadimos messages como dependencia

  const sendMessage = async () => {
    if (!message.trim() || sending) return;
    setSending(true);

    const newMsg: Message = {
      id: uuidv4(),             // <-- generamos ID único
      username,
      message,
      timestamp: new Date().toISOString(),
    };

    // Mostrar inmediatamente
    setMessages(prev => [...prev, newMsg]);
    setMessage('');

    try {
      await axios.post('http://192.168.1.107:3001/api/chat/message', newMsg);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    }

    setTimeout(() => {
      setSending(false);
    }, 800);
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.username}>{item.username}:</Text>
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>Chat en Vivo 💬</Text>

      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <TextInput
        placeholder="Tu nombre"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <View style={styles.sendContainer}>
        <TextInput
          placeholder="Escribe un mensaje"
          value={message}
          onChangeText={setMessage}
          style={[styles.input, styles.inputMessage]}
        />
        <TouchableOpacity style={styles.button} onPress={sendMessage}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  list: { paddingBottom: 16 },
  messageContainer: { flexDirection: 'row', marginBottom: 8 },
  username: { fontWeight: 'bold', marginRight: 4 },
  messageText: { flexShrink: 1 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  sendContainer: { flexDirection: 'row', alignItems: 'center' },
  inputMessage: { flex: 1, marginRight: 8 },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
