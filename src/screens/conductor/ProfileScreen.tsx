import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Svg, { Path, Circle } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../config/supabase";
import { useDriver } from "../../navigation/DriverContext";

/* ---------- ICONOS ---------- */

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

function RouteIcon({
  color,
  size = 16,
}: {
  color: string;
  size?: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
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

/* ---------- SCREEN ---------- */

export default function ProfileScreen() {
  const navigation = useNavigation<any>();

  const {
    vehiculo,
    ruta,
    recorridoActivo,
    horaInicio,
  } = useDriver();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [closing, setClosing] = useState(false);
  const [onlineTime, setOnlineTime] = useState("00h 00m 00s");

  const loginTime = useRef(new Date()).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    cargarUsuario();

    const timer = setInterval(() => {
      actualizarTiempo();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const cargarUsuario = async () => {
    const { data } = await supabase.auth.getUser();

    if (data?.user) {
      setUserData(data.user);
    }

    setLoading(false);
  };

  const actualizarTiempo = () => {
    const now = new Date();

    const diff = Math.floor(
      (now.getTime() - loginTime.getTime()) / 1000
    );

    const h = String(Math.floor(diff / 3600)).padStart(2, "0");
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
    const s = String(diff % 60).padStart(2, "0");

    setOnlineTime(`${h}h ${m}m ${s}s`);
  };

  const cerrarSesion = async () => {
    if (closing) return;

    setClosing(true);

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start(async () => {
      await supabase.auth.signOut();

      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      });
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator
          size="large"
          color="#111827"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userData?.email
                ?.substring(0, 2)
                .toUpperCase()}
            </Text>
          </View>

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.name}>
              Conductor
            </Text>

            <Text style={styles.email}>
              {userData?.email}
            </Text>

            <View style={styles.badge}>
              <View style={styles.dot} />
              <Text style={styles.badgeText}>
                {onlineTime}
              </Text>
            </View>
          </View>
        </View>

        {/* CARDS INDIVIDUALES */}

        <Row
          icon="mail"
          label="Correo"
          value={userData?.email}
        />

        <Row
          icon="shield"
          label="Rol"
          value="Conductor"
        />

        <Row
          customIcon={
            <TruckIcon color="#F97316" />
          }
          label="Vehículo"
          value={
            vehiculo?.placa ||
            "No seleccionado"
          }
        />

        <Row
          customIcon={
            <RouteIcon color="#3B82F6" />
          }
          label="Ruta"
          value={
            ruta?.nombre_ruta ||
            "No seleccionada"
          }
        />

        <Row
          icon="activity"
          label="Estado"
          value={
            recorridoActivo
              ? "En recorrido"
              : "Inactivo"
          }
        />

        <Row
          icon="clock"
          label="Inicio"
          value={horaInicio || "--:--:--"}
        />

        {/* RESUMEN */}

        <View style={styles.statsRow}>
          <Box
            title="Estado"
            value={
              recorridoActivo
                ? "Activo"
                : "Libre"
            }
          />

          <Box
            title="Vehículo"
            value={
              vehiculo
                ? "Asignado"
                : "Ninguno"
            }
          />
        </View>

        {/* LOGOUT */}

        <Animated.View
          style={{
            transform: [{ scale }],
          }}
        >
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={cerrarSesion}
          >
            {closing ? (
              <ActivityIndicator
                size="small"
                color="#FFF"
              />
            ) : (
              <>
                <Feather
                  name="log-out"
                  size={14}
                  color="#FFF"
                />

                <Text style={styles.logoutText}>
                  Cerrar sesión
                </Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- COMPONENTE ROW ---------- */

function Row({
  icon,
  label,
  value,
  customIcon,
}: any) {
  const colorMap: any = {
    mail: "#10B981",
    shield: "#3B82F6",
    activity: "#10B981",
    clock: "#8B5CF6",
  };

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        {customIcon ? (
          customIcon
        ) : (
          <Feather
            name={icon}
            size={14}
            color={
              colorMap[icon] || "#6B7280"
            }
          />
        )}
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>
          {label}
        </Text>

        <Text style={styles.rowValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

/* ---------- COMPONENTE BOX ---------- */

function Box({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <View style={styles.box}>
      <Text style={styles.boxTitle}>
        {title}
      </Text>

      <Text style={styles.boxValue}>
        {value}
      </Text>
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  email: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
    marginRight: 6,
  },

  badgeText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  rowLabel: {
    fontSize: 11,
    color: "#9CA3AF",
  },

  rowValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111827",
    marginTop: 2,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 4,
    marginBottom: 18,
  },

  box: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  boxTitle: {
    fontSize: 11,
    color: "#9CA3AF",
  },

  boxValue: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  logoutBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#111827",
    paddingHorizontal: 16,
    height: 42,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  logoutText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
});