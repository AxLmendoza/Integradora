import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  userName: string;
}

const WelcomeModal: React.FC<Props> = ({ visible, onClose, userName }) => {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef<LottieView>(null);
  const [progress] = useState(new Animated.Value(0));

  // Animación principal del modal
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        })
      ]).start(() => {
        // Iniciar animación de confeti cuando el modal está visible
        confettiAnim.current?.play();
        
        // Animación de progreso simulada
        Animated.timing(progress, {
          toValue: 1,
          duration: 2500,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
      });
    } else {
      Animated.timing(fadeValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      scaleValue.setValue(0);
      progress.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeValue }]}>
        {/* Animación de confeti de fondo */}
        <LottieView
          ref={confettiAnim}
          source={require('@/assets/conffeti.json')}
          autoPlay={false}
          loop={true}
          style={styles.confetti}
          speed={1.5}
        />
        
        <Animated.View style={[
          styles.modal,
          { 
            transform: [{ scale: scaleValue }],
          }
        ]}>
          {/* Icono de bienvenida */}
          <View style={styles.iconContainer}>
            <Ionicons name="sparkles" size={60} color="#FFD700" style={styles.sparkleIcon} />
            <AntDesign name="checkcircle" size={80} color="#4CAF50" />
            <Ionicons name="sparkles" size={60} color="#FFD700" style={styles.sparkleIcon} />
          </View>
          
          <Text style={styles.title}>¡BIENVENIDO!</Text>
          
          <Text style={styles.greeting}>
            Hola <Text style={styles.userName}>{userName}</Text>
          </Text>
          
          <Text style={styles.message}>Estamos cargando tu información...</Text>
          
          {/* Barra de progreso animada */}
          <View style={styles.progressBarContainer}>
            <Animated.View 
              style={[
                styles.progressBar,
                {
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  })
                }
              ]}
            />
          </View>
          
          <TouchableOpacity 
            onPress={onClose} 
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>CONTINUAR</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  confetti: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  modal: {
    backgroundColor: '#FFF',
    padding: 30,
    borderRadius: 25,
    width: '85%',
    alignItems: 'center',
    elevation: 15,
    borderWidth: 3,
    borderColor: '#E8F5E9',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sparkleIcon: {
    marginHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(76, 175, 80, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  userName: {
    fontWeight: '800',
    color: '#FF6D00',
    textDecorationLine: 'underline',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 25,
    fontStyle: 'italic',
  },
  progressBarContainer: {
    height: 10,
    width: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: 25,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    minWidth: 200,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});

export default WelcomeModal;