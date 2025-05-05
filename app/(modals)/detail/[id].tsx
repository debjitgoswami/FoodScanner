import React, { useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useFetchFood } from "../../../hooks/useFetchFood";
import Rating from "../../../components/Rating";
import HealthyBar from "../../../components/HealthyBar";
import NutriScore from "../../../components/NutriScore";
import NutritionFacts from "../../../components/NutritionFacts";
import KidSafety from "../../../components/KidSafety";
import { Colors } from "../../../constants/Colors";

const getNutritionRating = (grade: string): number => {
  const gradeMap: Record<string, number> = {
    a: 5,
    b: 4,
    c: 3,
    d: 2,
    e: 1,
  };
  return gradeMap[grade?.toLowerCase()] || 1;
};

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { product, fetchFoodByCode, loading, error } = useFetchFood();

  useEffect(() => {
    if (id) {
      fetchFoodByCode(id);
    }
  }, [id, fetchFoodByCode]);

  const { energy, nutriGrade, ratingValue, isKidSafe, productImage } =
    useMemo(() => {
      if (!product) {
        return {
          energy: 0,
          nutriGrade: "?",
          ratingValue: 1,
          isKidSafe: true,
          productImage: null,
        };
      }

      return {
        energy: product.nutriments?.["energy-kcal_100g"] ?? 0,
        nutriGrade: product.nutrition_grades ?? "?",
        ratingValue: getNutritionRating(product.nutrition_grades ?? "?"),

        isKidSafe: !product.ingredients_text?.toLowerCase().includes("alcohol"),
        productImage: product.image_url || product.image_front_url || null,
      };
    }, [product]);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.error}>⚠️ {error}</Text>
        <Text style={styles.errorSubtext}>Please try again later</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.error}>No product found</Text>
        <Text style={styles.errorSubtext}>
          The product with ID {id} could not be found
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: product.product_name || "Product Details",
          headerBackTitle: "Back",
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {productImage && (
          <Image
            source={{ uri: productImage }}
            style={styles.productImage}
            resizeMode="contain"
          />
        )}

        <Text style={styles.title} accessibilityRole="header">
          {product.product_name || "Unnamed Product"}
        </Text>

        {product.brands && (
          <Text style={styles.brand}>
            By <Text style={styles.brandName}>{product.brands}</Text>
          </Text>
        )}

        <View style={styles.nutritionContainer}>
          <NutriScore grade={nutriGrade} />
          <Rating value={ratingValue} />
          <HealthyBar score={energy} />
        </View>

        <KidSafety isSafe={isKidSafe} />

        {product.ingredients_text && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Ingredients:</Text>
            <Text style={styles.text}>{product.ingredients_text}</Text>
          </View>
        )}

        {product.nutriments && (
          <NutritionFacts nutriments={product.nutriments} />
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.background,
  },
  productImage: {
    width: "100%",
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
    color: Colors.text || "#000",
  },
  brand: {
    fontSize: 16,
    marginBottom: 16,
    color: Colors.textSecondary || "#666",
  },
  brandName: {
    fontWeight: "600",
  },
  nutritionContainer: {
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: Colors.text || "#000",
  },
  text: {
    fontSize: 16,
    color: Colors.textSecondary || "#333",
    lineHeight: 22,
  },
  error: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.error || "red",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.textSecondary || "#666",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textSecondary || "#666",
  },
  section: {
    marginTop: 24,
  },
});
