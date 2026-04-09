import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { COLORS } from '../../constants/theme';
import { supabase } from '../../config/supabase';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, G, Circle } from 'react-native-svg';

export default function ConductorHomeScreen({ route }: any) {
  const { nombre } = route.params;
  const navigation = useNavigation<any>();
  const [rutaIniciada, setRutaIniciada] = useState(false);
  const [rutaFinalizada, setRutaFinalizada] = useState(false);

  // Puntos de recolección mock
  const puntos = [
    { id: 1, direccion: 'Calle 45 #12-30', estado: 'completado' },
    { id: 2, direccion: 'Carrera 7 #23-15', estado: 'completado' },
    { id: 3, direccion: 'Av. Principal #89-10', estado: 'pendiente' },
    { id: 4, direccion: 'Calle 12 #34-56', estado: 'pendiente' },
    { id: 5, direccion: 'Carrera 15 #67-89', estado: 'pendiente' },
  ];

  const handleIniciarRuta = () => {
    Alert.alert('Iniciar ruta', '¿Estás listo para iniciar la ruta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Iniciar',
        onPress: () => setRutaIniciada(true),
      },
    ]);
  };

  const handleFinalizarRuta = () => {
    Alert.alert('Finalizar ruta', '¿Deseas finalizar la ruta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Finalizar',
        onPress: () => {
          setRutaFinalizada(true);
          setRutaIniciada(false);
        },
      },
    ]);
  };

  const cerrarSesion = async () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sí, salir',
        onPress: async () => {
          await supabase.auth.signOut();
          navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>

      {/* SALUDO */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {nombre?.charAt(0).toUpperCase() ?? '?'}
          </Text>
        </View>
        <Text style={styles.saludo}>Hola,</Text>
        <Text style={styles.nombre}>{nombre}</Text>
        <Text style={styles.rol}>Conductor</Text>
      </View>

      {/* ESTADO DE RUTA */}
      <View style={styles.estadoCard}>
        <View style={styles.estadoFila}>
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <G stroke={COLORS.primary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M1 3h15v13H1z" />
              <Path d="M16 8h4l3 3v5h-7V8z" />
              <Path d="M5.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
              <Path d="M18.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
            </G>
          </Svg>
          <View style={styles.estadoTexto}>
            <Text style={styles.estadoTitulo}>Ruta del día</Text>
            <Text style={styles.estadoSubtitulo}>
              {rutaFinalizada
                ? 'Ruta finalizada ✓'
                : rutaIniciada
                ? 'En progreso...'
                : 'Sin iniciar'}
            </Text>
          </View>
          <View style={[
            styles.estadoBadge,
            rutaFinalizada
              ? styles.badgeVerde
              : rutaIniciada
              ? styles.badgeAmarillo
              : styles.badgeGris
          ]}>
            <Text style={styles.estadoBadgeTexto}>
              {rutaFinalizada ? 'Finalizada' : rutaIniciada ? 'Activa' : 'Pendiente'}
            </Text>
          </View>
        </View>
      </View>

      {/* MAPA PLACEHOLDER */}
      <Text style={styles.seccionTitulo}>Mapa de ruta</Text>
      <View style={styles.mapaPlaceholder}>
        <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
          <G stroke="#9CA3AF" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <Circle cx="12" cy="9" r="2.5" />
          </G>
        </Svg>
        <Text style={styles.mapaTexto}>Mapa en construcción</Text>
        <Text style={styles.mapaSubtexto}>GPS disponible próximamente</Text>
      </View>

      {/* PUNTOS DE RECOLECCION */}
      <Text style={styles.seccionTitulo}>Puntos de recolección</Text>
      <View style={styles.puntosContainer}>
        {puntos.map((punto) => (
          <View key={punto.id} style={styles.puntoFila}>
            <View style={[
              styles.puntoDot,
              punto.estado === 'completado' ? styles.dotVerde : styles.dotGris
            ]} />
            <Text style={styles.puntoDireccion}>{punto.direccion}</Text>
            <Text style={[
              styles.puntoEstado,
              punto.estado === 'completado' ? styles.textoVerde : styles.textoGris
            ]}>
              {punto.estado === 'completado' ? '✓' : '•••'}
            </Text>
          </View>
        ))}
      </View>

      {/* BOTONES */}
      <View style={styles.botonesRow}>
        {!rutaIniciada && !rutaFinalizada && (
          <TouchableOpacity style={styles.botonIniciar} onPress={handleIniciarRuta}>
            <Text style={styles.botonTexto}>Iniciar ruta</Text>
          </TouchableOpacity>
        )}
        {rutaIniciada && !rutaFinalizada && (
          <TouchableOpacity style={styles.botonFinalizar} onPress={handleFinalizarRuta}>
            <Text style={styles.botonTexto}>Finalizar ruta</Text>
          </TouchableOpacity>
        )}
        {rutaFinalizada && (
          <View style={styles.botonCompletado}>
            <Text style={styles.botonTexto}>Ruta completada ✓</Text>
          </View>
        )}
      </View>

      {/* CERRAR SESION */}
      <TouchableOpacity style={styles.botonSalir} onPress={cerrarSesion}>
        <Text style={styles.botonSalirTexto}>Cerrar sesión</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  saludo: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  rol: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  estadoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
  },
  estadoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  estadoTexto: {
    flex: 1,
  },
  estadoTitulo: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  estadoSubtitulo: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeVerde: {
    backgroundColor: '#D1FAE5',
  },
  badgeAmarillo: {
    backgroundColor: '#FEF3C7',
  },
  badgeGris: {
    backgroundColor: '#F3F4F6',
  },
  estadoBadgeTexto: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text,
  },
  seccionTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  mapaPlaceholder: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
  },
  mapaTexto: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 10,
  },
  mapaSubtexto: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  puntosContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
  },
  puntoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  puntoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  dotVerde: {
    backgroundColor: '#10B981',
  },
  dotGris: {
    backgroundColor: '#D1D5DB',
  },
  puntoDireccion: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  puntoEstado: {
    fontSize: 14,
    fontWeight: '600',
  },
  textoVerde: {
    color: '#10B981',
  },
  textoGris: {
    color: '#9CA3AF',
  },
  botonesRow: {
    marginBottom: 16,
  },
  botonIniciar: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  botonFinalizar: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  botonCompletado: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botonSalir: {
    backgroundColor: '#FF4D4D',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  botonSalirTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});