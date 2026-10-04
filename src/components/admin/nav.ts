import {
  BadgePercent, FolderTree, LayoutDashboard, MessageSquareQuote, Package, Receipt, Settings, ShoppingCart, Truck, Users,
} from "lucide-react";

export const NAV_GROUPS = [
  {
    title: "الرئيسية",
    items: [{ href: "/admin", label: "لوحة التحكم والأرباح", kicker: "DASHBOARD", icon: LayoutDashboard }],
  },
  {
    title: "المتجر",
    items: [
      { href: "/admin/orders", label: "الطلبات", kicker: "ORDERS", icon: ShoppingCart },
      { href: "/admin/products", label: "المنتجات", kicker: "PRODUCTS", icon: Package },
      { href: "/admin/customers", label: "العملاء", kicker: "CUSTOMERS", icon: Users },
      { href: "/admin/categories", label: "الأقسام", kicker: "CATEGORIES", icon: FolderTree },
    ],
  },
  {
    title: "التسويق",
    items: [
      { href: "/admin/coupons", label: "أكواد الخصم", kicker: "COUPONS", icon: BadgePercent },
      { href: "/admin/testimonials", label: "آراء العملاء", kicker: "REVIEWS", icon: MessageSquareQuote },
    ],
  },
  {
    title: "الإدارة",
    items: [
      { href: "/admin/shipping", label: "الشحن والمحافظات", kicker: "SHIPPING", icon: Truck },
      { href: "/admin/expenses", label: "المصروفات", kicker: "EXPENSES", icon: Receipt },
      { href: "/admin/settings", label: "إعدادات الموقع", kicker: "SETTINGS", icon: Settings },
    ],
  },
];

export const NAV = NAV_GROUPS.flatMap((g) => g.items);

export const navFor = (pathname: string) =>
  NAV.find((n) => (n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href))) ?? NAV[0];
