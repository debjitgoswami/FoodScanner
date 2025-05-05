import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router"; 
import { Colors } from "../constants/Colors";
export default function Onboarding() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to FoodScanner!</Text>
      <Text style={styles.subtitle}>Explore, Scan, and Eat Healthy!</Text>

      <View style={styles.buttons}>
        <Button
          title="Explore"
          color={Colors.primary}
          onPress={() => router.replace("/home")} //  navigate to home tab
        />
        <Button
          title="Scan"
          color={Colors.primary}
          onPress={() => router.replace("/scan")} //  navigate to home tab
        />
        <Button
          title="Search"
          color={Colors.primary}
          onPress={() => router.replace("/scan/search")} //  navigate to home tab
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
    gap: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: "center",
  },
});
