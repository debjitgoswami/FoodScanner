import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";

type Props = {
  isSafe: boolean;
  reason?: string;
  onInfoPress?: () => void;
  style?: object;
  compact?: boolean;
};

const KidSafety: React.FC<Props> = ({
  isSafe,
  reason,
  onInfoPress,
  style,
  compact = false,
}) => {
  // Use useRef for animation values to prevent recreating them on each render
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate component on mount
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Add cleanup to reset animations if needed
    return () => {
      scaleAnim.setValue(0.95);
      opacityAnim.setValue(0);
    };
  }, [scaleAnim, opacityAnim]);

  // Get the appropriate icon and colors based on safety status
  const getStatusInfo = (): {
    icon: React.ComponentProps<typeof Feather>["name"];
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    label: string;
  } => {
    if (isSafe) {
      return {
        icon: "check-circle",
        backgroundColor: "#e8f5e9",
        borderColor: "#81c784",
        textColor: "#2e7d32",
        label: "Suitable for children",
      };
    } else {
      return {
        icon: "alert-triangle",
        backgroundColor: "#ffebee",
        borderColor: "#e57373",
        textColor: "#c62828",
        label: "Not recommended for children",
      };
    }
  };

  const statusInfo = getStatusInfo();

  // Compact version of the component
  if (compact) {
    return (
      <Animated.View
        style={[
          styles.compactContainer,
          {
            backgroundColor: statusInfo.backgroundColor,
            borderColor: statusInfo.borderColor,
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
          style,
        ]}
      >
        <Feather
          name={statusInfo.icon}
          size={16}
          color={statusInfo.textColor}
        />
        <Text style={[styles.compactText, { color: statusInfo.textColor }]}>
          {isSafe ? "Kid-friendly" : "Not for kids"}
        </Text>
      </Animated.View>
    );
  }

  // Full version of the component
  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: statusInfo.backgroundColor,
          borderColor: statusInfo.borderColor,
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
        style,
      ]}
      accessibilityRole="alert"
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Feather
            name={statusInfo.icon}
            size={22}
            color={statusInfo.textColor}
          />
        </View>
        <Text style={[styles.title, { color: statusInfo.textColor }]}>
          {statusInfo.label}
        </Text>
      </View>

      {reason && (
        <Text style={[styles.reason, { color: statusInfo.textColor }]}>
          {reason}
        </Text>
      )}

      {onInfoPress && (
        <TouchableOpacity
          style={[styles.infoButton, { borderColor: statusInfo.borderColor }]}
          onPress={onInfoPress}
          accessibilityRole="button"
        >
          <Text
            style={[styles.infoButtonText, { color: statusInfo.textColor }]}
          >
            Learn more
          </Text>
          <Feather name="info" size={16} color={statusInfo.textColor} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    // Add width to ensure component is visible
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  reason: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
    opacity: 0.9,
  },
  infoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  infoButtonText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 6,
  },
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  compactText: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
});

export default KidSafety;
