import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

export default function ConductorHomeScreen({ route }: any) {
  const { nombre } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.role}>Rol: Conductor</Text>
        <Text style={styles.name}>{nombre}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  role: {
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Nunito_400Regular',
    color: COLORS.text,
  },
});