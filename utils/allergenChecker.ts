import AsyncStorage from "@react-native-async-storage/async-storage";
import { COMMON_ALLERGENS, ADDITIONAL_ALLERGENS } from "../constants/allergenData";
import { Product } from "../types";

export const checkAllergens = async (
  food: Product
): Promise<{ name: string; severity: string }[]> => {
  try {
    const allergensData = await AsyncStorage.getItem("selectedAllergens");
    const severityData = await AsyncStorage.getItem("allergenSeverity");
    const customAllergensData = await AsyncStorage.getItem("customAllergens");

    if (!allergensData) return [];

    const selectedAllergens = JSON.parse(allergensData);
    const allergenSeverity = severityData ? JSON.parse(severityData) : {};
    const customAllergens = customAllergensData ? JSON.parse(customAllergensData) : [];

    const warnings: { name: string; severity: string }[] = [];

    if (food.ingredients_text) {
      const ingredientsLower = food.ingredients_text.toLowerCase();

      selectedAllergens.forEach((allergenId: string) => {
        let allergenName = "";

        const commonAllergen = [...COMMON_ALLERGENS, ...ADDITIONAL_ALLERGENS].find(
          (a) => a.id === allergenId
        );
        if (commonAllergen) {
          allergenName = commonAllergen.name.toLowerCase();
        } else {
          const custom = customAllergens.find((a: any) => a.id === allergenId);
          if (custom) {
            allergenName = custom.name.toLowerCase();
          }
        }

        if (allergenName && new RegExp(`\\b${allergenName}\\b`).test(ingredientsLower)) {
          const severity = allergenSeverity[allergenId] || "medium";
          warnings.push({ name: allergenName, severity });
        }
      });
    }

    return warnings;
  } catch (error) {
    console.error("Error checking allergens:", error);
    return [];
  }
};
