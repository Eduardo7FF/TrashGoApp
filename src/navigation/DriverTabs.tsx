import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Animated } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

import ProfileScreen from "../screens/conductor/ProfileScreen";
import ConductorHomeScreen from "../screens/conductor/ConductorHomeScreen";
import RecorridoScreen from "../screens/conductor/RecorridoScreen";

import { DriverProvider } from "./DriverContext";

const Tab = createBottomTabNavigator();

/* ICONO CAMIÓN */
function TruckIcon({ color, size = 24 }: any) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M3 7.5C3 6.67 3.67 6 4.5 6h8C13.33 6 14 6.67 14 7.5V14h1.4c.22-1.14 1.22-2 2.43-2s2.21.86 2.43 2H21V11.8c0-.35-.12-.69-.34-.96l-2.2-2.64A1.5 1.5 0 0 0 17.3 7.5H14V7.5H3Z"
      />
      <Circle cx="7" cy="16.5" r="2" fill={color} />
      <Circle cx="18" cy="16.5" r="2" fill={color} />
    </Svg>
  );
}

/* ICONO RUTA */
function RouteIcon({ color, size = 24 }: any) {
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

/* ICONO PERFIL */
function UserIcon({ color, size = 24 }: any) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle
        cx="12"
        cy="8"
        r="3.2"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <Path
        d="M5 19c1.4-3.2 4-4.8 7-4.8s5.6 1.6 7 4.8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

/* ANIMACIÓN */
function AnimatedIcon({ focused, children }: any) {
  const scale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.12 : 1,
      useNativeDriver: true,
      friction: 6,
    }).start();
  }, [focused]);

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
      }}
    >
      {children}
    </Animated.View>
  );
}

function TabsContent() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        animation: "none",
        lazy: true,
        freezeOnBlur: true,
        detachInactiveScreens: true,

        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0,
          height: 74,
          paddingBottom: 10,
          paddingTop: 8,
          elevation: 10,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },

        tabBarActiveTintColor: "#10B981",
        tabBarInactiveTintColor: "#9CA3AF",

        tabBarIcon: ({ color, focused }) => {
          if (route.name === "Inicio") {
            return (
              <AnimatedIcon focused={focused}>
                <TruckIcon color={color} />
              </AnimatedIcon>
            );
          }

          if (route.name === "Recorrido") {
            return (
              <AnimatedIcon focused={focused}>
                <RouteIcon color={color} />
              </AnimatedIcon>
            );
          }

          return (
            <AnimatedIcon focused={focused}>
              <UserIcon color={color} />
            </AnimatedIcon>
          );
        },
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={ConductorHomeScreen}
      />

      <Tab.Screen
        name="Recorrido"
        component={RecorridoScreen}
      />

      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}

export default function DriverTabs() {
  return (
    <DriverProvider>
      <TabsContent />
    </DriverProvider>
  );
}