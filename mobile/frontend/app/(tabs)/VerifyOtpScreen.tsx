import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert
} from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const API_URL = "http://192.168.1.107:3001/api/auth";

// Solución para el error de tipado - usar Record<string, string> en lugar de interfaz
export default function VerifyOtpScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const correo = typeof params.correo === 'string' ? params.correo : params.correo?.[0] || '';

    const [otp, setOtp] = useState("");
    const [isResending, setIsResending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isExpired, setIsExpired] = useState(false);

    const resetState = () => {
        setOtp("");
        setIsResending(false);
        setIsVerifying(false);
        setTimeLeft(60);
        setIsExpired(false);
    };

    useFocusEffect(
        React.useCallback(() => {
            resetState();
            return () => { };
        }, [correo])
    );

    useEffect(() => {
        if (timeLeft <= 0) {
            setIsExpired(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setIsExpired(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            Alert.alert("Error", "Por favor ingresa los 6 dígitos del código.");
            return;
        }

        setIsVerifying(true);
        try {
            const response = await fetch(`${API_URL}/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo, otp }),
            });

            const data = await response.json();
            console.log("Respuesta del servidor:", data); // Debug

            if (response.ok) {
                // 1. Verificar que data.redirectTo existe
                const redirectPath = data.redirectTo || "/inicio_ses";

                // 2. Verificar que los parámetros necesarios están presentes
                const routeParams = {
                    matricula: data.matricula || '',
                    nombre: data.nombre || '',
                };

                console.log("Redirigiendo a:", redirectPath, "con params:", routeParams); // Debug

                // 3. Redirigir usando replace
                router.replace({
                    pathname: redirectPath,
                    params: routeParams,
                });

            } else {
                Alert.alert(
                    "Error",
                    data.error || "No se pudo verificar el código. Intenta nuevamente."
                );
            }
        } catch (error) {
            console.error("Error en verificación:", error);
            Alert.alert(
                "Error de conexión",
                "No se pudo conectar con el servidor. Verifica tu conexión."
            );
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendOtp = async () => {
        setIsResending(true);
        try {
            const response = await fetch(`${API_URL}/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: correo }),
            });

            const data = await response.json();
            if (response.ok) {
                resetState();
                Alert.alert(
                    "Código reenviado",
                    "Hemos enviado un nuevo código a tu correo.",
                    [
                        { text: "OK" }
                    ]
                );
            } else {
                Alert.alert(
                    "Error",
                    data.error || "No se pudo reenviar el código."
                );
            }
        } catch (error) {
            Alert.alert(
                "Error de conexión",
                "No se pudo conectar con el servidor."
            );
        } finally {
            setIsResending(false);
        }
    };

    const handleBackToRegister = () => {
        resetState();
        router.replace("/registro");
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Ionicons
                            name="timer"
                            size={40}
                            color={isExpired ? "#ff3b30" : "#ff6b00"}
                        />
                        <Text style={[styles.timerText, isExpired && styles.expiredText]}>
                            {isExpired ? "00:00" : `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`}
                        </Text>
                    </View>

                    <Text style={styles.title}>Verifica tu cuenta</Text>
                    <Text style={styles.subtitle}>
                        Introduce el código de 6 dígitos enviado a:
                    </Text>
                    <Text style={styles.email}>{correo}</Text>

                    <TextInput
                        style={[styles.input, isExpired && styles.disabledInput]}
                        placeholder="------"
                        placeholderTextColor="#aaa"
                        value={otp}
                        onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ""))}
                        keyboardType="number-pad"
                        maxLength={6}
                        textAlign="center"
                        autoFocus
                        editable={!isExpired}
                    />

                    <Text style={styles.hintText}>
                        <Ionicons name="information-circle" size={16} color="#ff6b00" /> El
                        código {isExpired ? "ha expirado" : `expirará en ${timeLeft} segundos`}
                    </Text>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            (isVerifying || isExpired) && styles.buttonDisabled,
                        ]}
                        onPress={handleVerifyOtp}
                        disabled={isVerifying || isExpired || otp.length !== 6}
                    >
                        {isVerifying ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>
                                {isExpired ? "Código expirado" : "Verificar"}
                            </Text>
                        )}
                    </TouchableOpacity>

                    {!isExpired ? (
                        <TouchableOpacity
                            style={styles.resendButton}
                            onPress={handleResendOtp}
                            disabled={isResending || timeLeft > 0}
                        >
                            <Text style={styles.resendText}>
                                {isResending ? "Enviando..." : "Reenviar código"}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.expiredActions}>
                            <Text style={styles.warningText}>
                                ⚠️ El código ha expirado. Debes registrarte nuevamente.
                            </Text>
                            <TouchableOpacity
                                style={styles.registerButton}
                                onPress={handleBackToRegister}
                            >
                                <Text style={styles.registerButtonText}>Registrar nuevamente</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleBackToRegister}
                    >
                        <Ionicons name="arrow-back" size={16} color="#ff6b00" />
                        <Text style={styles.backText}>Volver al registro</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    header: {
        alignItems: "center",
        marginBottom: 20,
    },
    timerText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#ff6b00",
        marginTop: 10,
    },
    expiredText: {
        color: "#ff3b30",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#ff6b00",
        textAlign: "center",
        marginBottom: 30,
    },
    input: {
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
        padding: 15,
        fontSize: 24,
        fontWeight: "bold",
        letterSpacing: 8,
        color: "#333",
        textAlign: "center",
        marginBottom: 20,
    },
    disabledInput: {
        backgroundColor: "#eee",
        color: "#999",
    },
    hintText: {
        color: "#666",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 20,
    },
    warningText: {
        color: "#ff3b30",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 15,
        fontWeight: "500",
    },
    button: {
        backgroundColor: "#ff6b00",
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 15,
    },
    buttonDisabled: {
        backgroundColor: "#ccc",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    resendButton: {
        alignItems: "center",
        marginBottom: 20,
    },
    resendText: {
        color: "#ff6b00",
        fontSize: 16,
        fontWeight: "bold",
    },
    expiredActions: {
        alignItems: "center",
        marginBottom: 20,
    },
    registerButton: {
        backgroundColor: "#ff3b30",
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
    },
    registerButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    backText: {
        color: "#ff6b00",
        fontSize: 14,
        marginLeft: 5,
    },
});