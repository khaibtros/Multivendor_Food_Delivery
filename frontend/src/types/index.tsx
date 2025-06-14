export interface Restaurant {
  _id: string;
  restaurantName: string;
  city: string;
  country: string;
  deliveryPrice: number;
  estimatedDeliveryTime: number;
  cuisines: string[];
  menuItems: MenuItem[];
  imageUrl?: string;
  status: "pending" | "approved" | "rejected";
  approvalNote?: string;
  approvedBy?: string;
  approvedAt?: Date;
  phoneNumber: string;
  totalOrders?: number;
  totalRevenue?: number;
  averageRating?: number;
  createdAt: Date;
  updatedAt: Date;
  addressLine1: string;
  street: string;
  ward: string;
  district: string;
  openingHours: {
    day: string;
    open: string;
    close: string;
  }[];
  isOpen: boolean;
  lastUpdated: Date;
  description?: string;
}

export interface RestaurantSearchResponse {
  data: Restaurant[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  toppings?: {
    categoryName: string;
    options: {
      name: string;
      price: number;
    }[];
  }[];
}

export interface Review {
  _id: string;
  user: User;
  restaurant: Restaurant;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "manager" | "admin";
  createdAt: Date;
}

export type OrderStatus = "placed" | "paid" | "inProgress" | "outForDelivery" | "delivered";

export interface Order {
  _id: string;
  restaurant: Restaurant;
  user: User;
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    street: string;
    ward: string;
    district: string;
    city: string;
    country: string;
  };
  cartItems: {
    menuItemId: string;
    quantity: number;
    name: string;
    price: number;
    toppings: {
      categoryName: string;
      selectedOption: {
        name: string;
        price: number;
      };
    }[];
    itemTotal: number;
  }[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
} 
