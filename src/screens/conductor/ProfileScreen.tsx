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
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../config/supabase";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [onlineTime, setOnlineTime] = useState("00h 00m 00s");
  const [closing, setClosing] = useState(false);

  const loginTime = useRef(new Date()).current;
  const btnScale = useRef(new Animated.Value(1)).current;

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

    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;

    const hh = String(h).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    const ss = String(s).padStart(2, "0");

    setOnlineTime(`${hh}h ${mm}m ${ss}s`);
  };

  const cerrarSesion = async () => {
    if (closing) return;

    setClosing(true);

    Animated.sequence([
      Animated.timing(btnScale, {
        toValue: 0.94,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(btnScale, {
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

  const initials = () => {
    if (!userData?.email) return "U";
    return userData.email.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" color="#10B981" />
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
              {initials()}
            </Text>
          </View>

          <Text style={styles.name}>
            {userData?.email?.split("@")[0]}
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

        {/* CUENTA */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cuenta</Text>

          <Row
            icon="mail"
            text={userData?.email}
          />

          <Row
            icon="shield"
            text="Conductor"
          />

          <Row
            icon="hash"
            text={userData?.id?.slice(0, 12)}
          />
        </View>

        {/* ACTIVIDAD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Actividad
          </Text>

          <View style={styles.stats}>
            <Stat
              value="0"
              label="Recorridos"
            />

            <Stat
              value={onlineTime.split(" ")[1]}
              label="Online"
            />
          </View>
        </View>

        {/* VEHICULO */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Vehículo
          </Text>

          <View style={styles.row}>
            <View style={styles.iconCircle}>
              <MaterialIcons
                name="local-shipping"
                size={16}
                color="#10B981"
              />
            </View>

            <Text style={styles.rowText}>
              No seleccionado
            </Text>
          </View>
        </View>

        {/* LOGOUT */}
        <Animated.View
          style={{
            transform: [{ scale: btnScale }],
          }}
        >
          <TouchableOpacity
            style={styles.logoutBtn}
            activeOpacity={0.9}
            onPress={cerrarSesion}
          >
            {closing ? (
              <ActivityIndicator color="#EF4444" />
            ) : (
              <>
                <Feather
                  name="log-out"
                  size={18}
                  color="#EF4444"
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

function Row({
  icon,
  text,
}: {
  icon: any;
  text: string;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.iconCircle}>
        <Feather
          name={icon}
          size={15}
          color="#10B981"
        />
      </View>

      <Text style={styles.rowText}>
        {text}
      </Text>
    </View>
  );
}

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>
        {value}
      </Text>
      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: 28,
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },

  avatarText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "700",
  },

  name: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textTransform: "capitalize",
  },

  email: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },

  badge: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 30,
    backgroundColor: "#ECFDF5",
    flexDirection: "row",
    alignItems: "center",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
    marginRight: 8,
  },

  badgeText: {
    color: "#065F46",
    fontWeight: "600",
    fontSize: 12,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    elevation: 2,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 14,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
  },

  rowText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },

  stats: {
    flexDirection: "row",
    gap: 12,
  },

  statBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
  },

  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  statLabel: {
    marginTop: 6,
    fontSize: 12,
    color: "#6B7280",
  },

  logoutBtn: {
    marginTop: 8,
    backgroundColor: "#FEE2E2",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  logoutText: {
    color: "#EF4444",
    fontWeight: "700",
    fontSize: 14,
  },
});