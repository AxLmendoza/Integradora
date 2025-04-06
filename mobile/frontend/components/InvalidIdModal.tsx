import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const InvalidIdModal: React.FC<Props> = ({ visible, onClose }) => {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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
        // Animación de pulso para el icono
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        )
      ]).start();
    } else {
      Animated.timing(fadeValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      scaleValue.setValue(0);
      pulseAnim.setValue(1); // Resetear animación al cerrar
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
            transform: [{ scale: scaleValue }],
          }
        ]}>
          {/* Contenedor del icono con animación de pulso */}
          <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.iconBackground}>
              <FontAwesome name="exclamation-triangle" size={40} color="#D32F2F" />
            </View>
            <MaterialIcons name="filter-1" size={60} color="#D32F2F" style={styles.numberIcon} />
          </Animated.View>
          
          <Text style={styles.title}>MATRÍCULA INVÁLIDA</Text>
          
          <Text style={styles.message}>
            La <Text style={styles.highlight}>matrícula</Text> solo puede contener{' '}
            <Text style={styles.numberHighlight}>números</Text>.
          </Text>
          
          <View style={styles.exampleContainer}>
            <Text style={styles.exampleText}>Ejemplo válido:</Text>
            <View style={styles.exampleBox}>
              <Text style={styles.exampleNumber}>2023154</Text>
            </View>
          </View>
          
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
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 20,
    width: '85%',
    alignItems: 'center',
    elevation: 10,
    borderLeftWidth: 6,
    borderLeftColor: '#D32F2F',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  iconBackground: {
    backgroundColor: '#FFEBEE',
    borderRadius: 50,
    padding: 10,
    marginRight: -15,
    zIndex: 2,
  },
  numberIcon: {
    marginLeft: -15,
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
    lineHeight: 22,
  },
  highlight: {
    fontWeight: '700',
    color: '#D32F2F',
    textDecorationLine: 'underline',
  },
  numberHighlight: {
    fontWeight: '700',
    color: '#D32F2F',
    fontFamily: 'monospace',
    fontSize: 18,
  },
  exampleContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  exampleText: {
    fontSize: 14,
    color: '#777',
    marginBottom: 6,
  },
  exampleBox: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  exampleNumber: {
    fontFamily: 'monospace',
    fontSize: 18,
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#D32F2F',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 25,
    minWidth: 160,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
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

export default InvalidIdModal;