import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
} from "react-native";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Circle } from "react-native-svg";
import { Feather } from "@expo/vector-icons";
import { useDriver } from "../../navigation/DriverContext";
import Toast from "react-native-toast-message";

const PERFIL_ID = "61607683-6e7b-4cde-b07a-96e16eadd7cf";
const API = "https://apirecoleccion.gonzaloandreslucio.com/api";

/* ---------- ICONOS ---------- */

function RouteIcon({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Circle cx="6" cy="18" r="2" fill={color} />
      <Circle cx="18" cy="6" r="2" fill={color} />
      <Path
        d="M8 18C14 18 10 6 16 6"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function TruckIcon({
  color,
  size = 16,
}: {
  color: string;
  size?: number;
}) {
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

export default function RecorridoScreen() {
  const [rutas, setRutas] = useState<any[]>([]);
  const locationSub = useRef<any>(null);

  const animatedValues = useRef<{
    [key: string]: Animated.Value;
  }>({}).current;

  const getAnim = (id: string) => {
    if (!animatedValues[id]) {
      animatedValues[id] = new Animated.Value(1);
    }
    return animatedValues[id];
  };

  const {
    vehiculo,
    ruta,
    setRuta,
    recorridoActivo,
    setRecorridoActivo,
    recorridoId,
    setRecorridoId,
    horaInicio,
    setHoraInicio,
    horaFin,
    setHoraFin,
  } = useDriver();

  useEffect(() => {
    cargarRutas();
  }, []);

  const horaActual = () => {
    const d = new Date();

    return `${d
      .getHours()
      .toString()
      .padStart(2, "0")}:${d
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${d
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
  };

  const cargarRutas = async () => {
    try {
      const res = await fetch(
        `${API}/rutas?perfil_id=${PERFIL_ID}`
      );

      const json = await res.json();
      setRutas(json.data || []);
    } catch {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudieron cargar rutas",
        position: "top",
        visibilityTime: 2000,
      });
    }
  };

  const iniciarRecorrido = async () => {
    if (!vehiculo || !ruta) {
      Toast.show({
        type: "error",
        text1: "Faltan datos",
        text2: "Selecciona vehículo y ruta",
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }

    const rutaId = ruta.id || ruta.ruta_id;
    const vehiculoId =
      vehiculo.id || vehiculo.vehiculo_id;

    try {
      const res = await fetch(
        `${API}/recorridos/iniciar`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ruta_id: rutaId,
            vehiculo_id: vehiculoId,
            perfil_id: PERFIL_ID,
          }),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json?.message ||
            "No se pudo iniciar"
        );
      }

      const id =
        json?.data?.id || json?.id;

      setRecorridoId(id);
      setRecorridoActivo(true);
      setHoraInicio(horaActual());
      setHoraFin(null);

      iniciarTracking(id);

      Toast.show({
        type: "success",
        text1: "Recorrido iniciado",
        text2: "GPS activo",
        position: "top",
        visibilityTime: 2000,
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
        position: "top",
        visibilityTime: 2000,
      });
    }
  };

  const iniciarTracking = async (
    id: string
  ) => {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permiso requerido",
        text2: "Activa la ubicación",
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }

    locationSub.current =
      await Location.watchPositionAsync(
        {
          accuracy:
            Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 3,
        },
        async (loc) => {
          await enviarPosicion(
            id,
            loc.coords.latitude,
            loc.coords.longitude
          );
        }
      );
  };

  const enviarPosicion = async (
    id: string,
    lat: number,
    lon: number
  ) => {
    try {
      await fetch(
        `${API}/recorridos/${id}/posiciones`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            lat,
            lon,
            perfil_id: PERFIL_ID,
          }),
        }
      );
    } catch {
      console.log(
        "Error enviando posición"
      );
    }
  };

  const finalizarRecorrido = async () => {
    if (!recorridoId) return;

    try {
      if (locationSub.current) {
        locationSub.current.remove();
      }

      const res = await fetch(
        `${API}/recorridos/${recorridoId}/finalizar`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            perfil_id: PERFIL_ID,
          }),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json?.message ||
            "No se pudo finalizar"
        );
      }

      setRecorridoActivo(false);
      setRecorridoId(null);
      setHoraFin(horaActual());

      Toast.show({
        type: "success",
        text1: "Recorrido finalizado",
        position: "top",
        visibilityTime: 2000,
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
        position: "top",
        visibilityTime: 2000,
      });
    }
  };

  const toggleRecorrido = () => {
    recorridoActivo
      ? finalizarRecorrido()
      : iniciarRecorrido();
  };

  const colors = [
    "#10B981",
    "#8B5CF6",
    "#F97316",
    "#3B82F6",
  ];

  const bgColors = [
    "#ECFDF5",
    "#F3E8FF",
    "#FFF7ED",
    "#EFF6FF",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>
          Recorrido
        </Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <View style={styles.infoTop}>
              <View
                style={[
                  styles.smallIcon,
                  {
                    backgroundColor:
                      "#FFF7ED",
                  },
                ]}
              >
                <TruckIcon
                  color="#F97316"
                />
              </View>

              <Text style={styles.label}>
                Vehículo
              </Text>
            </View>

            <Text style={styles.value}>
              {vehiculo?.placa || "--"}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoTop}>
              <View
                style={[
                  styles.smallIcon,
                  {
                    backgroundColor:
                      "#EFF6FF",
                  },
                ]}
              >
                <RouteIcon
                  color="#3B82F6"
                />
              </View>

              <Text style={styles.label}>
                Ruta
              </Text>
            </View>

            <Text style={styles.value}>
              {ruta?.nombre_ruta ||
                "--"}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoTop}>
              <View
                style={[
                  styles.smallIcon,
                  {
                    backgroundColor:
                      "#ECFDF5",
                  },
                ]}
              >
                <Feather
                  name="activity"
                  size={14}
                  color="#10B981"
                />
              </View>

              <Text style={styles.label}>
                Estado
              </Text>
            </View>

            <Text
              style={[
                styles.value,
                {
                  color:
                    recorridoActivo
                      ? "#10B981"
                      : "#9CA3AF",
                },
              ]}
            >
              {recorridoActivo
                ? "Activo"
                : "Pendiente"}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoTop}>
              <View
                style={[
                  styles.smallIcon,
                  {
                    backgroundColor:
                      "#F5F3FF",
                  },
                ]}
              >
                <Feather
                  name="clock"
                  size={14}
                  color="#8B5CF6"
                />
              </View>

              <Text style={styles.label}>
                Inicio
              </Text>
            </View>

            <Text style={styles.value}>
              {horaInicio ||
                "--:--:--"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.timeCard}>
        <Text style={styles.time}>
          Fin: {horaFin || "--:--:--"}
        </Text>
      </View>

      <FlatList
        data={rutas}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({
          item,
          index,
        }) => {
          const selected =
            ruta?.id === item.id;

          return (
            <Animated.View
              style={{
                transform: [
                  {
                    scale: getAnim(
                      item.id
                    ),
                  },
                ],
                opacity: selected
                  ? 1
                  : 0.8,
              }}
            >
              <TouchableOpacity
                style={[
                  styles.card,
                  selected &&
                    styles.cardActive,
                ]}
                onPress={() => {
                  const anim =
                    getAnim(item.id);

                  Animated.sequence([
                    Animated.timing(
                      anim,
                      {
                        toValue: 0.95,
                        duration: 90,
                        useNativeDriver: true,
                      }
                    ),
                    Animated.spring(
                      anim,
                      {
                        toValue: 1,
                        friction: 4,
                        useNativeDriver: true,
                      }
                    ),
                  ]).start();

                  setRuta(item);
                }}
              >
                <View
                  style={[
                    styles.icon,
                    {
                      backgroundColor:
                        bgColors[
                          index % 4
                        ],
                    },
                  ]}
                >
                  <RouteIcon
                    color={
                      colors[
                        index % 4
                      ]
                    }
                  />
                </View>

                <View
                  style={{ flex: 1 }}
                >
                  <Text
                    style={styles.name}
                  >
                    {
                      item.nombre_ruta
                    }
                  </Text>

                  <Text
                    style={styles.sub}
                  >
                    Ruta disponible
                  </Text>
                </View>

                {selected && (
                  <View
                    style={styles.dot}
                  />
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        }}
      />

      <TouchableOpacity
        style={[
          styles.btn,
          recorridoActivo &&
            styles.btnStop,
        ]}
        onPress={toggleRecorrido}
      >
        <Text style={styles.btnText}>
          {recorridoActivo
            ? "Finalizar recorrido"
            : "Iniciar recorrido"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
  },

  /* ================= HEADER ================= */

  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },

  title: {
    fontSize: 19,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },

  /* ================= INFO GRID ================= */

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },

  infoItem: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 8,
  },

  infoTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  smallIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  label: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginTop: 3,
  },

  /* ================= TIME ================= */

  timeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },

  time: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },

  /* ================= RUTAS ================= */

  card: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },

  cardActive: {
    backgroundColor: "#F0FDF4",
    borderLeftWidth: 3,
    borderLeftColor: "#10B981",
    borderColor: "#D1FAE5",
  },

  icon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  sub: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },

  /* ================= BOTÓN ================= */

 btn: {
  backgroundColor: "#111827",
  paddingVertical: 16,
  borderRadius: 18,
  alignItems: "center",

  // 🔥 pegado abajo
  position: "absolute",
  bottom: 20,
  left: 16,
  right: 16,
},

btnStop: {
  backgroundColor: "#EF4444",
},

btnText: {
  color: "#FFFFFF",
  fontWeight: "600",
  fontSize: 15,
},
});