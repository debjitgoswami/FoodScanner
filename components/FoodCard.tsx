import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Product } from "../types";
import NutriScore from "./NutriScore";
import KidSafety from "./KidSafety";
import { checkKidSafety } from "../utils/kidSafety";


type Props = {
  food: Product;
};

const FoodCard: React.FC<Props> = ({ food }) => {
  // More comprehensive check for kid safety


  const kidSafetyResult = checkKidSafety(food);


  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: food.image_url || require("../assets/images/icon.png"),
        }}
        style={styles.image}
        defaultSource={require("../assets/images/icon.png")}
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

        {/* NutriScore */}
        <NutriScore
          grade={food.nutrition_grades || food.nutriscore_grade || "?"}
        />

        {/* KidSafety with reason */}
        <KidSafety
          isSafe={kidSafetyResult.isSafe}
          reason={kidSafetyResult.reason}
        />
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
});

export default FoodCard;
