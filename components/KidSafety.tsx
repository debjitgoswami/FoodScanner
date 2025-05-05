import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  isSafe: boolean;
};

const KidSafety: React.FC<Props> = ({ isSafe }) => {
  return (
    <View
      style={[styles.kidTagContainer, !isSafe && styles.kidTagContainerWarning]}
    >
      <Text style={[styles.kidTag, !isSafe && styles.kidTagWarning]}>
        {isSafe
          ? "✅ Suitable for children"
          : "🚫 Not recommended for children"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  kidTagContainer: {
    backgroundColor: "#e8f5e9",
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
  },
  kidTagContainerWarning: {
    backgroundColor: "#ffebee",
  },
  kidTag: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
    textAlign: "center",
  },
  kidTagWarning: {
    color: "#c62828",
  },
});

export default KidSafety;
