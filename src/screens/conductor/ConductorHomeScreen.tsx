import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  PanResponder,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

const PERFIL_ID = "61607683-6e7b-4cde-b07a-96e16eadd7cf";

export default function ConductorHomeScreen() {
  const mapRef = useRef<MapView>(null);

  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [vehiculo, setVehiculo] = useState<any>(null);
  const [ubicacion, setUbicacion] = useState<any>(null);
  const [open, setOpen] = useState(true);

  const PANEL_HEIGHT = 420;
  const HANDLE_HEIGHT = 40;

  const OPEN = 0;
  const CLOSED = PANEL_HEIGHT - HANDLE_HEIGHT;

  const translateY = useRef(new Animated.Value(CLOSED)).current;
  const lastY = useRef(0);

  // UBICACIÓN
  useEffect(() => {
    (async () => {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      setUbicacion(loc.coords);

      mapRef.current?.animateToRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 3,
        },
        (loc) => {
          setUbicacion(loc.coords);
        }
      );
    })();
  }, []);

  // VEHICULOS
  useEffect(() => {
    cargarVehiculos();
  }, []);

  const cargarVehiculos = async () => {
    try {
      const res = await fetch(
        `https://apirecoleccion.gonzaloandreslucio.com/api/vehiculos?perfil_id=${PERFIL_ID}`
      );
      const json = await res.json();
      setVehiculos(json.data || []);
    } catch {
      console.log("Error cargando vehículos");
    }
  };

  const centrar = () => {
    if (!ubicacion) return;

    mapRef.current?.animateToRegion({
      latitude: ubicacion.latitude,
      longitude: ubicacion.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const toggleVehiculo = (item: any) => {
    if (vehiculo?.id === item.id) setVehiculo(null);
    else setVehiculo(item);
  };

  // ABRIR PANEL AL INICIO
  useEffect(() => {
    Animated.spring(translateY, {
      toValue: OPEN,
      useNativeDriver: true,
    }).start();
  }, []);

  // GESTO + PARALLAX
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        translateY.stopAnimation((value: number) => {
          lastY.current = value;
        });
      },

      onPanResponderMove: (_, gesture) => {
        let newY = lastY.current + gesture.dy;

        if (newY < OPEN) newY = OPEN;
        if (newY > CLOSED) newY = CLOSED;

        translateY.setValue(newY);

        // PARALLAX
        if (ubicacion) {
          const factor = newY / CLOSED;

          mapRef.current?.animateCamera(
            {
              center: {
                latitude: ubicacion.latitude + factor * 0.002,
                longitude: ubicacion.longitude,
              },
              zoom: 16 - factor * 1.5,
            },
            { duration: 0 }
          );
        }
      },

      onPanResponderRelease: (_, gesture) => {
        let final = OPEN;

        if (gesture.vy > 0.5 || gesture.dy > 60) {
          final = CLOSED;
        } else if (gesture.vy < -0.5 || gesture.dy < -60) {
          final = OPEN;
        } else {
          final = lastY.current > CLOSED / 2 ? CLOSED : OPEN;
        }

        setOpen(final === OPEN);

        Animated.spring(translateY, {
          toValue: final,
          useNativeDriver: true,
          tension: 90,
          friction: 12,
        }).start();
      },
    })
  ).current;

  return (
    <SafeAreaView style={styles.container}>
      <MapView ref={mapRef} style={styles.map}>
        {ubicacion && <Marker coordinate={ubicacion} />}
      </MapView>

      <TouchableOpacity style={styles.centerBtn} onPress={centrar}>
        <MaterialIcons name="my-location" size={22} color="#10B981" />
      </TouchableOpacity>

      <Animated.View
        style={[styles.panel, { transform: [{ translateY }] }]}
      >
        <View {...panResponder.panHandlers}>
          <View style={styles.handle} />
        </View>

        {open && (
          <>
            <Text style={styles.title}>Panel del conductor</Text>

            <Text style={styles.label}>Vehículo seleccionado</Text>
            <Text style={styles.value}>
              {vehiculo ? vehiculo.placa : "Ninguno"}
            </Text>

            <FlatList
              data={vehiculos}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const selected = vehiculo?.id === item.id;

                return (
                  <TouchableOpacity
                    style={[
                      styles.card,
                      selected && styles.cardActive,
                    ]}
                    onPress={() => toggleVehiculo(item)}
                  >
                    <View>
                      <Text style={styles.cardTitle}>
                        {item.placa}
                      </Text>
                      <Text style={styles.cardSub}>
                        {item.marca} - {item.modelo}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor: item.activo
                            ? "#10B981"
                            : "#EF4444",
                        },
                      ]}
                    />
                  </TouchableOpacity>
                );
              }}
            />

            {/* BOTÓN SOLO SI HAY VEHÍCULO */}
            {vehiculo && (
              <TouchableOpacity style={styles.startBtn}>
                <Text style={styles.startText}>
                  Iniciar recorrido
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  map: { flex: 1 },

  centerBtn: {
    position: "absolute",
    right: 20,
    bottom: 120,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },

  panel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 420,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    elevation: 12,
  },

  handle: {
    width: 60,
    height: 6,
    borderRadius: 6,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 10,
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#F9FAFB",
    padding: 15,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardActive: {
    borderWidth: 2,
    borderColor: "#10B981",
    backgroundColor: "#ECFDF5",
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
  },

  cardSub: {
    fontSize: 12,
    color: "#6B7280",
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  startBtn: {
    backgroundColor: "#10B981",
    padding: 15,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 10,
  },

  startText: {
    color: "#fff",
    fontWeight: "700",
  },
});