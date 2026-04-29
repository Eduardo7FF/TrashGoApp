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
import { useNavigation } from "@react-navigation/native";
import Svg, { Path, Circle } from "react-native-svg";
import { useDriver } from "../../navigation/DriverContext";

const PERFIL_ID = "61607683-6e7b-4cde-b07a-96e16eadd7cf";
const API = "https://apirecoleccion.gonzaloandreslucio.com/api";

function TruckIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M3 8c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v6h1.2c.3-1.2 1.4-2 2.8-2 1.4 0 2.5.8 2.8 2H21v-2.1c0-.5-.2-1-.5-1.3l-2-2.4c-.4-.5-.9-.7-1.5-.7H15V8H3z"
      />
      <Circle cx="7" cy="17" r="2" fill={color} />
      <Circle cx="18" cy="17" r="2" fill={color} />
    </Svg>
  );
}

export default function ConductorHomeScreen() {
  const navigation = useNavigation<any>();
  const mapRef = useRef<MapView>(null);

  const { vehiculo, setVehiculo } = useDriver();

  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [ubicacion, setUbicacion] = useState<any>(null);
  const [open, setOpen] = useState(true);

  const PANEL_HEIGHT = 420;
  const HANDLE_HEIGHT = 40;
  const OPEN = 0;
  const CLOSED = PANEL_HEIGHT - HANDLE_HEIGHT;

  const translateY = useRef(new Animated.Value(CLOSED)).current;
  const lastY = useRef(0);

  const animatedValues = useRef<{ [key: string]: Animated.Value }>({}).current;

  const getAnim = (id: string) => {
    if (!animatedValues[id]) {
      animatedValues[id] = new Animated.Value(1);
    }
    return animatedValues[id];
  };

  const colors = ["#10B981", "#3B82F6", "#F97316", "#8B5CF6"];
  const bgColors = ["#ECFDF5", "#EFF6FF", "#FFF7ED", "#F5F3FF"];

  useEffect(() => {
    obtenerUbicacion();
    cargarVehiculos();

    Animated.spring(translateY, {
      toValue: OPEN,
      useNativeDriver: true,
    }).start();
  }, []);

  const obtenerUbicacion = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const loc = await Location.getCurrentPositionAsync({});
    setUbicacion(loc.coords);

    mapRef.current?.animateToRegion({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });
  };

  const cargarVehiculos = async () => {
    try {
      const res = await fetch(`${API}/vehiculos?perfil_id=${PERFIL_ID}`);
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
      },

      onPanResponderRelease: (_, gesture) => {
        const final = gesture.dy > 50 ? CLOSED : OPEN;

        setOpen(final === OPEN);

        Animated.spring(translateY, {
          toValue: final,
          useNativeDriver: true,
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
        <MaterialIcons name="my-location" size={20} color="#10B981" />
      </TouchableOpacity>

      <Animated.View style={[styles.panel, { transform: [{ translateY }] }]}>
        <View {...panResponder.panHandlers}>
          <View style={styles.handle} />
        </View>

        {open && (
          <>
            <Text style={styles.title}>Selecciona vehículo</Text>

            <FlatList
              data={vehiculos}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => {
                const selected = vehiculo?.id === item.id;
                const anim = getAnim(item.id);

                return (
                  <Animated.View style={{ transform: [{ scale: anim }] }}>
                    <TouchableOpacity
                      style={[styles.card, selected && styles.cardActive]}
                      onPress={() => {
                        Animated.sequence([
                          Animated.timing(anim, {
                            toValue: 0.96,
                            duration: 80,
                            useNativeDriver: true,
                          }),
                          Animated.spring(anim, {
                            toValue: 1,
                            friction: 5,
                            useNativeDriver: true,
                          }),
                        ]).start();

                        if (selected) {
                          setVehiculo(null); // 🔥 DESELECCIONAR
                        } else {
                          setVehiculo(item);
                        }
                      }}
                    >
                      <View style={styles.left}>
                        <View
                          style={[
                            styles.iconWrap,
                            { backgroundColor: bgColors[index % 4] },
                          ]}
                        >
                          <TruckIcon color={colors[index % 4]} />
                        </View>

                        <View>
                          <Text style={styles.cardTitle}>{item.placa}</Text>
                          <Text style={styles.cardSub}>
                            {item.marca} - {item.modelo}
                          </Text>
                        </View>
                      </View>

                      {selected && <View style={styles.dot} />}
                    </TouchableOpacity>
                  </Animated.View>
                );
              }}
            />

            {vehiculo && (
              <TouchableOpacity
                style={styles.startBtn}
                onPress={() => navigation.navigate("Recorrido")}
              >
                <Text style={styles.startText}>Continuar a recorrido</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  map: { flex: 1 },

  centerBtn: {
    position: "absolute",
    right: 18,
    bottom: 120,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  panel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 420,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 14,
  },

  handle: {
    width: 46,
    height: 4,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#F9FAFB",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,

    borderWidth: 1,
    borderColor: "#F3F4F6", // 🔥 leve separación visual
  },

  cardActive: {
    backgroundColor: "#F0FDF4",
    borderLeftWidth: 3,
    borderLeftColor: "#10B981",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },

  cardSub: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#10B981",
  },

  startBtn: {
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 12,
  },

  startText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});