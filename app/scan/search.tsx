// app/scan/search.tsx
import React from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import SearchBar from "../../components/SearchBar";
import FoodCard from "../../components/FoodCard";
import { useFetchFood } from "../../hooks/useFetchFood";
import { Product } from "../../types";
import { Colors } from "../../constants/Colors";


export default function SearchScreen() {
  const { fetchFoodByName, results, loading, error } = useFetchFood();

  return (
    <View style={styles.container}>
      <SearchBar onSearch={fetchFoodByName} />

      {loading && <ActivityIndicator size="large" color="#4CAF50" />}

      {error && <Text style={styles.error}>{error}</Text>}

      {!loading && !error && results.length === 0 && (
        <Text style={styles.empty}>
          No results yet. Try searching for something!
        </Text>
      )}

      <FlatList
        data={results}
        keyExtractor={(item: Product) => item.code}
        renderItem={({ item }) => <FoodCard food={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16,backgroundColor: Colors.background }, 
  error: { color: "red", textAlign: "center", marginVertical: 10 },
  empty: { textAlign: "center", color: "#666", marginTop: 20 },
});
