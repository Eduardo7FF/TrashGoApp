import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "../screens/conductor/ProfileScreen";
import ConductorHomeScreen from "../screens/conductor/ConductorHomeScreen";
import { Feather } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function DriverTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        animation: "none",

        lazy: false,
        freezeOnBlur: true,
        detachInactiveScreens: false,

        sceneStyle: {
          backgroundColor: "#F8FAFC",
        },

        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 6,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },

        tabBarActiveTintColor: "#10B981",
        tabBarInactiveTintColor: "#9CA3AF",

        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === "Inicio") {
            iconName = "home";
          }

          if (route.name === "Perfil") {
            iconName = "user";
          }

          return (
            <Feather
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={ConductorHomeScreen}
      />

      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}