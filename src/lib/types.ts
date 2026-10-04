export type ColorOption = { name: string; hex: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  model: string;
  description: string;
  categoryId: string;
  price: number;
  comparePrice?: number;
  cost: number;
  images: string[];
  colors: ColorOption[];
  sizes: string[];
  stock: number;
  featured: boolean;
  isNew: boolean;
  active: boolean;
  createdAt: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  order: number;
  active: boolean;
};

export type ShippingZone = {
  id: string;
  governorate: string;
  fee: number;
  days: string;
  active: boolean;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentMethod = "cod" | "instapay" | "vodafone_cash";

export type OrderItem = {
  productId: string;
  name: string;
  model: string;
  image: string;
  price: number;
  cost: number;
  qty: number;
  color?: string;
  size?: string;
};

export type Order = {
  id: string;
  number: string;
  customerId?: string;
  customer: {
    name: string;
    phone: string;
    phone2?: string;
    governorate: string;
    city: string;
    address: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  stockRestored?: boolean;
  history: { status: OrderStatus; at: string; note?: string }[];
  createdAt: string;
};

export type Coupon = {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrder: number;
  usageLimit: number;
  used: number;
  expiresAt?: string;
  active: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  city: string;
  text: string;
  rating: number;
  active: boolean;
};

export type Expense = {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
};

export type Settings = {
  storeName: string;
  tagline: string;
  announcement: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImages: string[];
  aboutText: string;
  whatsapp: string;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  snapchat?: string;
  youtube?: string;
  x?: string;
  telegram?: string;
  freeShippingThreshold: number;
  instapay: string;
  vodafoneCash: string;
  returnDays: number;
  videos: string[];
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  passwordHash: string;
  address?: { governorate: string; city: string; address: string };
  createdAt: string;
  lastLoginAt?: string;
};

export type PublicCustomer = Omit<Customer, "passwordHash">;

export type DB = {
  products: Product[];
  customers: Customer[];
  categories: Category[];
  shipping: ShippingZone[];
  orders: Order[];
  coupons: Coupon[];
  testimonials: Testimonial[];
  expenses: Expense[];
  settings: Settings;
};

export type CollectionName = Exclude<keyof DB, "settings">;
