import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
  Image,
  Animated,
} from "react-native";
import { Eye, EyeOff, Mail, Lock } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";
import { supabase } from "../config/supabase";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const hero = require("../../assets/illustrations/Virtual reality-cuate.png");

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const fade = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(30)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const t = setTimeout(() => {
      setReady(true);

      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(translate, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, 40);

    return () => clearTimeout(t);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Completa los campos");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;

      navigation.replace("ConductorHome");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const Leaf = ({ style }: any) => (
    <View style={[styles.leaf, style]}>
      <Svg width={80} height={80} viewBox="0 0 24 24">
        <Path
          fill="#10B981"
          d="M12 2C8 6 4 10 4 14a8 8 0 0016 0c0-4-4-8-8-12z"
        />
      </Svg>
    </View>
  );

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: "#fff" }} />;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Animated.View
        style={[
          styles.container,
          { opacity: fade, transform: [{ translateY: translate }] },
        ]}
      >
        <ScrollView
          style={{ backgroundColor: "#fff" }}
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: insets.bottom + 20 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* SHAPES */}
          <Leaf style={{ top: 40, left: -20, opacity: 0.05 }} />
          <Leaf style={{ bottom: 100, right: -20, opacity: 0.05 }} />

          {/* IMAGE */}
          <Image source={hero} style={styles.image} />

          <View style={styles.form}>
            <Text style={styles.title}>Iniciar sesión</Text>
            <Text style={styles.subtitle}>
              Accede con tu cuenta de TrashGo
            </Text>

            {/* EMAIL */}
            <View style={styles.input}>
              <Mail size={18} color="#9CA3AF" />
              <TextInput
                placeholder="Correo electrónico"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                style={styles.inputText}
              />
            </View>

            {/* PASSWORD */}
            <View style={styles.input}>
              <Lock size={18} color="#9CA3AF" />
              <TextInput
                placeholder="Contraseña"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                style={styles.inputText}
              />

              {password.length > 0 && (
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <Eye size={18} color="#9CA3AF" />
                  ) : (
                    <EyeOff size={18} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* BOTÓN STRIPE */}
            <Animated.View
              style={[
                styles.buttonWrapper,
                { transform: [{ scale }] },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.button}
                onPress={handleLogin}
                onPressIn={() =>
                  Animated.spring(scale, {
                    toValue: 0.96,
                    useNativeDriver: true,
                  }).start()
                }
                onPressOut={() =>
                  Animated.spring(scale, {
                    toValue: 1,
                    useNativeDriver: true,
                  }).start()
                }
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Ingresar</Text>
                )}
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.link}>Crear cuenta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scroll: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 70,
  },

  image: {
    width: 170,
    height: 170,
    alignSelf: "center",
    marginBottom: 10,
  },

  form: {
    padding: 20,
  },

  title: {
    fontSize: 24,
    color: "#111",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 18,
    marginTop: 4,
  },

  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },

  inputText: {
    flex: 1,
    fontSize: 14,
    color: "#111",
  },

  // 🔥 BOTÓN PRO
  buttonWrapper: {
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: "#D1FAE5",
    padding: 2,
  },

  button: {
    height: 50,
    borderRadius: 16,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  link: {
    marginTop: 14,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 13,
  },

  leaf: {
    position: "absolute",
  },
});