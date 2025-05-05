import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";
import { Nutriments } from "../types"; // Adjust based on your structure

type Props = {
  nutriments: Nutriments;
};

const NutritionFacts: React.FC<Props> = ({ nutriments }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.subtitle}>Nutrition Facts (per 100g):</Text>
      <View style={styles.nutritionGrid}>
        {nutriments["energy-kcal_100g"] && (
          <Item
            label="Energy"
            value={`${nutriments["energy-kcal_100g"]} kcal`}
          />
        )}
        {nutriments.fat_100g && (
          <Item label="Fat" value={`${nutriments.fat_100g}g`} />
        )}
        {nutriments.carbohydrates_100g && (
          <Item label="Carbs" value={`${nutriments.carbohydrates_100g}g`} />
        )}
        {nutriments.proteins_100g && (
          <Item label="Protein" value={`${nutriments.proteins_100g}g`} />
        )}
        {nutriments.salt_100g && (
          <Item label="Salt" value={`${nutriments.salt_100g}g`} />
        )}
        {nutriments.sugars_100g && (
          <Item label="Sugar" value={`${nutriments.sugars_100g}g`} />
        )}
      </View>
    </View>
  );
};

const Item = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.nutritionItem}>
    <Text style={styles.nutritionLabel}>{label}</Text>
    <Text style={styles.nutritionValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: Colors.text || "#000",
  },
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  nutritionItem: {
    width: "50%",
    paddingVertical: 8,
    paddingRight: 16,
  },
  nutritionLabel: {
    fontSize: 14,
    color: Colors.textSecondary || "#666",
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text || "#000",
  },
});

export default NutritionFacts;
