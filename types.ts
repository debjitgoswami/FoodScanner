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
  nutrition_grades?: string;
  nutrition_grades_tags?: string[];
  nutriscore_grade?: string;
  categories_tags?: string[];

  nutriments?: {
    caffeine?: number;
    sugars?: number;
    [key: string]: any;
  };

  alcohol_by_volume?: number;

  [key: string]: any; // For any other dynamic properties
}

