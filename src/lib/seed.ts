import type { Category, DB, Product, ShippingZone } from "./types";

const img = (n: number) => `/products/p${String(n).padStart(2, "0")}.webp`;

const C = {
  teal: { name: "زمردي", hex: "#0F5257" },
  red: { name: "أحمر", hex: "#D9152B" },
  sage: { name: "أخضر نعناعي", hex: "#8FB5A6" },
  mauve: { name: "موف", hex: "#A88591" },
  purple: { name: "بنفسجي", hex: "#4B2367" },
  blue: { name: "لبني", hex: "#9DB7DD" },
  babyBlue: { name: "بيبي بلو", hex: "#BFD8F2" },
  peach: { name: "خوخي", hex: "#F7B9A2" },
  orange: { name: "برتقالي", hex: "#F27A1A" },
  mint: { name: "فستقي", hex: "#CDE8B4" },
  white: { name: "أوف وايت", hex: "#F7F3EC" },
  black: { name: "أسود", hex: "#141414" },
  lilac: { name: "ليلكي", hex: "#B79AE0" },
  green: { name: "زيتي", hex: "#7FA07A" },
  pink: { name: "بينك", hex: "#F4A6C1" },
  fuchsia: { name: "فوشيا", hex: "#E6197E" },
  grey: { name: "رمادي أزرق", hex: "#8E9BB5" },
  wine: { name: "نبيتي", hex: "#7A1428" },
  rose: { name: "روز", hex: "#E8B4B8" },
};

export const categories: Category[] = [
  { id: "cat-pajamas", slug: "pajamas", name: "بيجامات ستان", description: "نعومة الستان مع لمسة دانتيل راقية", image: img(4), order: 1, active: true },
  { id: "cat-robes", slug: "robe-sets", name: "أطقم روب", description: "أطقم ٣ قطع بروب أنيق لكل يوم", image: img(5), order: 2, active: true },
  { id: "cat-bridal", slug: "bridal", name: "قمصان نوم وعرايس", description: "تشكيلة العروسة الأفخم", image: img(3), order: 3, active: true },
  { id: "cat-shorts", slug: "short-sets", name: "أطقم شورت", description: "خفيفة ومريحة للصيف", image: img(25), order: 4, active: true },
  { id: "cat-beauty", slug: "beauty", name: "برفانات وعناية", description: "بوكسات هدايا Rawshna", image: img(40), order: 5, active: true },
];

type Seed = Omit<Product, "id" | "slug" | "createdAt" | "active" | "stock"> & { stock?: number };

const seeds: Seed[] = [
  { name: "بيجامة ستان دانتيل بنطلون", model: "2113", categoryId: "cat-pajamas", price: 850, comparePrice: 1050, cost: 480, images: [img(1), img(4), img(29), img(22), img(24)], colors: [C.teal, C.red, C.sage, C.mauve], sizes: ["M", "L", "XL", "2XL"], description: "بيجامة ستان لامع بظهر دانتيل ورد وأزرار أمامية، مع بنطلون مشجّر واسع بفيونكة جانبية. خامة ناعمة على البشرة وتصميم يليق بيكي.", featured: true, isNew: true },
  { name: "طقم ستان دانتيل شورت", model: "2112", categoryId: "cat-shorts", price: 690, comparePrice: 820, cost: 380, images: [img(19), img(31), img(33)], colors: [C.purple, C.blue, C.mauve], sizes: ["M", "L", "XL"], description: "توب ستان بظهر دانتيل وشورت مشجّر بحواف ملونة. خفيف ومثالي للصيف.", featured: true, isNew: false },
  { name: "طقم ريب دانتيل شورت كشكشة", model: "9361", categoryId: "cat-shorts", price: 520, cost: 260, images: [img(2), img(16), img(32), img(39), img(41)], colors: [C.peach, C.orange, C.mint, C.babyBlue], sizes: ["Free Size"], description: "توب ريب قطن بحمالات دانتيل وشورت أبيض بوسط كشكشة وفيونكة. راحة ونعومة طول اليوم.", featured: true, isNew: true },
  { name: "طقم عروسة قميص وروب ستان", model: "2304", categoryId: "cat-bridal", price: 1650, comparePrice: 1950, cost: 900, images: [img(3), img(15), img(37), img(43)], colors: [C.white, C.red, C.black], sizes: ["M", "L", "XL", "2XL"], description: "قميص نوم ستان طويل بصدر مبطن ودانتيل، مع روب أكمام واسعة وحزام. اختيار كل عروسة.", featured: true, isNew: true },
  { name: "طقم روب ٣ قطع ريب مشجّر", model: "2297", categoryId: "cat-robes", price: 1150, comparePrice: 1350, cost: 620, images: [img(5), img(18), img(28), img(36), img(38), img(42)], colors: [C.red, C.orange, C.lilac, C.green, C.black], sizes: ["M", "L", "XL", "2XL"], description: "توب ريب بدانتيل وبنطلون مع روب أبيض مشجّر بحواف ملونة. ٣ قطع بتصميم واحد متناسق.", featured: true, isNew: false },
  { name: "طقم روب كم كلوش ٣ قطع", model: "2201", categoryId: "cat-robes", price: 1250, cost: 680, images: [img(6)], colors: [C.white, C.pink, C.babyBlue], sizes: ["M", "L", "XL"], description: "روب بأكمام كلوش دانتيل وطقم شورت ناعم. أنوثة في كل تفصيلة.", featured: false, isNew: true },
  { name: "بيجامة قطن مشجّرة كلاسيك", model: "2200", categoryId: "cat-pajamas", price: 640, cost: 330, images: [img(7)], colors: [C.babyBlue, C.white], sizes: ["M", "L", "XL", "2XL"], description: "بيجامة قطن قميص بزراير وبنطلون بطبعة ورد ناعمة.", featured: false, isNew: false },
  { name: "طقم قطيفة بالريش", model: "2134", categoryId: "cat-robes", price: 1450, cost: 780, images: [img(8)], colors: [C.wine], sizes: ["M", "L", "XL"], description: "طقم قطيفة فاخر بأطراف ريش وحزام. فخامة شتوية.", featured: true, isNew: true },
  { name: "طقم كامي ستان سادة", model: "2026", categoryId: "cat-pajamas", price: 720, cost: 390, images: [img(9)], colors: [C.grey, C.rose, C.pink], sizes: ["M", "L", "XL"], description: "توب ستان بحمالات وبنطلون واسع بألوان هادية.", featured: false, isNew: false },
  { name: "طقم ستان صدر مبطن شورت", model: "2097", categoryId: "cat-shorts", price: 780, cost: 410, images: [img(10)], colors: [C.lilac, C.white], sizes: ["M", "L", "XL"], description: "توب بصدر مبطن وكشكشة وشورت مشجّر.", featured: false, isNew: true },
  { name: "طقم كامي دانتيل بنطلون مشجّر", model: "10002", categoryId: "cat-pajamas", price: 690, cost: 350, images: [img(11)], colors: [C.peach, C.black, C.wine], sizes: ["M", "L", "XL"], description: "كامي بدانتيل على الصدر وبنطلون مشجّر خفيف.", featured: false, isNew: false },
  { name: "طقم روب ستان ٣ قطع", model: "2056", categoryId: "cat-robes", price: 1350, cost: 720, images: [img(12)], colors: [C.teal, C.red, C.orange, C.black], sizes: ["M", "L", "XL", "2XL"], description: "روب ستان طويل مع توب دانتيل وبنطلون.", featured: true, isNew: false },
  { name: "طقم روب شيفون شورت", model: "2178", categoryId: "cat-robes", price: 990, cost: 520, images: [img(13)], colors: [C.white, C.pink, C.babyBlue], sizes: ["M", "L", "XL"], description: "روب شيفون بأكمام كلوش وطقم شورت ستان.", featured: false, isNew: false },
  { name: "طقم ستان بنطلون واسع", model: "2223", categoryId: "cat-pajamas", price: 790, cost: 420, images: [img(14)], colors: [C.orange, C.purple, C.blue, C.pink], sizes: ["M", "L", "XL"], description: "كامي ستان وبنطلون واسع لامع.", featured: false, isNew: true },
  { name: "روب عروسة تول بالريش", model: "2301", categoryId: "cat-bridal", price: 1850, cost: 1000, images: [img(17), img(21)], colors: [C.white], sizes: ["Free Size"], description: "روب تول طويل بأطراف ريش ودانتيل، مثالي لليلة العمر.", featured: true, isNew: true },
  { name: "طقم صيفي فيونكات شورت", model: "2299", categoryId: "cat-shorts", price: 560, cost: 280, images: [img(25), img(23), img(26), img(27), img(34), img(35)], colors: [C.pink, C.red, C.babyBlue, C.fuchsia, C.grey], sizes: ["Free Size"], description: "توب بحمالات فيونكة وشورت مشجّر بحواف ملونة. خفيف وكيوت.", featured: true, isNew: true },
  { name: "بوكس هدية Rawshna Floria", model: "R-01", categoryId: "cat-beauty", price: 950, cost: 520, images: [img(40), img(20)], colors: [], sizes: [], description: "بوكس هدية فيه برفان وبادي سبلاش ولوشن بريحة الورد.", featured: false, isNew: true },
  { name: "بوكس Rawshna Ocean", model: "R-02", categoryId: "cat-beauty", price: 950, cost: 520, images: [img(30)], colors: [], sizes: [], description: "بوكس هدية بالريحة المنعشة الزرقاء.", featured: false, isNew: false },
];

const slugify = (s: string, i: number) => `zona-${s.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${i}`;

export const products: Product[] = seeds.map((s, i) => ({
  ...s,
  id: `p-${i + 1}`,
  slug: slugify(s.model, i + 1),
  stock: s.stock ?? 25,
  active: true,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

const govs: [string, number, string][] = [
  ["القاهرة", 60, "1-2 يوم"], ["الجيزة", 60, "1-2 يوم"], ["القليوبية", 70, "2-3 أيام"],
  ["الإسكندرية", 75, "2-3 أيام"], ["الشرقية", 75, "2-3 أيام"], ["الدقهلية", 75, "2-3 أيام"],
  ["الغربية", 75, "2-3 أيام"], ["المنوفية", 75, "2-3 أيام"], ["البحيرة", 80, "2-4 أيام"],
  ["كفر الشيخ", 80, "2-4 أيام"], ["دمياط", 80, "2-4 أيام"], ["بورسعيد", 80, "2-4 أيام"],
  ["الإسماعيلية", 80, "2-4 أيام"], ["السويس", 80, "2-4 أيام"], ["الفيوم", 85, "3-4 أيام"],
  ["بني سويف", 85, "3-4 أيام"], ["المنيا", 90, "3-5 أيام"], ["أسيوط", 95, "3-5 أيام"],
  ["سوهاج", 100, "3-5 أيام"], ["قنا", 100, "4-6 أيام"], ["الأقصر", 105, "4-6 أيام"],
  ["أسوان", 110, "4-6 أيام"], ["البحر الأحمر", 120, "4-7 أيام"], ["مطروح", 120, "4-7 أيام"],
  ["الوادي الجديد", 130, "5-7 أيام"], ["شمال سيناء", 130, "5-7 أيام"], ["جنوب سيناء", 130, "5-7 أيام"],
];

export const shipping: ShippingZone[] = govs.map(([governorate, fee, days], i) => ({
  id: `sh-${i + 1}`,
  governorate,
  fee,
  days,
  active: true,
}));

export function createSeed(): DB {
  return {
    products,
    categories,
    shipping,
    orders: [],
    customers: [],
    coupons: [
      { id: "cp-1", code: "ZONA10", type: "percent", value: 10, minOrder: 500, usageLimit: 500, used: 0, active: true },
      { id: "cp-2", code: "BRIDE200", type: "fixed", value: 200, minOrder: 2000, usageLimit: 100, used: 0, active: true },
    ],
    testimonials: [
      { id: "t-1", name: "سارة محمد", city: "القاهرة", text: "الخامة تجنن والستان ناعم جدًا، والطقم جه زي الصور بالظبط. أكيد هطلب تاني 💗", rating: 5, active: true },
      { id: "t-2", name: "منة أحمد", city: "الإسكندرية", text: "اشتريت طقم العروسة وكان أشيك حاجة في الجهاز كله، والتغليف هدية لوحده.", rating: 5, active: true },
      { id: "t-3", name: "ندى خالد", city: "المنصورة", text: "الشحن وصل في يومين والمقاس مظبوط. التعامل محترم جدًا.", rating: 5, active: true },
      { id: "t-4", name: "ياسمين علي", city: "طنطا", text: "الألوان حقيقية وزي الصور، وطقم الروب التلات قطع يستاهل كل جنيه.", rating: 4, active: true },
    ],
    expenses: [],
    settings: {
      storeName: "ZONA",
      tagline: "لانجري وبيجامات حريمي بلمسة فخامة",
      announcement: "شحن لكل محافظات مصر 🚚 • الدفع عند الاستلام • خصم 10% بكود ZONA10",
      heroTitle: "نعومة تليق بيكي",
      heroSubtitle: "بيجامات ستان، أطقم روب وتشكيلة العرايس — خامات فاخرة وتفاصيل دانتيل مصممة عشانك.",
      heroImages: [img(4), img(3), img(5), img(25)],
      aboutText: "ZONA براند مصري متخصص في اللانجري والبيجامات الحريمي. بنختار خاماتنا بعناية، من الستان الناعم للريب القطن، عشان كل قطعة تحسسك بالراحة والثقة.",
      whatsapp: "201000000000",
      phone: "01000000000",
      email: "hello@zona-store.com",
      instagram: "https://instagram.com/",
      facebook: "https://facebook.com/",
      tiktok: "https://tiktok.com/",
      freeShippingThreshold: 2500,
      instapay: "zona@instapay",
      vodafoneCash: "01000000000",
      returnDays: 14,
      videos: ["/videos/v1.mp4", "/videos/v2.mp4", "/videos/v3.mp4", "/videos/v4.mp4"],
    },
  };
}
