import { Product } from "../types";

export const checkKidSafety = (
  food: Product | null | undefined
): { isSafe: boolean; reason?: string } => {
  if (!food) {
    return { isSafe: false, reason: "Insufficient product information" };
  }

  const unsafeIngredients = [
    "alcohol",
    "wine",
    "beer",
    "liquor",
    "rum",
    "vodka",
    "whiskey",
    "brandy",
    "gin",
    "tequila",
    "caffeine",
    "energy drink",
  ];

  if (food.ingredients_text) {
    const ingredientsLower = food.ingredients_text.toLowerCase();
    for (const ingredient of unsafeIngredients) {
      if (ingredientsLower.includes(ingredient)) {
        return {
          isSafe: false,
          reason: `Contains ${ingredient}`,
        };
      }
    }
  }

  if (food.product_name) {
    const nameLower = food.product_name.toLowerCase();
    for (const term of unsafeIngredients) {
      if (nameLower.includes(term)) {
        return {
          isSafe: false,
          reason: `Product name indicates it may contain ${term}`,
        };
      }
    }
  }

  if (food.categories_tags && Array.isArray(food.categories_tags)) {
    const alcoholCategories = [
      "alcoholic-beverages",
      "wines",
      "beers",
      "spirits",
      "liquors",
      "energy-drinks",
    ];
    for (const category of food.categories_tags) {
      const categoryLower = category.toLowerCase();
      for (const alcoholCategory of alcoholCategories) {
        if (categoryLower.includes(alcoholCategory)) {
          return {
            isSafe: false,
            reason: `Product is categorized as ${alcoholCategory.replace(
              "-",
              " "
            )}`,
          };
        }
      }
    }
  }

  if (food.nutriments) {
    if (food.nutriments.caffeine && food.nutriments.caffeine > 30) {
      return {
        isSafe: false,
        reason: "Contains high levels of caffeine",
      };
    }

    if (food.nutriments.sugars && food.nutriments.sugars > 25) {
      return {
        isSafe: false,
        reason: "Contains very high levels of sugar",
      };
    }
  }

  if (food.alcohol_by_volume && food.alcohol_by_volume > 0) {
    return {
      isSafe: false,
      reason: `Contains ${food.alcohol_by_volume}% alcohol`,
    };
  }

  if (!food.ingredients_text && !food.categories_tags) {
    return {
      isSafe: false,
      reason: "Insufficient ingredient information",
    };
  }

  return { isSafe: true };
};
