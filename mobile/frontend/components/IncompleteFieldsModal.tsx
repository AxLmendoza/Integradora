import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const IncompleteFieldsModal: React.FC<Props> = ({ visible, onClose }) => {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Animación principal del modal
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 60,
          friction: 7,
          useNativeDriver: true,
        }),
        // Animación de shake
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ])
      ]).start();
    } else {
      Animated.timing(fadeValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      scaleValue.setValue(0);
    }
  }, [visible]);

  const onPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeValue }]}>
        <Animated.View style={[
          styles.modal,
          { 
            transform: [
              { scale: scaleValue },
              { 
                translateX: shakeAnim.interpolate({
                  inputRange: [-10, 10],
                  outputRange: [-10, 10]
                }) 
              }
            ],
          }
        ]}>
          {/* Icono de advertencia animado */}
          <Animated.View style={styles.iconContainer}>
            <MaterialCommunityIcons 
              name="alert-circle-outline" 
              size={60} 
              color="#FFA000" 
              style={styles.icon}
            />
          </Animated.View>
          
          <Text style={styles.title}>¡Faltan datos!</Text>
          
          <Text style={styles.message}>
            Por favor ingresa tu{' '}
            <Text style={styles.highlight}>matrícula</Text> y{' '}
            <Text style={styles.highlight}>contraseña</Text> para continuar.
          </Text>
          
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity 
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={onClose} 
              style={styles.button}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>ENTENDIDO</Text>
            </TouchableOpacity>
          </Animated.View>
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
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modal: {
    backgroundColor: '#FFF9F2',
    padding: 28,
    borderRadius: 28,
    width: '85%',
    alignItems: 'center',
    elevation: 15,
    borderWidth: 2,
    borderColor: '#FFE0B2',
  },
  iconContainer: {
    marginBottom: 16,
  },
  icon: {
    textShadowColor: 'rgba(255, 160, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FF6D00',
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#555',
    lineHeight: 24,
  },
  highlight: {
    fontWeight: '700',
    color: '#FF6D00',
  },
  button: {
    backgroundColor: '#FF6D00',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 28,
    minWidth: 160,
    shadowColor: '#FF6D00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
    textAlign: 'center',
  },
});

export default IncompleteFieldsModal;