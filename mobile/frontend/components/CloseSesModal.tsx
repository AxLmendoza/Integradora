import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  Dimensions,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface LogoutModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ 
  visible, 
  onCancel, 
  onConfirm, 
  loading 
}) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#FFA726', '#FB8C00']}
            style={styles.modalGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.modalHeader}>
              <Ionicons name="log-out" size={32} color="#fff" />
              <Text style={styles.modalTitle}>Cerrar Sesión</Text>
            </View>
          </LinearGradient>

          <View style={styles.modalBody}>
            <Text style={styles.modalText}>
              ¿Estás seguro que deseas salir de tu cuenta?
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={onCancel}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={onConfirm}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={[styles.buttonText, styles.confirmButtonText]}>Salir</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalGradient: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  modalBody: {
    padding: 25,
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  confirmButton: {
    backgroundColor: '#ff3b30',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButtonText: {
    color: '#fff',
  },
});

export default LogoutModal;