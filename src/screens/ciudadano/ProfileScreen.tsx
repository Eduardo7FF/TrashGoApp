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
import Svg, { Path, G } from 'react-native-svg';

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

  const opciones = [
    {
      id: 1,
      titulo: 'Seguimiento de recolección',
      subtitulo: 'Frecuencia, zona y última recolección',
      icono: (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <G stroke={COLORS.primary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
            <Path d="M10 11v6M14 11v6" />
          </G>
        </Svg>
      ),
    },
    {
      id: 2,
      titulo: 'Notificaciones',
      subtitulo: 'Alertas y avisos de recolección',
      icono: (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <G stroke={COLORS.primary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </G>
        </Svg>
      ),
    },
    {
      id: 3,
      titulo: 'Comentarios y reportes',
      subtitulo: 'Envía sugerencias o reporta problemas',
      icono: (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <G stroke={COLORS.primary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </G>
        </Svg>
      ),
    },
  ];

  return (
    <ScrollView style={styles.container}>

      {/* SALUDO */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {usuario?.nombre_completo?.charAt(0).toUpperCase() ?? '?'}
          </Text>
        </View>
        <Text style={styles.saludo}>Hola,</Text>
        <Text style={styles.nombre}>{usuario?.nombre_completo ?? 'Cargando...'}</Text>
        <Text style={styles.correo}>{usuario?.email ?? ''}</Text>
      </View>

      {/* DATOS PERSONALES */}
      <Text style={styles.seccionTitulo}>Datos personales</Text>
      <View style={styles.datosCard}>
        <View style={styles.datoFila}>
          <Text style={styles.datoLabel}>Nombre</Text>
          <Text style={styles.datoValor}>{usuario?.nombre_completo ?? '-'}</Text>
        </View>
        <View style={styles.separador} />
        <View style={styles.datoFila}>
          <Text style={styles.datoLabel}>Correo</Text>
          <Text style={styles.datoValor}>{usuario?.email ?? '-'}</Text>
        </View>
        <View style={styles.separador} />
        <View style={styles.datoFila}>
          <Text style={styles.datoLabel}>Teléfono</Text>
          <Text style={styles.datoValor}>{usuario?.teléfono ?? '-'}</Text>
        </View>
        <View style={styles.separador} />
        <View style={styles.datoFila}>
          <Text style={styles.datoLabel}>Zona</Text>
          <Text style={styles.datoValor}>{usuario?.Zona ?? '-'}</Text>
        </View>
      </View>

      {/* ESTADISTICAS */}
      <Text style={styles.seccionTitulo}>Estadísticas de recolección</Text>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumero}>12</Text>
          <Text style={styles.statLabel}>Recolecciones</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumero}>3</Text>
          <Text style={styles.statLabel}>Reportes enviados</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumero}>2</Text>
          <Text style={styles.statLabel}>Reportes atendidos</Text>
        </View>
      </View>

      {/* OPCIONES */}
      <Text style={styles.seccionTitulo}>Opciones</Text>
      <View style={styles.seccionContainer}>
        {opciones.map((op) => (
          <TouchableOpacity key={op.id} style={styles.opcionCard}>
            <View style={styles.opcionIcono}>{op.icono}</View>
            <View style={styles.opcionTexto}>
              <Text style={styles.opcionTitulo}>{op.titulo}</Text>
              <Text style={styles.opcionSubtitulo}>{op.subtitulo}</Text>
            </View>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <G stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M9 18l6-6-6-6" />
              </G>
            </Svg>
          </TouchableOpacity>
        ))}
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
  correo: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  seccionTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
    marginTop: 8,
  },
  datosCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
  },
  datoFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  datoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  datoValor: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  separador: {
    height: 0.5,
    backgroundColor: '#E5E7EB',
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
    padding: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
  },
  statNumero: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  seccionContainer: {
    marginBottom: 24,
  },
  opcionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  opcionIcono: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  opcionTexto: {
    flex: 1,
  },
  opcionTitulo: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  opcionSubtitulo: {
    fontSize: 12,
    color: COLORS.textSecondary,
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