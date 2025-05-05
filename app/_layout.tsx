// _layout.tsx
import React from "react";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>

      <Tabs.Screen name="home/index" options={{ tabBarLabel: "Explore" }} />
      <Tabs.Screen name="scan/index" options={{ tabBarLabel: "Scan 📷" }} />
      <Tabs.Screen name="scan/search" options={{ tabBarLabel: "Search 🔤" }} />
    </Tabs>
  );
}
