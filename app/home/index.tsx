import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  RefreshControl,
  Dimensions,
  TextInput,
  Animated,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { Product } from "../../types";
import FoodCard from "../../components/FoodCard";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// Featured categories with more visual appeal
const FEATURED_CATEGORIES = [
  {
    id: "fruits",
    name: "Fruits",
    emoji: "🍎",
    // image: require("../assets/images/categories/react-logo.png"),
    color: "#FF8A65",
  },
  {
    id: "vegetables",
    name: "Vegetables",
    emoji: "🥦",
    // image: require("../assets/images/categories/react-logo.png"),
    color: "#66BB6A",
  },
  {
    id: "dairy",
    name: "Dairy",
    emoji: "🥛",
    // image: require("../assets/images/categories/react-logo.png"),
    color: "#42A5F5",
  },
  {
    id: "snacks",
    name: "Snacks",
    emoji: "🍿",
    // image: require("../assets/images/categories/react-logo.png"),
    color: "#FFA726",
  },
];

// Additional categories
const MORE_CATEGORIES = [
  { id: "beverages", name: "Beverages", emoji: "🥤", color: "#26C6DA" },
  { id: "breakfast-cereals", name: "Breakfast", emoji: "🥣", color: "#AB47BC" },
  { id: "desserts", name: "Desserts", emoji: "🍰", color: "#EC407A" },
  { id: "cereals", name: "Cereals", emoji: "🌾", color: "#D4B157" },
  { id: "biscuits", name: "Biscuits", emoji: "🍪", color: "#8D6E63" },
  { id: "chocolate", name: "Chocolate", emoji: "🍫", color: "#795548" },
  { id: "pasta", name: "Pasta", emoji: "🍝", color: "#FF7043" },
  { id: "bread", name: "Bread", emoji: "🍞", color: "#FFCA28" },
];

export default function Home() {
  const [showExplore, setShowExplore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [trending, setTrending] = useState<Product[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(false);

  const scrollY = new Animated.Value(0);
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [200, 80],
    extrapolate: "clamp",
  });

  // Fetch trending products on initial load
  useEffect(() => {
    if (showExplore) {
      fetchTrendingProducts();
    }
  }, [showExplore]);

  const fetchTrendingProducts = async () => {
    setLoadingTrending(true);
    try {
      const response = await fetch(
        "https://world.openfoodfacts.org/cgi/search.pl?sort_by=popularity&page_size=10&json=true&fields=code,product_name,image_url,nutriments,brands"
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.products && Array.isArray(data.products)) {
        const filtered = data.products
          .filter((p: any) => p.code && p.product_name && p.image_url)
          .map((p: any) => ({
            code: p.code,
            product_name: p.product_name,
            image_url: p.image_url,
            nutriments: p.nutriments || {},
            brands: p.brands || "Unknown brand",
          }));

        setTrending(filtered);
      }
    } catch (error) {
      console.error("Error fetching trending products:", error);
    } finally {
      setLoadingTrending(false);
    }
  };

  const fetchFoods = useCallback(
    async (categoryId: string, categoryName: string) => {
      if (!categoryId) return;

      setLoading(true);
      setError(null);
      setProducts([]);
      setSelectedCategoryName(categoryName);

      try {
        const url = `https://world.openfoodfacts.org/cgi/search.pl?tagtype_0=categories&tag_contains_0=contains&tag_0=${encodeURIComponent(
          categoryId
        )}&sort_by=popularity&fields=code,product_name,image_url,nutriments,brands,nutriscore_grade&page_size=20&json=true`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.products && Array.isArray(data.products)) {
          const filtered = data.products
            .filter((p: any) => p.code && p.product_name && p.image_url)
            .map((p: any) => ({
              code: p.code,
              product_name: p.product_name,
              image_url: p.image_url,
              nutriments: p.nutriments || {},
              brands: p.brands || "Unknown brand",
              nutriscore: p.nutriscore_grade || "unknown",
            }));

          setProducts(filtered);
        } else {
          setError("No products found");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  const handleCategorySelect = useCallback(
    (categoryId: string, categoryName: string) => {
      setSelectedCategory(categoryId);
      fetchFoods(categoryId, categoryName);
      setShowAllCategories(false);
    },
    [fetchFoods]
  );

  const onRefresh = useCallback(() => {
    if (selectedCategory) {
      setRefreshing(true);
      fetchFoods(selectedCategory, selectedCategoryName);
    }
  }, [selectedCategory, fetchFoods, selectedCategoryName]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setLoading(true);
      setError(null);
      setProducts([]);
      setSelectedCategory(null);
      setSelectedCategoryName(`Search: ${searchQuery}`);

      fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
          searchQuery
        )}&sort_by=popularity&page_size=20&json=true&fields=code,product_name,image_url,nutriments,brands,nutriscore_grade`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.products && Array.isArray(data.products)) {
            const filtered = data.products
              .filter((p: any) => p.code && p.product_name && p.image_url)
              .map((p: any) => ({
                code: p.code,
                product_name: p.product_name,
                image_url: p.image_url,
                nutriments: p.nutriments || {},
                brands: p.brands || "Unknown brand",
                nutriscore: p.nutriscore_grade || "unknown",
              }));

            setProducts(filtered);
          } else {
            setError("No products found");
          }
        })
        .catch((error) => {
          console.error("Error searching products:", error);
          setError("Failed to search products. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // Home screen (not changing as requested)
  if (!showExplore) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.homeContent}>
            <Image
              source={require("../../assets/images/icon.png")}
              style={styles.logo}
            />
            <Text style={styles.title}>FoodScan</Text>
            <Text style={styles.subtitle}>
              Find nutritional info by scanning or exploring by category
            </Text>

            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>🔍</Text>
                <Text style={styles.featureText}>Browse food categories</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>📊</Text>
                <Text style={styles.featureText}>View nutritional details</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>📱</Text>
                <Text style={styles.featureText}>Simple and easy to use</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => setShowExplore(true)}
            >
              <Text style={styles.exploreButtonText}>Explore Foods</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Completely redesigned explore section
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowExplore(false)}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {selectedCategory ? selectedCategoryName : "Explore Foods"}
          </Text>
          <TouchableOpacity style={styles.scanButton}>
            <Ionicons name="scan-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for foods..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery("")}
            >
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Main Content */}
      {showAllCategories ? (
        // All Categories View
        <FlatList
          data={[...FEATURED_CATEGORIES, ...MORE_CATEGORIES]}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.allCategoriesContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryGridItem, { backgroundColor: item.color }]}
              onPress={() => handleCategorySelect(item.id, item.name)}
            >
              <Text style={styles.categoryGridEmoji}>{item.emoji}</Text>
              <Text style={styles.categoryGridName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ListHeaderComponent={
            <View style={styles.allCategoriesHeader}>
              <Text style={styles.sectionTitle}>All Categories</Text>
              <TouchableOpacity onPress={() => setShowAllCategories(false)}>
                <Text style={styles.backLink}>Back to Explore</Text>
              </TouchableOpacity>
            </View>
          }
        />
      ) : selectedCategory ? (
        // Category Products View
        <>
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={48} color="#d32f2f" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() =>
                  fetchFoods(selectedCategory, selectedCategoryName)
                }
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>
                Loading {selectedCategoryName}...
              </Text>
            </View>
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => <FoodCard food={item} />}
              contentContainerStyle={styles.productsList}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Colors.primary]}
                  tintColor={Colors.primary}
                />
              }
              ListHeaderComponent={
                <View style={styles.productsHeader}>
                  <Text style={styles.productsHeaderTitle}>
                    {selectedCategoryName}
                  </Text>
                  <Text style={styles.productsCount}>
                    {products.length} items
                  </Text>
                </View>
              }
              ListEmptyComponent={
                !loading && !error ? (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="nutrition-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>
                      No products found in this category
                    </Text>
                    <TouchableOpacity
                      style={styles.browseMoreButton}
                      onPress={() => setShowAllCategories(true)}
                    >
                      <Text style={styles.browseMoreButtonText}>
                        Browse More Categories
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null
              }
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}
            />
          )}
        </>
      ) : (
        // Explore Home View
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.exploreContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {/* Featured Categories */}
          <View style={styles.featuredSection}>
            <Text style={styles.sectionTitle}>Featured Categories</Text>
            <FlatList
              horizontal
              data={FEATURED_CATEGORIES}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.featuredCategoryCard}
                  onPress={() => handleCategorySelect(item.id, item.name)}
                >
                  {/* <Image source={item.image} style={styles.categoryImage} /> */}
                  <View
                    style={[
                      styles.categoryOverlay,
                      { backgroundColor: item.color + "80" },
                    ]}
                  >
                    <Text style={styles.categoryName}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* More Categories */}
          <View style={styles.moreCategories}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>More Categories</Text>
              <TouchableOpacity onPress={() => setShowAllCategories(true)}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.categoriesGrid}>
              {MORE_CATEGORIES.slice(0, 4).map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    { backgroundColor: category.color },
                  ]}
                  onPress={() =>
                    handleCategorySelect(category.id, category.name)
                  }
                >
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                  <Text style={styles.categoryButtonText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Trending Products */}
          <View style={styles.trendingSection}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            {loadingTrending ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <FlatList
                horizontal
                data={trending}
                keyExtractor={(item) => item.code}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.trendingCard}>
                    <Image
                      source={{ uri: item.image_url }}
                      style={styles.trendingImage}
                      // defaultSource={require("../assets/images/placeholder.png")}
                    />
                    <View style={styles.trendingInfo}>
                      <Text style={styles.trendingName} numberOfLines={2}>
                        {item.product_name}
                      </Text>
                      <Text style={styles.trendingBrand} numberOfLines={1}>
                        {item.brands}
                      </Text>
                    </View>
                  </View>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyTrendingText}>
                    No trending products available
                  </Text>
                }
              />
            )}
          </View>

          {/* Tips Section */}
          <View style={styles.tipsSection}>
            <Text style={styles.sectionTitle}>Nutrition Tips</Text>
            <View style={styles.tipCard}>
              <Ionicons
                name="nutrition"
                size={24}
                color="#4CAF50"
                style={styles.tipIcon}
              />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Read Nutrition Labels</Text>
                <Text style={styles.tipText}>
                  Understanding nutrition labels can help you make healthier
                  food choices.
                </Text>
              </View>
            </View>
            <View style={styles.tipCard}>
              <Ionicons
                name="water"
                size={24}
                color="#2196F3"
                style={styles.tipIcon}
              />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Stay Hydrated</Text>
                <Text style={styles.tipText}>
                  Drink plenty of water throughout the day for optimal health.
                </Text>
              </View>
            </View>
          </View>
        </Animated.ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
  homeContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
  },
  header: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    overflow: "hidden",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.darkText,
  },
  backButton: {
    padding: 8,
  },
  scanButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: Colors.darkText,
  },
  clearButton: {
    padding: 4,
  },
  exploreContent: {
    paddingBottom: 30,
  },
  featuredSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: Colors.darkText,
  },
  featuredCategoryCard: {
    width: width * 0.7,
    height: 160,
    marginRight: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  categoryOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  categoryName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  moreCategories: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAllText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryButton: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  categoryEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  categoryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  trendingSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  trendingCard: {
    width: 140,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  trendingImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  trendingInfo: {
    padding: 12,
  },
  trendingName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  trendingBrand: {
    fontSize: 12,
    color: "#888",
  },
  emptyTrendingText: {
    color: "#888",
    fontStyle: "italic",
    padding: 16,
  },
  tipsSection: {
    marginTop: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tipCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tipIcon: {
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: "#666",
  },
  allCategoriesContainer: {
    padding: 16,
  },
  allCategoriesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  backLink: {
    color: Colors.primary,
    fontWeight: "600",
  },
  categoryGridItem: {
    flex: 1,
    margin: 6,
    height: 120,
    borderRadius: 12,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryGridEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryGridName: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  productsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  productsHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productsCount: {
    color: "#888",
  },
  productsList: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: Colors.darkText,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    color: "#d32f2f",
    marginVertical: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.darkText,
    fontSize: 16,
    textAlign: "center",
    marginVertical: 16,
  },
  browseMoreButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginTop: 16,
  },
  browseMoreButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.darkText,
    marginBottom: 24,
    textAlign: "center",
  },
  featuresContainer: {
    width: "100%",
    marginVertical: 30,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: Colors.lightGray,
    padding: 16,
    borderRadius: 12,
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    color: Colors.darkText,
  },
  exploreButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: "80%",
    alignItems: "center",
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
