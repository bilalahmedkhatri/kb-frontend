import type { Order } from "@/src/types";

export const orders: Order[] = [
  {
    id: "ORD-2024-001",
    userId: "u-1",
    items: [
      { productId: "p-1", productName: "Tebwa Shell Necklace", productImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80", price: 45, quantity: 2 },
      { productId: "p-6", productName: "Tropical Fish Earrings", productImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80", price: 28, quantity: 1 },
      { productId: "p-1", productName: "Tebwa Shell Necklace", productImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80", price: 45, quantity: 2 },
      { productId: "p-6", productName: "Tropical Fish Earrings", productImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80", price: 28, quantity: 1 }
    ],
    total: 118,
    currency: "AUD",
    status: "delivered",
    shippingAddress: { fullName: "John Smith", street: "123 Main St", city: "Sydney", state: "NSW", zip: "2000", country: "Australia", phone: "+6125550101" },
    createdAt: "2024-03-01T10:15:00Z",
    updatedAt: "2024-03-15T14:20:00Z"
  },
  {
    id: "ORD-2024-002",
    userId: "u-1",
    items: [
      { productId: "p-3", productName: "Maneaba Spirit Carving", productImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80", price: 120, quantity: 1 }
    ],
    total: 120,
    currency: "AUD",
    status: "shipped",
    shippingAddress: { fullName: "John Smith", street: "123 Main St", city: "Sydney", state: "NSW", zip: "2000", country: "Australia", phone: "+6125550101" },
    createdAt: "2024-05-10T08:30:00Z",
    updatedAt: "2024-05-12T11:45:00Z"
  },
  {
    id: "ORD-2024-003",
    userId: "u-1",
    items: [
      { productId: "p-2", productName: "Pandanus Weave Bag", productImage: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=400&q=80", price: 65, quantity: 1 },
      { productId: "p-22", productName: "Sunset Dye Scarf", productImage: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=400&q=80", price: 55, quantity: 2 }
    ],
    total: 175,
    currency: "AUD",
    status: "confirmed",
    shippingAddress: { fullName: "John Smith", street: "123 Main St", city: "Sydney", state: "NSW", zip: "2000", country: "Australia", phone: "+6125550101" },
    createdAt: "2024-06-01T14:10:00Z",
    updatedAt: "2024-06-01T14:10:00Z"
  },
  {
    id: "ORD-2024-004",
    userId: "u-1",
    items: [
      { productId: "p-12", productName: "Frigatebird Wood Sculpture", productImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80", price: 150, quantity: 1 },
      { productId: "p-19", productName: "Miniature Outrigger Canoe", productImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80", price: 85, quantity: 1 }
    ],
    total: 235,
    currency: "AUD",
    status: "pending",
    shippingAddress: { fullName: "John Smith", street: "123 Main St", city: "Sydney", state: "NSW", zip: "2000", country: "Australia", phone: "+6125550101" },
    createdAt: "2024-07-01T09:00:00Z",
    updatedAt: "2024-07-01T09:00:00Z"
  },
  {
    id: "ORD-2024-005",
    userId: "u-1",
    items: [
      { productId: "p-5", productName: "Coral Stone Bowl", productImage: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=400&q=80", price: 80, quantity: 1 }
    ],
    total: 80,
    currency: "AUD",
    status: "delivered",
    shippingAddress: { fullName: "John Smith", street: "123 Main St", city: "Sydney", state: "NSW", zip: "2000", country: "Australia", phone: "+6125550101" },
    createdAt: "2024-04-20T11:20:00Z",
    updatedAt: "2024-05-01T16:00:00Z"
  },
  {
    id: "ORD-2024-006",
    userId: "u-1",
    items: [
      { productId: "p-25", productName: "Coral Reef Canvas Painting", productImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80", price: 110, quantity: 1 }
    ],
    total: 110,
    currency: "AUD",
    status: "shipped",
    shippingAddress: { fullName: "John Smith", street: "123 Main St", city: "Sydney", state: "NSW", zip: "2000", country: "Australia", phone: "+6125550101" },
    createdAt: "2024-06-15T15:45:00Z",
    updatedAt: "2024-06-16T09:30:00Z"
  },
  {
    id: "ORD-2024-007",
    userId: "u-1",
    items: [
      { productId: "p-9", productName: "Coconut Shell Candle Set", productImage: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=400&q=80", price: 25, quantity: 3 }
    ],
    total: 75,
    currency: "AUD",
    status: "delivered",
    shippingAddress: { fullName: "John Smith", street: "123 Main St", city: "Sydney", state: "NSW", zip: "2000", country: "Australia", phone: "+6125550101" },
    createdAt: "2024-02-10T12:00:00Z",
    updatedAt: "2024-02-20T14:30:00Z"
  },
  {
    id: "ORD-2024-008",
    userId: "u-1",
    items: [
      { productId: "p-17", productName: "Ocean Pearl Pendant", productImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80", price: 95, quantity: 1 }
    ],
    total: 95,
    currency: "AUD",
    status: "confirmed",
    shippingAddress: { fullName: "John Smith", street: "123 Main St", city: "Sydney", state: "NSW", zip: "2000", country: "Australia", phone: "+6125550101" },
    createdAt: "2024-06-25T16:20:00Z",
    updatedAt: "2024-06-25T16:20:00Z"
  },
  {
    id: "ORD-2024-009",
    userId: "u-1",
    items: [
      { productId: "p-4", productName: "Handwoven Floor Mat (Kie n Kiribati)", productImage: "https://images.unsplash.com/photo-1606744888344-493238951221?auto=format&fit=crop&w=400&q=80", price: 220, quantity: 1 }
    ],
    total: 220,
    currency: "AUD",
    status: "pending",
    shippingAddress: { fullName: "John Smith", street: "123 Main St", city: "Sydney", state: "NSW", zip: "2000", country: "Australia", phone: "+6125550101" },
    createdAt: "2024-07-10T11:00:00Z",
    updatedAt: "2024-07-10T11:00:00Z"
  },
  {
    id: "ORD-2024-010",
    userId: "u-1",
    items: [
      { productId: "p-8", productName: "Atoll Shell Chime", productImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80", price: 40, quantity: 2 },
      { productId: "p-11", productName: "Lagoon Coconut Bowl Set", productImage: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=400&q=80", price: 35, quantity: 1 }
    ],
    total: 115,
    currency: "AUD",
    status: "cancelled",
    shippingAddress: { fullName: "John Smith", street: "123 Main St", city: "Sydney", state: "NSW", zip: "2000", country: "Australia", phone: "+6125550101" },
    createdAt: "2024-01-15T09:45:00Z",
    updatedAt: "2024-01-16T10:00:00Z"
  },
  {
    id: "ORD-2024-011",
    userId: "u-1",
    items: [
      { productId: "p-14", productName: "Traditional Kiribati Woven Fan", productImage: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=400&q=80", price: 32, quantity: 2 }
    ],
    total: 64,
    currency: "AUD",
    status: "delivered",
    shippingAddress: { fullName: "John Smith", street: "123 Main St", city: "Sydney", state: "NSW", zip: "2000", country: "Australia", phone: "+6125550101" },
    createdAt: "2024-03-22T13:15:00Z",
    updatedAt: "2024-04-02T10:00:00Z"
  },
  {
    id: "ORD-2024-012",
    userId: "u-1",
    items: [
      { productId: "p-20", productName: "Polynesian Driftwood Mirror", productImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=80", price: 180, quantity: 1 }
    ],
    total: 180,
    currency: "AUD",
    status: "shipped",
    shippingAddress: { fullName: "John Smith", street: "123 Main St", city: "Sydney", state: "NSW", zip: "2000", country: "Australia", phone: "+6125550101" },
    createdAt: "2024-07-15T17:30:00Z",
    updatedAt: "2024-07-16T08:20:00Z"
  },
  {
    id: "ORD-2024-013",
    userId: "u-2",
    items: [
      { productId: "p-2", productName: "Pandanus Weave Bag", productImage: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=400&q=80", price: 65, quantity: 1 }
    ],
    total: 65,
    currency: "AUD",
    status: "confirmed",
    shippingAddress: { fullName: "Sarah Jones", street: "456 Ocean Ave", city: "Brisbane", state: "QLD", zip: "4000", country: "Australia", phone: "+6175550102" },
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2024-06-01T10:00:00Z"
  },
  {
    id: "ORD-2024-014",
    userId: "u-3",
    items: [
      { productId: "p-12", productName: "Frigatebird Sculpture", productImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80", price: 150, quantity: 1 }
    ],
    total: 150,
    currency: "AUD",
    status: "pending",
    shippingAddress: { fullName: "Mike Chen", street: "789 Harbor Rd", city: "Melbourne", state: "VIC", zip: "3000", country: "Australia", phone: "+6135550103" },
    createdAt: "2024-07-01T09:00:00Z",
    updatedAt: "2024-07-01T09:00:00Z"
  },
  {
    id: "ORD-2024-015",
    userId: "u-4",
    items: [
      { productId: "p-5", productName: "Coral Stone Bowl", productImage: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=400&q=80", price: 80, quantity: 1 }
    ],
    total: 80,
    currency: "AUD",
    status: "delivered",
    shippingAddress: { fullName: "Emma Wilson", street: "321 Beachfront Pde", city: "Perth", state: "WA", zip: "6000", country: "Australia", phone: "+6185550104" },
    createdAt: "2024-04-20T11:00:00Z",
    updatedAt: "2024-05-01T16:00:00Z"
  }
];
