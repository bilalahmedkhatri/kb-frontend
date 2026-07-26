import type { Category } from "@/src/types";

export interface EnhancedCategory extends Category {
  image?: string;
}

export const categories: (Category & { image?: string })[] = [
  // Authentic Kiribati Handicrafts & Products
  { id: "cat-1", name: "Woven Fine Mats", slug: "woven-mats", icon: "HiSparkles", type: "product", count: 12, image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=300&q=80" },
  { id: "cat-2", name: "Pandanus Baskets", slug: "pandanus-baskets", icon: "HiShoppingBag", type: "product", count: 9, image: "https://images.unsplash.com/photo-1606744888344-493238951221?auto=format&fit=crop&w=300&q=80" },
  { id: "cat-3", name: "Seashell Jewelry", slug: "seashell-jewelry", icon: "HiSparkles", type: "product", count: 14, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=300&q=80" },
  { id: "cat-4", name: "Wood Carvings", slug: "wood-carvings", icon: "HiScissors", type: "product", count: 7, image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=300&q=80" },
  { id: "cat-5", name: "Coconut Crafts", slug: "coconut-crafts", icon: "HiCube", type: "product", count: 8, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=300&q=80" },

  // Kiribati Stays & Lodging
  { id: "cat-6", name: "Lagoon Eco-Lodges", slug: "eco-lodges", icon: "HiGlobeAmericas", type: "stay", count: 8, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80" },
  { id: "cat-7", name: "Atoll Homestays", slug: "homestays", icon: "HiHome", type: "stay", count: 10, image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=300&q=80" },
  { id: "cat-8", name: "Beachfront Cottages", slug: "villas", icon: "HiBuildingStorefront", type: "stay", count: 6, image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=300&q=80" },

  // Artisan Workshops & Cultural Guides
  { id: "cat-9", name: "Weaving Workshops", slug: "weaving-workshops", icon: "HiAcademicCap", type: "experience", count: 5, image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80" },
  { id: "cat-10", name: "Canoe Eco-Tours", slug: "canoe-tours", icon: "HiSun", type: "experience", count: 6, image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=300&q=80" },
  { id: "cat-11", name: "Island Culture", slug: "culture", icon: "HiBookOpen", type: "guide", count: 7, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=300&q=80" },
  { id: "cat-12", name: "Outer Atolls", slug: "outer-islands", icon: "HiMap", type: "guide", count: 5, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80" },
];

