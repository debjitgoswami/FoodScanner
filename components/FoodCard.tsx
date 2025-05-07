import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product } from "../types";
import NutriScore from "./NutriScore";
import KidSafety from "./KidSafety";
import { checkKidSafety } from "../utils/kidSafety";
import {
  COMMON_ALLERGENS,
  ADDITIONAL_ALLERGENS,
} from "../constants/allergenData";
import { checkAllergens } from "../utils/allergenChecker";




type Props = {
  food: Product;
};

const FoodCard: React.FC<Props> = ({ food }) => {
  const [allergenWarnings, setAllergenWarnings] = useState<
    { name: string; severity: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const kidSafetyResult = checkKidSafety(food);


useEffect(() => {
  const fetchAllergenWarnings = async () => {
    try {
      setIsLoading(true);
      const warnings = await checkAllergens(food);
      setAllergenWarnings(warnings);
    } catch (error) {
      console.error("Error fetching allergens:", error);
      setAllergenWarnings([]);
    } finally {
      setIsLoading(false);
    }
  };

  fetchAllergenWarnings();
}, [food]);



  const renderAllergenWarnings = () => {
    if (isLoading) return null;

    if (allergenWarnings.length === 0) {
      return <Text style={styles.safeText}>No allergens detected</Text>;
    }

    return (
      <View style={styles.allergenWarningsContainer}>
        <Text style={styles.allergenWarningsTitle}>Allergen Warnings:</Text>
        {allergenWarnings.map((warning, index) => (
          <View
            key={index}
            style={[
              styles.allergenWarning,
              warning.severity === "high" && styles.highSeverity,
              warning.severity === "medium" && styles.mediumSeverity,
              warning.severity === "low" && styles.lowSeverity,
            ]}
          >
            <Text style={styles.allergenWarningText}>
              Contains {warning.name} ({warning.severity} severity)
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const imageSource = food.image_url
    ? { uri: food.image_url }
    : require("../assets/images/favicon.png");

  return (
    <View style={styles.card}>
      <Image
        source={imageSource}
        style={styles.image}
        defaultSource={require("../assets/images/favicon.png")}
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {food.product_name || "Unknown Product"}
        </Text>

        <Text style={styles.info}>
          <Text style={styles.infoLabel}>Brand: </Text>
          {food.brands || "Unknown"}
        </Text>

        <Text style={styles.info}>
          <Text style={styles.infoLabel}>Barcode: </Text>
          {food.code}
        </Text>

        {food.quantity && (
          <Text style={styles.info}>
            <Text style={styles.infoLabel}>Quantity: </Text>
            {food.quantity}
          </Text>
        )}

        <NutriScore
          grade={food.nutrition_grades || food.nutriscore_grade || "?"}
        />

        <KidSafety
          isSafe={kidSafetyResult.isSafe}
          reason={kidSafetyResult.reason}
        />

        {renderAllergenWarnings()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 140,
    borderRadius: 10,
    resizeMode: "cover",
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
  },
  content: {
    gap: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },
  info: {
    fontSize: 13,
    color: "#555",
    marginBottom: 2,
  },
  infoLabel: {
    fontWeight: "600",
    color: "#444",
  },
  safeText: {
    fontSize: 13,
    color: "#3a9440",
    fontWeight: "600",
  },
  allergenWarningsContainer: {
    marginTop: 10,
  },
  allergenWarningsTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
    color: "#b00020",
  },
  allergenWarning: {
    padding: 6,
    borderRadius: 6,
    marginBottom: 4,
  },
  allergenWarningText: {
    fontSize: 13,
    color: "#fff",
  },
  highSeverity: {
    backgroundColor: "#d32f2f",
  },
  mediumSeverity: {
    backgroundColor: "#f57c00",
  },
  lowSeverity: {
    backgroundColor: "#388e3c",
  },
});

export default FoodCard;
