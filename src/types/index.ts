export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  vendorId: string;
  vendorName: string;
  rating: number;
  reviewCount: number;
  stock: number;
  status: "active" | "pending" | "rejected" | "draft";
  description: string;
  origin: string;
  material: string;
  createdAt: string;
}

export interface Stay {
  id: string;
  name: string;
  location: string;
  island: string;
  pricePerNight: number;
  currency: string;
  images: string[];
  hostId: string;
  hostName: string;
  rating: number;
  reviewCount: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  type: "homestay" | "eco-lodge" | "villa" | "guesthouse";
  amenities: string[];
  description: string;
  status: "active" | "pending" | "rejected" | "draft";
  createdAt: string;
}

export interface Guide {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  topic: string;
  authorId: string;
  authorName: string;
  readTime: number;
  publishedAt: string;
  featured: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: "customer" | "vendor" | "admin";
  bio?: string;
  location?: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  currency: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shippingAddress: Address;
  deliveryFee?: number;
  shippingFee?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  stayId: string;
  stayName: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: "inquiry" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

export interface CartItem {
  id: string;
  type: "product" | "stay";
  name: string;
  price: number;
  quantity: number;
  image: string;
  vendorName?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export interface Review {
  id: string;
  targetId: string;
  targetType: "product" | "stay";
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  type?: "product" | "stay" | "experience" | "guide";
  count?: number;
  itemCount?: number;
  image?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export interface FilterState {
  search?: string;
  categories?: string[];
  priceRange?: [number, number];
  sort?: "newest" | "price-asc" | "price-desc" | "rating" | string;
  island?: string;
  guests?: number;
  checkIn?: string;
  checkOut?: string;
  type?: string;
  topic?: string;
}
