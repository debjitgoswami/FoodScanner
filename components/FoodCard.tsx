import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Product } from "../types";
import NutriScore from "./NutriScore";
import KidSafety from "./KidSafety"; // Assuming this component is correctly imported

type Props = {
  food: Product;
};

const FoodCard: React.FC<Props> = ({ food }) => {
  // Logic to determine if the food is safe for kids (based on ingredients)
  const isKidSafe = food.ingredients_text
    ? !food.ingredients_text.toLowerCase().includes("alcohol")
    : true; // Default to true if no ingredients text is available

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: food.image_url || "./assets/image/icon.png" }}
        alt={food.product_name || "No Name"}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{food.product_name || "No Name"}</Text>
        <Text style={styles.info}>Brands: {food.brands || "N/A"}</Text>
        <Text style={styles.info}>Barcode: {food.code}</Text>
        <Text style={styles.info}>Quantity: {food.quantity || "N/A"}</Text>
        {/* KidSafety */}
        <KidSafety isSafe={isKidSafe} />{" "}
        {/* This will display if the product is kid-safe */}
        {/* NutriScore */}
        <NutriScore grade={food.nutrition_grades ?? "?"} />{" "}
        {/* Default value if undefined */}
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
  },
  content: {
    gap: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },
  info: {
    fontSize: 13,
    color: "#555",
  },
});

export default FoodCard;
