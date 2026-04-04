import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { User, Lock, Eye, EyeOff } from 'lucide-react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Rect, G } from 'react-native-svg';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../config/supabase';

const { width } = Dimensions.get('window');
const BTN_W = 90;
const BTN_H = 42;
const BTN_R = 21;

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const [fontsLoaded] = useFonts({ Nunito_400Regular, Nunito_700Bold });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  if (!fontsLoaded) return null;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (authError) throw authError;

      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('rol, nombre_completo')
        .eq('id', authData.user.id)
        .single();

      if (userError) throw userError;
      if (!userData) throw new Error('Usuario no encontrado');

      navigateByRole(userData.rol, userData.nombre_completo);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const navigateByRole = (rol: string, nombre: string) => {
    switch (rol) {
      case 'ciudadano': navigation.replace('CiudadanoHome', { nombre }); break;
      case 'conductor': navigation.replace('ConductorHome', { nombre }); break;
      case 'admin': navigation.replace('AdminHome', { nombre }); break;
      default: Alert.alert('Error', 'Rol no reconocido');
    }
  };

  const PillButton = ({
    onPress, disabled, isLoading, gradStart, gradEnd,
  }: {
    onPress: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    gradStart: string;
    gradEnd: string;
  }) => (
    <TouchableOpacity
      style={[styles.pillBtn, disabled && { opacity: 0.7 }]}
      onPress={onPress}
      activeOpacity={0.82}
      disabled={disabled}
    >
      <Svg width={BTN_W} height={BTN_H} viewBox={`0 0 ${BTN_W} ${BTN_H}`} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={`g${gradStart}`} x1="0" y1="0.5" x2="1" y2="0.5">
            <Stop offset="0" stopColor={gradStart} />
            <Stop offset="1" stopColor={gradEnd} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width={BTN_W} height={BTN_H} rx={BTN_R} fill={`url(#g${gradStart})`} />
      </Svg>
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Svg width={26} height={26} viewBox="0 0 28 28">
          <G stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none">
            <Path d="M6 14 L22 14" />
            <Path d="M15 7 L22 14 L15 21" />
          </G>
        </Svg>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      {/* BLOB ARRIBA */}
      <View style={styles.blobTop}>
        <Svg width={width} height={100} viewBox={`0 0 ${width} 100`}>
          <Defs>
            <LinearGradient id="gradTop" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#FFD93D" />
              <Stop offset="0.5" stopColor="#A8E063" />
              <Stop offset="1" stopColor="#10B981" />
            </LinearGradient>
          </Defs>
          <Path
            d={`M0,0 L${width},0 L${width},65 Q${width * 0.8},100 ${width * 0.55},70 Q${width * 0.3},40 0,72 Z`}
            fill="url(#gradTop)"
          />
        </Svg>
      </View>

      {/* BLOB ABAJO */}
      <View style={styles.blobBottom}>
        <Svg width={width} height={90} viewBox={`0 0 ${width} 90`}>
          <Defs>
            <LinearGradient id="gradBottom" x1="0" y1="1" x2="1" y2="0">
              <Stop offset="0" stopColor="#FF6B47" />
              <Stop offset="0.5" stopColor="#FF8E6E" />
              <Stop offset="1" stopColor="#FFB347" />
            </LinearGradient>
          </Defs>
          <Path
            d={`M0,90 L${width},90 L${width},30 Q${width * 0.75},0 ${width * 0.5},35 Q${width * 0.25},65 0,30 Z`}
            fill="url(#gradBottom)"
          />
        </Svg>
      </View>

      {/* CONTENIDO */}
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.title}>Hola</Text>
        <Text style={styles.subtitle}>Inicia sesión en tu cuenta</Text>

        {/* INPUT EMAIL */}
        <View style={styles.inputContainer}>
          <User size={17} color="#C0C0C0" strokeWidth={2} />
          <TextInput
            style={styles.input}
            placeholder="Usuario o correo"
            placeholderTextColor="#C0C0C0"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {/* INPUT CONTRASEÑA */}
        <View style={styles.inputContainer}>
          <Lock size={17} color="#C0C0C0" strokeWidth={2} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#C0C0C0"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            {showPassword
              ? <Eye size={17} color="#C0C0C0" strokeWidth={2} />
              : <EyeOff size={17} color="#C0C0C0" strokeWidth={2} />
            }
          </TouchableOpacity>
        </View>

        {/* OLVIDASTE */}
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        {/* FILA INGRESAR */}
        <View style={styles.signInRow}>
          <Text style={styles.signInLabel}>Ingresar</Text>
          <PillButton
            onPress={handleLogin}
            disabled={loading}
            isLoading={loading}
            gradStart="#FF8C5A"
            gradEnd="#FF5722"
          />
        </View>

       {/* DIVIDER + GOOGLE */}
        <View style={styles.googleRow}>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>O continúa con</Text>
            <View style={styles.dividerLine} />
          </View>
          <TouchableOpacity
            style={styles.googleButton}
            activeOpacity={0.82}
            onPress={() => Alert.alert('Google', 'Función en desarrollo')}
          >
            <Svg width={20} height={20} viewBox="0 0 48 48">
              <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </Svg>
            <Text style={styles.googleButtonText}>Continuar con Google</Text>
          </TouchableOpacity>
        </View>

         {/* REGISTRO + VOLVER */}
        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.backCircle}
            onPress={() => navigation.goBack()}
            activeOpacity={0.82}
          >
            <Svg width={26} height={26} viewBox="0 0 28 28">
              <G stroke="#6B7280" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
                <Path d="M22 14 L6 14" />
                <Path d="M13 7 L6 14 L13 21" />
              </G>
            </Svg>
          </TouchableOpacity>
          <View style={styles.bottomTexts}>
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>¿No tienes cuenta? </Text>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Regístrate</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.backLabel}>Volver</Text>
          </View>
        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  blobTop: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 0,
  },
  blobBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 36,
    paddingTop: 100,
    paddingBottom: 90,
    zIndex: 1,
  },
  title: {
    fontSize: 46,
    fontFamily: 'Nunito_700Bold',
    color: '#1F2937',
    marginBottom: 4,
    letterSpacing: -1.5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#9CA3AF',
    marginBottom: 28,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 50,
    marginBottom: 14,
    paddingHorizontal: 20,
    paddingVertical: 4,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 0,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#1F2937',
    marginLeft: 10,
  },
  eyeButton: {
    padding: 5,
    marginLeft: 5,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 24,
    marginTop: 2,
  },
  forgotPasswordText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  signInLabel: {
    fontSize: 26,
    fontFamily: 'Nunito_700Bold',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  pillBtn: {
    width: BTN_W,
    height: BTN_H,
    borderRadius: BTN_R,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#FF6B47',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  googleRow: {
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 14,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 11,
    fontFamily: 'Nunito_400Regular',
    color: '#9CA3AF',
  },
 googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 50,
    paddingVertical: 13,
    paddingHorizontal: 24,
    backgroundColor: '#FAFAFA',
  },
    googleButtonText: {
      fontSize: 14,
      fontFamily: 'Nunito_700Bold',
      color: '#1F2937',
      letterSpacing: -0.2,
    },
    bottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
      backCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
    bottomTexts: {
      flex: 1,
      marginLeft: 16,
    },
    signupContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    signupText: {
      fontSize: 14,
      fontFamily: 'Nunito_400Regular',
      color: '#9CA3AF',
    },
    signupLink: {
      fontSize: 14,
      fontFamily: 'Nunito_700Bold',
      color: '#3B82F6',
    },
    backLabel: {
      fontSize: 12,
      fontFamily: 'Nunito_400Regular',
      color: '#6B7280',
    },
  });