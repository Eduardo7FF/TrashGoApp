import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");

const data = [
  {
    id: "1",
    type: "earth",
    title: "Bienvenido a TrashGo",
    desc: "Una forma inteligente de gestionar residuos urbanos.",
    roles: true,
  },
  {
    id: "2",
    type: "recycle",
    title: "Seguimiento en tiempo real",
    desc: "Visualiza rutas activas y ubicación del camión.",
  },
  {
    id: "3",
    type: "bag",
    title: "Optimización del servicio",
    desc: "Mejora la recolección y reduce impacto ambiental.",
  },
];

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<any>(null);
  const currentIndex = useRef(0);

  // 🔥 AUTO SWIPE
  useEffect(() => {
    const interval = setInterval(() => {
      goNext();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 🔥 RESET AL VOLVER
  useEffect(() => {
    if (isFocused) {
      currentIndex.current = 0;

      requestAnimationFrame(() => {
        flatListRef.current?.scrollToOffset({
          offset: 0,
          animated: false,
        });
      });
    }
  }, [isFocused]);

  const goNext = () => {
    const next =
      currentIndex.current === data.length - 1
        ? 0
        : currentIndex.current + 1;

    currentIndex.current = next;

    flatListRef.current?.scrollToOffset({
      offset: next * width,
      animated: true,
    });
  };

  const onMomentumEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    currentIndex.current = index;
  };

  // 🌿 IMAGENES
  const renderImage = (type: string) => {
    let img;
    if (type === "earth")
      img = require("../../assets/illustrations/earth.png");
    if (type === "recycle")
      img = require("../../assets/illustrations/recycle.png");
    if (type === "bag")
      img = require("../../assets/illustrations/bag.png");

    return (
      <Animated.Image
        source={img}
        style={{ width: 220, height: 220 }}
        resizeMode="contain"
      />
    );
  };

  const Leaf = ({ style }: any) => (
    <View style={[styles.leaf, style]}>
      <Svg width={70} height={70} viewBox="0 0 24 24">
        <Path
          fill="#10B981"
          d="M12 2C8 6 4 10 4 14a8 8 0 0016 0c0-4-4-8-8-12z"
        />
      </Svg>
    </View>
  );

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.page}>
        <Leaf style={{ top: 60, left: 10, opacity: 0.12 }} />
        <Leaf style={{ bottom: 80, right: 10, opacity: 0.1 }} />

        <View style={styles.content}>
          {renderImage(item.type)}

          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.desc}>{item.desc}</Text>

          {item.roles && (
            <>
              <Text style={styles.roleText}>Elige tu rol</Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.btnPrimary}
                  onPress={() => navigation.navigate("CiudadanoHome")}
                >
                  <View style={styles.activeDotYellow} />
                  <Text style={styles.btnPrimaryText}>Ciudadano</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnOutline}
                  onPress={() => navigation.navigate("Login")}
                >
                  <View style={styles.activeDot} />
                  <Text style={styles.btnOutlineText}>Conductor</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* SWIPE CON ANIMACION REAL */}
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={onMomentumEnd}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />

      {/* DOTS ANIMADOS */}
      <View style={styles.dots}>
        {data.map((_, i) => {
          const inputRange = [
            (i - 1) * width,
            i * width,
            (i + 1) * width,
          ];

          const widthAnim = scrollX.interpolate({
            inputRange,
            outputRange: [6, 18, 6],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                { width: widthAnim, opacity },
              ]}
            />
          );
        })}
      </View>

      {/* BOTON NEXT */}
      <TouchableOpacity style={styles.nextBtn} onPress={goNext}>
        <Svg width={26} height={26} viewBox="0 0 24 24">
          <Path
            d="M5 12H19M13 6L19 12L13 18"
            stroke="#fff"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  page: {
    width,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    alignItems: "center",
    paddingHorizontal: 30,
  },

  title: {
    marginTop: 15,
    fontSize: 22,
    color: "#111",
    textAlign: "center",
  },

  desc: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },

  roleText: {
    marginTop: 18,
    fontSize: 14,
    color: "#444",
  },

  actions: {
    marginTop: 15,
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },

  btnPrimary: {
    flex: 1,
    height: 42,
    borderRadius: 16,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },

  btnPrimaryText: {
    color: "#fff",
    fontSize: 13,
  },

  btnOutline: {
    flex: 1,
    height: 42,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },

  btnOutlineText: {
    color: "#374151",
    fontSize: 13,
  },

  activeDotYellow: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FACC15",
  },

  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
  },

  dots: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    alignSelf: "center",
  },

  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
    marginHorizontal: 4,
  },

  nextBtn: {
    position: "absolute",
    bottom: 90,
    alignSelf: "center",
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },

  leaf: {
    position: "absolute",
  },
});