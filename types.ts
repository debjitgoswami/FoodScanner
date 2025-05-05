// types.ts

export interface Nutriments {
  'energy-kcal_100g'?: number;
  fat_100g?: number;
  carbohydrates_100g?: number;
  proteins_100g?: number;
  salt_100g?: number;
  sugars_100g?: number;
  [key: string]: number | undefined;
}

export interface Product {
  code: string;
  product_name: string;
  quantity?: string;

  image_url?: string;
  image_front_url?: string;
  image_small_url?: string;
  image_front_small_url?: string;

  brands?: string;
  ingredients_text?: string;

  nutriments?: Nutriments;

  nutrition_grades?: string;
  nutrition_grades_tags?: string[];
}
