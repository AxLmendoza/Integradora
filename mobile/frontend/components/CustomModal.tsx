import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const CustomModal: React.FC<Props> = ({ visible, title, message, onClose }) => {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const eyeScale = useRef(new Animated.Value(1)).current;
  const { width } = Dimensions.get('window');

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
        })
      ]).start(() => {
        startWinkAnimation();
      });
    } else {
      Animated.timing(fadeValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      scaleValue.setValue(0);
      eyeScale.setValue(1); // Resetear animación del ojo al cerrar
    }
  }, [visible]);

  // Animación del guiño optimizada
  const startWinkAnimation = () => {
    // Limpiar animación previa
    eyeScale.setValue(1);
    
    const winkSequence = () => {
      Animated.sequence([
        // Cierre rápido pero suave
        Animated.timing(eyeScale, {
          toValue: 0.05,
          duration: 80,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad)
        }),
        // Pequeña pausa cerrado
        Animated.delay(120),
        // Apertura con efecto elástico
        Animated.timing(eyeScale, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
          easing: Easing.out(Easing.elastic(1.2))
        }),
        // Tiempo aleatorio entre 2-4 segundos
        Animated.delay(2000 + Math.random() * 2000)
      ]).start(({ finished }) => {
        if (finished) winkSequence(); // Solo reiniciar si se completó
      });
    };

    winkSequence();
  };

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

  // Componente de ardilla mejorado
  const Squirrel = () => (
    <View style={styles.squirrelContainer}>
      {/* Cabeza estilizada */}
      <View style={styles.squirrelHead}>
        {/* Orejas con detalle */}
        <View style={[styles.ear, styles.earLeft]}>
          <View style={styles.earInner} />
        </View>
        <View style={[styles.ear, styles.earRight]}>
          <View style={styles.earInner} />
        </View>
        
        {/* Ojos optimizados para animación */}
        <View style={styles.eyes}>
          <View style={styles.eyeLeft}>
            <View style={styles.eyeShine} />
          </View>
          <Animated.View 
            style={[
              styles.eyeRight, 
              { 
                transform: [
                  { 
                    scaleY: eyeScale.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.05, 1]
                    }) 
                  }
                ] 
              }
            ]}
          >
            <View style={styles.eyeShine} />
          </Animated.View>
        </View>
        
        {/* Mejillas sonrosadas */}
        <View style={styles.cheeks}>
          <View style={styles.cheek} />
          <View style={styles.cheek} />
        </View>
        
        {/* Nariz con detalle */}
        <View style={styles.nose} />
        
        {/* Sonrisa delicada */}
        <View style={styles.mouth} />
      </View>
    </View>
  );

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
          <View style={styles.header}>
            <Squirrel />
            <Text style={styles.title}>{title}</Text>
          </View>
          
          <Text style={styles.message}>{message}</Text>
          
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity 
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={onClose} 
              style={styles.button}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>¡ENTENDIDO!</Text>
              <View style={styles.buttonGlow} />
            </TouchableOpacity>
          </Animated.View>
          
          <View style={styles.cornerAcorn} />
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modal: {
    backgroundColor: '#FFF',
    padding: 0,
    borderRadius: 24,
    width: '85%',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  header: {
    backgroundColor: '#FF6D00',
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#FF6D00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 10,
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 28,
    paddingHorizontal: 24,
    color: '#333',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#FF6D00',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 50,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
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
    position: 'relative',
    zIndex: 2,
  },
  buttonGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    top: 0,
    left: -100,
    transform: [{ skewX: '-20deg' }],
    zIndex: 1,
  },
  cornerAcorn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 30,
    height: 30,
    backgroundColor: '#8B4513',
    borderRadius: 15,
    borderBottomRightRadius: 5,
    transform: [{ rotate: '-30deg' }],
  },
  // Estilos mejorados de la ardilla
  squirrelContainer: {
    position: 'relative',
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  squirrelHead: {
    width: 100,
    height: 100,
    backgroundColor: '#FFA245',
    borderRadius: 50,
    position: 'relative',
    borderWidth: 2,
    borderColor: '#FF8C25',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  ear: {
    position: 'absolute',
    width: 26,
    height: 26,
    backgroundColor: '#FF8C25',
    borderRadius: 13,
    top: -8,
    borderWidth: 2,
    borderColor: '#FF6D00',
    zIndex: 2,
  },
  earInner: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 16,
    height: 16,
    backgroundColor: '#FFA245',
    borderRadius: 8,
  },
  earLeft: {
    left: 10,
    transform: [{ rotate: '-20deg' }],
  },
  earRight: {
    right: 10,
    transform: [{ rotate: '20deg' }],
  },
  eyes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 30,
    left: 20,
    right: 20,
  },
  eyeLeft: {
    width: 18,
    height: 18,
    backgroundColor: '#3A2D1B',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  eyeRight: {
    width: 18,
    height: 18,
    backgroundColor: '#3A2D1B',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    transformOrigin: 'center', // Importante para la animación
  },
  eyeShine: {
    width: 6,
    height: 6,
    backgroundColor: 'white',
    borderRadius: 3,
    marginLeft: 3,
    marginTop: 2,
  },
  cheeks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 55,
    left: 15,
    right: 15,
  },
  cheek: {
    width: 20,
    height: 12,
    backgroundColor: 'rgba(255, 150, 100, 0.4)',
    borderRadius: 10,
  },
  nose: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    marginLeft: -10,
    width: 20,
    height: 16,
    backgroundColor: '#FF6D00',
    borderRadius: 10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
  },
  mouth: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 6,
    backgroundColor: 'transparent',
    borderBottomWidth: 3,
    borderBottomColor: '#3A2D1B',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});