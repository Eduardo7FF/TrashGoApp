import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import Toast from "react-native-toast-message";
import { View, Text } from "react-native";

const toastConfig = {
  success: (props: any) => (
    <View
      style={{
        width: "90%",
        backgroundColor: "#111827",
        padding: 14,
        borderRadius: 18,
        alignSelf: "center",
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "600" }}>
        {props.text1}
      </Text>
      {props.text2 && (
        <Text style={{ color: "#9CA3AF", marginTop: 2, fontSize: 12 }}>
          {props.text2}
        </Text>
      )}
    </View>
  ),

  error: (props: any) => (
    <View
      style={{
        width: "90%",
        backgroundColor: "#EF4444",
        padding: 14,
        borderRadius: 18,
        alignSelf: "center",
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "600" }}>
        {props.text1}
      </Text>
      {props.text2 && (
        <Text style={{ color: "#FEE2E2", marginTop: 2, fontSize: 12 }}>
          {props.text2}
        </Text>
      )}
    </View>
  ),
};

export default function App() {
  return (
    <>
      <AppNavigator />
      <Toast config={toastConfig} />
    </>
  );
}