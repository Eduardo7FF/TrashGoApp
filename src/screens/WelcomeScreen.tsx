import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';

import Svg, { Path, Defs, LinearGradient, Stop, Rect, G } from 'react-native-svg';

import {
  useFonts,
  Nunito_400Regular,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';

import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const BTN_W = 90;
const BTN_H = 42;
const BTN_R = 21;

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>

      {/* BLOB ARRIBA */}
      <View style={styles.blobTop}>
        <Svg width={width} height={140} viewBox={`0 0 ${width} 140`}>
          <Defs>
            <LinearGradient id="gradTop" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#FFD93D" />
              <Stop offset="0.5" stopColor="#A8E063" />
              <Stop offset="1" stopColor="#10B981" />
            </LinearGradient>
          </Defs>
          <Path
            d={`M0,0 L${width},0 L${width},90 
            Q${width * 0.82},140 ${width * 0.6},100 
            Q${width * 0.35},60 ${width * 0.15},110 
            Q${width * 0.05},130 0,105 Z`}
            fill="url(#gradTop)"
          />
        </Svg>
      </View>

      {/* BLOB ABAJO */}
      <View style={styles.blobBottom}>
        <Svg width={width} height={140} viewBox={`0 0 ${width} 140`}>
          <Defs>
            <LinearGradient id="gradBottom" x1="0" y1="1" x2="1" y2="0">
              <Stop offset="0" stopColor="#FF6B47" />
              <Stop offset="0.5" stopColor="#FF8E6E" />
              <Stop offset="1" stopColor="#FFB347" />
            </LinearGradient>
          </Defs>
          <Path
            d={`M0,140 L${width},140 L${width},50 
            Q${width * 0.78},0 ${width * 0.55},55 
            Q${width * 0.35},100 ${width * 0.18},45 
            Q${width * 0.08},10 0,50 Z`}
            fill="url(#gradBottom)"
          />
        </Svg>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.bienvenido}>¡Bienvenido a</Text>
          <Text style={styles.title}>TrashGo</Text>

          <Text style={styles.subtitle}>
            Gestión inteligente de residuos urbanos
          </Text>

          {/* BOTON VER RUTAS */}
          <View style={styles.signInRow}>
            <Text style={styles.signInLabel}>Ver rutas</Text>

            <TouchableOpacity
              style={styles.pillBtn}
              onPress={() => navigation.navigate('CiudadanoHome')}
              activeOpacity={0.85}
            >
              <Svg
                width={BTN_W}
                height={BTN_H}
                viewBox={`0 0 ${BTN_W} ${BTN_H}`}
                style={StyleSheet.absoluteFill}
              >
                <Defs>
                  <LinearGradient id="pill" x1="0" y1="0.5" x2="1" y2="0.5">
                    <Stop offset="0" stopColor="#FF8C5A" />
                    <Stop offset="1" stopColor="#FF5722" />
                  </LinearGradient>
                </Defs>
                <Rect x="0" y="0" width={BTN_W} height={BTN_H} rx={BTN_R} fill="url(#pill)" />
              </Svg>

              <Svg width={28} height={28} viewBox="0 0 28 28">
                <G stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none">
                  <Path d="M6 14 L22 14" />
                  <Path d="M15 7 L22 14 L15 21" />
                </G>
              </Svg>
            </TouchableOpacity>
          </View>

          {/* LOGIN */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText}>Iniciar sesión</Text>
          </TouchableOpacity>

          {/* ROLES */}
          <View style={styles.rolesRow}>

            {/* Conductor */}
            <View style={styles.rolItem}>
              <View style={styles.rolIconCircle}>
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <G stroke="#FF5722" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M1 3h15v13H1z" />
                    <Path d="M16 8h4l3 3v5h-7V8z" />
                    <Path d="M5.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                    <Path d="M18.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                  </G>
                </Svg>
              </View>
              <Text style={styles.rolLabel}>Conductor</Text>
            </View>

            {/* Administrador */}
            <View style={styles.rolItem}>
              <View style={styles.rolIconCircle}>
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <G stroke="#10B981" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </G>
                </Svg>
              </View>
              <Text style={styles.rolLabel}>Administrador</Text>
            </View>

            {/* Ciudadano */}
            <View style={styles.rolItem}>
              <View style={styles.rolIconCircle}>
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <G stroke="#FFD93D" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <Path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                  </G>
                </Svg>
              </View>
              <Text style={styles.rolLabel}>Ciudadano</Text>
            </View>

          </View>

        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  blobTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  blobBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 36,
    paddingTop: 150,
    paddingBottom: 150,
  },
  bienvenido: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    color: '#9CA3AF',
    marginBottom: 2,
  },
  title: {
    fontSize: 52,
    fontFamily: 'Nunito_700Bold',
    color: '#1F2937',
    marginBottom: 6,
    letterSpacing: -1.5,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    color: '#9CA3AF',
    marginBottom: 40,
  },
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  signInLabel: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    color: '#1F2937',
  },
  pillBtn: {
    width: BTN_W,
    height: BTN_H,
    borderRadius: BTN_R,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  loginButton: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  loginText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: '#1F2937',
    textDecorationLine: 'underline',
  },
  rolesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  rolItem: {
    alignItems: 'center',
  },
  rolIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F9F9F9',
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  rolLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontFamily: 'Nunito_400Regular',
  },
});