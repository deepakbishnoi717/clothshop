export interface Product {
  id: string;
  name: string;
  price: string;
  category: "Shirts" | "Shoes" | "Accessories";
  image: string;
  sizes: string[];
  countInStock: number;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "VIP" | "Guest";
  whatsapp?: string;
  stylePreference?: string;
}

export interface Message {
  id: string;
  sender: "user" | "stylist";
  text: string;
  timestamp: Date;
}
