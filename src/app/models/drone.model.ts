export interface Drone {
  _id?: string;
  id: string;
  name: string;
  model: string;
  price: number;
  description: string;
  images: string[];
  type: 'venta' | 'alquiler';
  condition: 'nuevo' | 'usado';
  location: string;
  contact: string;
  categories: string[]; 
  sellerId: string;
  createdAt?: Date;
  ratings?: Array<{ userId: string; rating: number; comment: string }>;
  status?: 'disponible' | 'vendido';
}
