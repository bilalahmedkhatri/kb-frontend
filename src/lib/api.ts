import {
  products,
  stays,
  guides,
  categories,
  vendors,
  users,
  reviews,
  orders,
} from "@/src/data";

import type {
  Product,
  Stay,
  Guide,
  User,
  Order,
  Review,
  Category,
  PaginatedResponse,
  FilterState,
} from "@/src/types";

const SIMULATED_DELAY = 200;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): PaginatedResponse<T> {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = items.slice(start, end);
  return {
    data,
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
  };
}

function filterProducts(
  items: Product[],
  filters: Partial<FilterState>
): Product[] {
  let result = [...items];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.vendorName.toLowerCase().includes(q)
    );
  }

  if (filters.categories && filters.categories.length > 0) {
    result = result.filter((p) => filters.categories!.includes(p.category));
  }

  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    result = result.filter((p) => p.price >= min && p.price <= max);
  }

  if (filters.sort) {
    switch (filters.sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }
  }

  return result;
}

function filterStays(
  items: Stay[],
  filters: Partial<FilterState>
): Stay[] {
  let result = [...items];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q)
    );
  }

  if (filters.categories && filters.categories.length > 0) {
    result = result.filter((s) =>
      filters.categories!.includes(s.type)
    );
  }

  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    result = result.filter(
      (s) => s.pricePerNight >= min && s.pricePerNight <= max
    );
  }

  if (filters.sort) {
    switch (filters.sort) {
      case "price-asc":
        result.sort((a, b) => a.pricePerNight - b.pricePerNight);
        break;
      case "price-desc":
        result.sort((a, b) => b.pricePerNight - a.pricePerNight);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
        break;
    }
  }

  return result;
}

function filterGuides(
  items: Guide[],
  filters: Partial<FilterState>
): Guide[] {
  let result = [...items];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.excerpt.toLowerCase().includes(q)
    );
  }

  if (filters.categories && filters.categories.length > 0) {
    result = result.filter((g) =>
      filters.categories!.includes(g.topic)
    );
  }

  return result;
}

export const api = {
  async getCategories(type?: string): Promise<Category[]> {
    await delay(SIMULATED_DELAY);
    if (type) return categories.filter((c) => c.type === type);
    return categories;
  },

  async getProducts(params?: {
    page?: number;
    pageSize?: number;
    filters?: Partial<FilterState>;
  }): Promise<PaginatedResponse<Product>> {
    await delay(SIMULATED_DELAY);
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 10;
    const filtered = filterProducts(products, params?.filters ?? {});
    return paginate(filtered, page, pageSize);
  },

  async getProduct(id: string): Promise<Product | undefined> {
    await delay(SIMULATED_DELAY);
    return products.find((p) => p.id === id);
  },

  async getFeaturedProducts(): Promise<Product[]> {
    await delay(SIMULATED_DELAY);
    return products.filter((p) => p.status === "active").slice(0, 8);
  },

  async getStays(params?: {
    page?: number;
    pageSize?: number;
    filters?: Partial<FilterState>;
  }): Promise<PaginatedResponse<Stay>> {
    await delay(SIMULATED_DELAY);
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 10;
    const filtered = filterStays(stays, params?.filters ?? {});
    return paginate(filtered, page, pageSize);
  },

  async getStay(id: string): Promise<Stay | undefined> {
    await delay(SIMULATED_DELAY);
    return stays.find((s) => s.id === id);
  },

  async getFeaturedStays(): Promise<Stay[]> {
    await delay(SIMULATED_DELAY);
    return stays.filter((s) => s.status === "active").slice(0, 8);
  },

  async getGuides(params?: {
    page?: number;
    pageSize?: number;
    filters?: Partial<FilterState>;
  }): Promise<PaginatedResponse<Guide>> {
    await delay(SIMULATED_DELAY);
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 10;
    const filtered = filterGuides(guides, params?.filters ?? {});
    return paginate(filtered, page, pageSize);
  },

  async getGuide(slug: string): Promise<Guide | undefined> {
    await delay(SIMULATED_DELAY);
    return guides.find((g) => g.slug === slug);
  },

  async getFeaturedGuides(): Promise<Guide[]> {
    await delay(SIMULATED_DELAY);
    return guides.filter((g) => g.featured).slice(0, 4);
  },

  async getReviews(
    targetId: string,
    targetType: "product" | "stay"
  ): Promise<Review[]> {
    await delay(SIMULATED_DELAY);
    return reviews.filter(
      (r) => r.targetId === targetId && r.targetType === targetType
    );
  },

  async getVendor(id: string): Promise<User | undefined> {
    await delay(SIMULATED_DELAY);
    return vendors.find((v) => v.id === id);
  },

  async getVendorProducts(vendorId: string): Promise<Product[]> {
    await delay(SIMULATED_DELAY);
    return products.filter((p) => p.vendorId === vendorId);
  },

  async getUser(id: string): Promise<User | undefined> {
    await delay(SIMULATED_DELAY);
    return users.find((u) => u.id === id);
  },

  async getOrders(userId?: string): Promise<Order[]> {
    await delay(SIMULATED_DELAY);
    if (userId) return orders.filter((o) => o.userId === userId);
    return orders;
  },

  async getOrder(id: string): Promise<Order | undefined> {
    await delay(SIMULATED_DELAY);
    return orders.find((o) => o.id === id);
  },
};
