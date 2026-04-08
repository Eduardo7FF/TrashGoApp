import React, { useEffect, useState } from 'react';
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

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    cargarUsuario();
  }, []);

  const cargarUsuario = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('Usuarios')
        .select('*')
        .eq('id', user.id)
        .single();
      setUsuario(data);
    }
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

  // Logros mock (visuales)
  const logros = [
    { id: 1, emoji: '♻️', titulo: 'Primer reciclaje', obtenido: true },
    { id: 2, emoji: '🌱', titulo: 'Eco iniciante', obtenido: true },
    { id: 3, emoji: '🏆', titulo: 'Pro del reciclaje', obtenido: false },
    { id: 4, emoji: '🌍', titulo: 'Guardián del planeta', obtenido: false },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {usuario?.nombre_completo?.charAt(0).toUpperCase() ?? '?'}
          </Text>
        </View>
        <Text style={styles.nombre}>{usuario?.nombre_completo ?? 'Cargando...'}</Text>
        <Text style={styles.correo}>{usuario?.Correo_electronico ?? ''}</Text>
      </View>

      {/* Estadísticas */}
      <Text style={styles.seccion}>Mis estadísticas</Text>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumero}>34</Text>
          <Text style={styles.statLabel}>Ítems</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumero}>12.5</Text>
          <Text style={styles.statLabel}>CO₂ (kg)</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumero}>150</Text>
          <Text style={styles.statLabel}>Puntos</Text>
        </View>
      </View>

      {/* Logros */}
      <Text style={styles.seccion}>Mis logros</Text>
      <View style={styles.logrosGrid}>
        {logros.map((logro) => (
          <View
            key={logro.id}
            style={[styles.logroCard, !logro.obtenido && styles.logroLocked]}
          >
            <Text style={styles.logroEmoji}>{logro.emoji}</Text>
            <Text style={styles.logroTitulo}>{logro.titulo}</Text>
            {!logro.obtenido && <Text style={styles.logroPendiente}>🔒</Text>}
          </View>
        ))}
      </View>

      {/* Botón cerrar sesión */}
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
    marginBottom: 30,
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
  nombre: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  correo: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  seccion: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
    marginTop: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 3,
  },
  statNumero: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  logrosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  logroCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
  },
  logroLocked: {
    opacity: 0.4,
  },
  logroEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  logroTitulo: {
    fontSize: 13,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  logroPendiente: {
    fontSize: 16,
    marginTop: 4,
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