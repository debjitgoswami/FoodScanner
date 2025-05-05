// constants/dummyData.ts

export interface DummyFood {
  id: string;
  code: string;
  product_name: string;
  image_url: string;
}

export const dummyFoods: DummyFood[] = [
  {
    id: '1',
    code: '0123456789123',
    product_name: 'Organic Apple',
    image_url: 'https://via.placeholder.com/100',
  },
  {
    id: '2',
    code: '0987654321098',
    product_name: 'Banana',
    image_url: 'https://via.placeholder.com/100',
  },
  {
    id: '3',
    code: '1234509876543',
    product_name: 'Carrot Sticks',
    image_url: 'https://via.placeholder.com/100',
  },
];
