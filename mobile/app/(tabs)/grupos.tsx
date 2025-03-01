import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/fondo.jpeg')}
        style={styles.backgroundImage}
        resizeMode="cover"
        >

      <View style={styles.overlay} />

      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={30} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="help-circle" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>¡REALIZA UNA PREGUNTA!</Text>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Buscar" />
        <Ionicons name="search" size={20} color="#000" style={styles.searchIcon} />
      </View>

      <View style={styles.contentContainer}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/grupos')}>
          <Image
            source={require('../../assets/images/grupos.jpeg')}
            style={styles.groupsImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Barra de navegación inferior */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/grupos')}>
          <Ionicons name="home-outline" size={28} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(tabs)/preguntas')}>
          <Ionicons name="help-circle-outline" size={28} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(tabs)/chat')}>
          <Ionicons name="chatbubble-ellipses-outline" size={28} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(tabs)/subir_Ar')}>
          <Ionicons name="arrow-up-circle-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>
            </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,165,0,0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 5,
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginHorizontal: 30,
    marginBottom: 15,
    marginTop: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
  },
  searchIcon: {
    marginLeft: 50,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupsImage: {
    width: 500,
    height: 200,
    marginTop: 160,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#ffa500', // Ajusta el color a tu preferencia
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});