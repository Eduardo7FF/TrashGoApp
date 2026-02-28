import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { User, Lock } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import {
  useFonts,
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
} from '@expo-google-fonts/nunito';
import { COLORS, SPACING, SIZES } from '../constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [fontsLoaded] = useFonts({
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
  });

  if (!fontsLoaded) return null;

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    Alert.alert('¡Éxito!', 'Iniciando sesión...');
  };

  const handleGmailLogin = () => {
    Alert.alert('Gmail', 'Función de Gmail en desarrollo');
  };

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Iniciar Sesión</Text>
      <Text style={styles.subtitle}>Bienvenido de nuevo a TrashGo</Text>

      {/* Formulario */}
      <View style={styles.form}>
        {/* Input Usuario */}
        <View style={styles.inputContainer}>
          <View style={styles.iconWrapper}>
            <User size={20} color="#9CA3AF" strokeWidth={2} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Usuario o Email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        {/* Input Contraseña */}
        <View style={styles.inputContainer}>
          <View style={styles.iconWrapper}>
            <Lock size={20} color="#9CA3AF" strokeWidth={2} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        {/* Botón Iniciar Sesión - Gradiente + flecha */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          activeOpacity={0.85}
        >
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          <View style={styles.arrowCircle}>
            <Text style={styles.arrowText}>→</Text>
          </View>
        </TouchableOpacity>

        {/* Olvidaste contraseña */}
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>

        {/* Registro */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>¿No tienes cuenta? </Text>
          <TouchableOpacity>
            <Text style={styles.signupLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>O</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Botón Gmail */}
        <TouchableOpacity
          style={styles.gmailButton}
          onPress={handleGmailLogin}
          activeOpacity={0.8}
        >
          <Svg width={20} height={20} viewBox="0 0 48 48">
            <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </Svg>
          <Text style={styles.gmailButtonText}>Continuar con Gmail</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 34,
    fontFamily: 'Nunito_300Light',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 50,
    letterSpacing: -0.2,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  iconWrapper: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    color: '#1F2937',
    letterSpacing: -0.2,
  },
  loginButton: {
    width: '100%',
    paddingVertical: 14,
    paddingLeft: 24,
    paddingRight: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
    letterSpacing: -0.3,
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
    letterSpacing: -0.2,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  signupText: {
    color: '#6B7280',
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    letterSpacing: -0.2,
  },
  signupLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    letterSpacing: -0.2,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#9CA3AF',
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
    letterSpacing: 0.5,
  },
  gmailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
  },
  gmailButtonText: {
    color: '#4B5563',
    fontSize: 15,
    fontFamily: 'Nunito_500Medium',
    letterSpacing: -0.2,
  },
});