import React from 'react';
import { 
  StyleSheet, 
  View, 
  ImageBackground, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  
  const router = useRouter(); // Para navegar a otras pantallas

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={1} 
      onPress={() => router.push('/home')}
    >
      <ImageBackground
        source={require('../../assets/images/personas_1.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.contentContainer}>
          {/* Logo tocable para navegar */}
          <TouchableOpacity onPress={() => router.push('/home')}>
            <Image
              source={require('../../assets/images/ardilla_naranja.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 2,
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 290,
    height: 250,
    marginBottom: 20,
  },
});
