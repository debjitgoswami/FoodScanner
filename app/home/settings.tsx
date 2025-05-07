import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
  Alert,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { StackNavigationProp } from "@react-navigation/stack";

// Define the navigation type
type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  // Add other screens as needed
};

type SettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Settings"
>;

type SettingsProps = {
  navigation: SettingsScreenNavigationProp;
};

// Common food allergens
const COMMON_ALLERGENS = [
  {
    id: "gluten",
    name: "Gluten",
    icon: "🌾",
    description: "Found in wheat, barley, rye",
  },
  {
    id: "dairy",
    name: "Dairy",
    icon: "🥛",
    description: "Milk and milk products",
  },
  {
    id: "nuts",
    name: "Tree Nuts",
    icon: "🥜",
    description: "Almonds, walnuts, cashews, etc.",
  },
  {
    id: "peanuts",
    name: "Peanuts",
    icon: "🥜",
    description: "Legume commonly causing allergies",
  },
  {
    id: "shellfish",
    name: "Shellfish",
    icon: "🦐",
    description: "Shrimp, crab, lobster, etc.",
  },
  { id: "fish", name: "Fish", icon: "🐟", description: "Various fish species" },
  {
    id: "eggs",
    name: "Eggs",
    icon: "🥚",
    description: "Chicken eggs and egg products",
  },
  {
    id: "soy",
    name: "Soy",
    icon: "🫘",
    description: "Soybeans and soy products",
  },
  {
    id: "sesame",
    name: "Sesame",
    icon: "🌱",
    description: "Seeds and sesame oil",
  },
  {
    id: "sulfites",
    name: "Sulfites",
    icon: "🍷",
    description: "Preservatives in foods and drinks",
  },
];

// Additional allergens that users can add
const ADDITIONAL_ALLERGENS = [
  { id: "mustard", name: "Mustard", icon: "🌱" },
  { id: "celery", name: "Celery", icon: "🥬" },
  { id: "lupin", name: "Lupin", icon: "🌱" },
  { id: "molluscs", name: "Molluscs", icon: "🐚" },
];

export default function Settings({ navigation }: SettingsProps) {
  // User preferences state
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [customAllergens, setCustomAllergens] = useState<
    { id: string; name: string }[]
  >([]);
  const [newAllergen, setNewAllergen] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [scanSoundEnabled, setScanSoundEnabled] = useState(true);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [allergenSeverity, setAllergenSeverity] = useState<
    Record<string, "low" | "medium" | "high">
  >({});
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load saved settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const allergensData = await AsyncStorage.getItem("selectedAllergens");
        const customAllergensData = await AsyncStorage.getItem(
          "customAllergens"
        );
        const notificationsData = await AsyncStorage.getItem(
          "notificationsEnabled"
        );
        const scanSoundData = await AsyncStorage.getItem("scanSoundEnabled");
        const highContrastData = await AsyncStorage.getItem("highContrastMode");
        const allergenSeverityData = await AsyncStorage.getItem(
          "allergenSeverity"
        );

        if (allergensData) setSelectedAllergens(JSON.parse(allergensData));
        if (customAllergensData)
          setCustomAllergens(JSON.parse(customAllergensData));
        if (notificationsData)
          setNotificationsEnabled(JSON.parse(notificationsData));
        if (scanSoundData) setScanSoundEnabled(JSON.parse(scanSoundData));
        if (highContrastData) setHighContrastMode(JSON.parse(highContrastData));
        if (allergenSeverityData)
          setAllergenSeverity(JSON.parse(allergenSeverityData));

        setDataLoaded(true);
      } catch (error) {
        console.error("Error loading settings:", error);
        setDataLoaded(true);
      }
    };

    loadSettings();
  }, []);

  // Save settings when they change
  useEffect(() => {
    if (!dataLoaded) return;

    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem(
          "selectedAllergens",
          JSON.stringify(selectedAllergens)
        );
        await AsyncStorage.setItem(
          "customAllergens",
          JSON.stringify(customAllergens)
        );
        await AsyncStorage.setItem(
          "notificationsEnabled",
          JSON.stringify(notificationsEnabled)
        );
        await AsyncStorage.setItem(
          "scanSoundEnabled",
          JSON.stringify(scanSoundEnabled)
        );
        await AsyncStorage.setItem(
          "highContrastMode",
          JSON.stringify(highContrastMode)
        );
        await AsyncStorage.setItem(
          "allergenSeverity",
          JSON.stringify(allergenSeverity)
        );
      } catch (error) {
        console.error("Error saving settings:", error);
      }
    };

    saveSettings();
  }, [
    selectedAllergens,
    customAllergens,
    notificationsEnabled,
    scanSoundEnabled,
    highContrastMode,
    allergenSeverity,
    dataLoaded,
  ]);

  // Toggle allergen selection
  const toggleAllergen = (id: string) => {
    setSelectedAllergens((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Add custom allergen
  const addCustomAllergen = () => {
    if (newAllergen.trim() === "") return;

    const id = `custom-${Date.now()}`;
    setCustomAllergens((prev) => [...prev, { id, name: newAllergen.trim() }]);
    setSelectedAllergens((prev) => [...prev, id]);
    setNewAllergen("");
  };

  // Remove custom allergen
  const removeCustomAllergen = (id: string) => {
    Alert.alert(
      "Remove Allergen",
      "Are you sure you want to remove this allergen?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setCustomAllergens((prev) => prev.filter((item) => item.id !== id));
            setSelectedAllergens((prev) => prev.filter((item) => item !== id));

            // Also remove from severity if exists
            if (allergenSeverity[id]) {
              const newSeverity = { ...allergenSeverity };
              delete newSeverity[id];
              setAllergenSeverity(newSeverity);
            }
          },
        },
      ]
    );
  };

  // Set allergen severity
  const setSeverity = (id: string, level: "low" | "medium" | "high") => {
    setAllergenSeverity((prev) => ({
      ...prev,
      [id]: level,
    }));
  };

  // Reset all settings
  const resetSettings = () => {
    Alert.alert(
      "Reset Settings",
      "Are you sure you want to reset all settings? This will clear all your allergens and preferences.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            setSelectedAllergens([]);
            setCustomAllergens([]);
            setNotificationsEnabled(true);
            setScanSoundEnabled(true);
            setHighContrastMode(false);
            setAllergenSeverity({});
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require("../../assets/images/default-avatar.png")}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editProfileButton}>
              <Ionicons name="pencil" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>User Profile</Text>
          <Text style={styles.profileSubtitle}>
            Manage your allergens and preferences
          </Text>
        </View>

        {/* Allergen Management Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="warning"
              size={22}
              color={Colors.primary}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>Allergen Management</Text>
          </View>

          <Text style={styles.sectionDescription}>
            Select allergens to be alerted about when scanning products
          </Text>

          {/* Common Allergens */}
          <View style={styles.allergensList}>
            {COMMON_ALLERGENS.map((allergen) => (
              <TouchableOpacity
                key={allergen.id}
                style={[
                  styles.allergenItem,
                  selectedAllergens.includes(allergen.id) &&
                    styles.allergenItemSelected,
                ]}
                onPress={() => toggleAllergen(allergen.id)}
              >
                <View style={styles.allergenContent}>
                  <Text style={styles.allergenIcon}>{allergen.icon}</Text>
                  <View style={styles.allergenTextContainer}>
                    <Text
                      style={[
                        styles.allergenName,
                        selectedAllergens.includes(allergen.id) &&
                          styles.allergenNameSelected,
                      ]}
                    >
                      {allergen.name}
                    </Text>
                    <Text style={styles.allergenDescription}>
                      {allergen.description}
                    </Text>
                  </View>
                </View>

                {selectedAllergens.includes(allergen.id) && (
                  <View style={styles.severityContainer}>
                    <TouchableOpacity
                      style={[
                        styles.severityButton,
                        styles.severityLow,
                        allergenSeverity[allergen.id] === "low" &&
                          styles.severitySelected,
                      ]}
                      onPress={() => setSeverity(allergen.id, "low")}
                    >
                      <Text style={styles.severityText}>Low</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.severityButton,
                        styles.severityMedium,
                        allergenSeverity[allergen.id] === "medium" &&
                          styles.severitySelected,
                      ]}
                      onPress={() => setSeverity(allergen.id, "medium")}
                    >
                      <Text style={styles.severityText}>Med</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.severityButton,
                        styles.severityHigh,
                        allergenSeverity[allergen.id] === "high" &&
                          styles.severitySelected,
                      ]}
                      onPress={() => setSeverity(allergen.id, "high")}
                    >
                      <Text style={styles.severityText}>High</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Additional Allergens */}
          <View style={styles.additionalAllergensSection}>
            <Text style={styles.subsectionTitle}>Additional Allergens</Text>

            <View style={styles.allergensList}>
              {ADDITIONAL_ALLERGENS.map((allergen) => (
                <TouchableOpacity
                  key={allergen.id}
                  style={[
                    styles.allergenItem,
                    selectedAllergens.includes(allergen.id) &&
                      styles.allergenItemSelected,
                  ]}
                  onPress={() => toggleAllergen(allergen.id)}
                >
                  <View style={styles.allergenContent}>
                    <Text style={styles.allergenIcon}>{allergen.icon}</Text>
                    <Text
                      style={[
                        styles.allergenName,
                        selectedAllergens.includes(allergen.id) &&
                          styles.allergenNameSelected,
                      ]}
                    >
                      {allergen.name}
                    </Text>
                  </View>

                  {selectedAllergens.includes(allergen.id) && (
                    <View style={styles.severityContainer}>
                      <TouchableOpacity
                        style={[
                          styles.severityButton,
                          styles.severityLow,
                          allergenSeverity[allergen.id] === "low" &&
                            styles.severitySelected,
                        ]}
                        onPress={() => setSeverity(allergen.id, "low")}
                      >
                        <Text style={styles.severityText}>Low</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.severityButton,
                          styles.severityMedium,
                          allergenSeverity[allergen.id] === "medium" &&
                            styles.severitySelected,
                        ]}
                        onPress={() => setSeverity(allergen.id, "medium")}
                      >
                        <Text style={styles.severityText}>Med</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.severityButton,
                          styles.severityHigh,
                          allergenSeverity[allergen.id] === "high" &&
                            styles.severitySelected,
                        ]}
                        onPress={() => setSeverity(allergen.id, "high")}
                      >
                        <Text style={styles.severityText}>High</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Custom Allergens */}
          <View style={styles.customAllergensSection}>
            <Text style={styles.subsectionTitle}>Custom Allergens</Text>

            <View style={styles.addAllergenContainer}>
              <TextInput
                style={styles.allergenInput}
                placeholder="Add a custom allergen..."
                value={newAllergen}
                onChangeText={setNewAllergen}
                returnKeyType="done"
                onSubmitEditing={addCustomAllergen}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={addCustomAllergen}
                disabled={newAllergen.trim() === ""}
              >
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {customAllergens.length > 0 && (
              <View style={styles.allergensList}>
                {customAllergens.map((allergen) => (
                  <View
                    key={allergen.id}
                    style={[styles.allergenItem, styles.allergenItemSelected]}
                  >
                    <View style={styles.allergenContent}>
                      <Text style={styles.allergenIcon}>⚠️</Text>
                      <Text
                        style={[
                          styles.allergenName,
                          styles.allergenNameSelected,
                        ]}
                      >
                        {allergen.name}
                      </Text>
                    </View>

                    <View style={styles.customAllergenActions}>
                      <View style={styles.severityContainer}>
                        <TouchableOpacity
                          style={[
                            styles.severityButton,
                            styles.severityLow,
                            allergenSeverity[allergen.id] === "low" &&
                              styles.severitySelected,
                          ]}
                          onPress={() => setSeverity(allergen.id, "low")}
                        >
                          <Text style={styles.severityText}>Low</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.severityButton,
                            styles.severityMedium,
                            allergenSeverity[allergen.id] === "medium" &&
                              styles.severitySelected,
                          ]}
                          onPress={() => setSeverity(allergen.id, "medium")}
                        >
                          <Text style={styles.severityText}>Med</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.severityButton,
                            styles.severityHigh,
                            allergenSeverity[allergen.id] === "high" &&
                              styles.severitySelected,
                          ]}
                          onPress={() => setSeverity(allergen.id, "high")}
                        >
                          <Text style={styles.severityText}>High</Text>
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeCustomAllergen(allergen.id)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={18}
                          color="#ff5252"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="settings-outline"
              size={22}
              color={Colors.primary}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>App Settings</Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive alerts about allergens
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#e0e0e0", true: `${Colors.primary}80` }}
              thumbColor={notificationsEnabled ? Colors.primary : "#f4f3f4"}
              ios_backgroundColor="#e0e0e0"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Scan Sound</Text>
              <Text style={styles.settingDescription}>
                Play sound when scanning products
              </Text>
            </View>
            <Switch
              value={scanSoundEnabled}
              onValueChange={setScanSoundEnabled}
              trackColor={{ false: "#e0e0e0", true: `${Colors.primary}80` }}
              thumbColor={scanSoundEnabled ? Colors.primary : "#f4f3f4"}
              ios_backgroundColor="#e0e0e0"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>High Contrast Mode</Text>
              <Text style={styles.settingDescription}>
                Increase visibility and readability
              </Text>
            </View>
            <Switch
              value={highContrastMode}
              onValueChange={setHighContrastMode}
              trackColor={{ false: "#e0e0e0", true: `${Colors.primary}80` }}
              thumbColor={highContrastMode ? Colors.primary : "#f4f3f4"}
              ios_backgroundColor="#e0e0e0"
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color={Colors.primary}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>About</Text>
          </View>

          <TouchableOpacity style={styles.aboutItem}>
            <Ionicons
              name="help-circle-outline"
              size={22}
              color="#666"
              style={styles.aboutIcon}
            />
            <Text style={styles.aboutText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.aboutItem}>
            <Ionicons
              name="document-text-outline"
              size={22}
              color="#666"
              style={styles.aboutIcon}
            />
            <Text style={styles.aboutText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.aboutItem}>
            <Ionicons
              name="shield-checkmark-outline"
              size={22}
              color="#666"
              style={styles.aboutIcon}
            />
            <Text style={styles.aboutText}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.aboutItem}>
            <Ionicons
              name="information-outline"
              size={22}
              color="#666"
              style={styles.aboutIcon}
            />
            <Text style={styles.aboutText}>App Version</Text>
            <Text style={styles.versionText}>1.0.0</Text>
          </TouchableOpacity>
        </View>

        {/* Reset Button */}
        <TouchableOpacity style={styles.resetButton} onPress={resetSettings}>
          <Text style={styles.resetButtonText}>Reset All Settings</Text>
        </TouchableOpacity>

        {/* Bottom padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.darkText,
  },
  backButton: {
    padding: 8,
  },
  headerRight: {
    width: 40,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
  },
  editProfileButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: Colors.darkText,
  },
  profileSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.darkText,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  allergensList: {
    marginBottom: 16,
  },
  allergenItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 8,
  },
  allergenItemSelected: {
    backgroundColor: `${Colors.primary}10`,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  allergenContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  allergenIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  allergenTextContainer: {
    flex: 1,
  },
  allergenName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.darkText,
  },
  allergenNameSelected: {
    color: Colors.primary,
  },
  allergenDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  severityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  severityButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginLeft: 4,
    borderWidth: 1,
  },
  severityLow: {
    backgroundColor: "#e8f5e9",
    borderColor: "#81c784",
  },
  severityMedium: {
    backgroundColor: "#fff3e0",
    borderColor: "#ffb74d",
  },
  severityHigh: {
    backgroundColor: "#ffebee",
    borderColor: "#e57373",
  },
  severitySelected: {
    borderWidth: 2,
  },
  severityText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  additionalAllergensSection: {
    marginTop: 16,
  },
  customAllergensSection: {
    marginTop: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: Colors.darkText,
  },
  addAllergenContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  allergenInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  customAllergenActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.darkText,
  },
  settingDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  aboutItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  aboutIcon: {
    marginRight: 12,
  },
  aboutText: {
    fontSize: 16,
    color: Colors.darkText,
    flex: 1,
  },
  versionText: {
    fontSize: 14,
    color: "#999",
  },
  resetButton: {
    backgroundColor: "#ffebee",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 8,
  },
  resetButtonText: {
    color: "#d32f2f",
    fontWeight: "600",
    fontSize: 16,
  },
});
