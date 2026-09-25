import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  real,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  qty: number;
  image: string;
}

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 140 }).notNull().unique(),
  name: text("name").notNull(),
  category: varchar("category", { length: 60 }).notNull(),
  price: integer("price").notNull(), // تومان
  oldPrice: integer("old_price"),
  shortDesc: text("short_desc").notNull(),
  description: text("description").notNull(),
  features: jsonb("features").$type<string[]>().notNull(),
  images: jsonb("images").$type<string[]>().notNull(),
  rating: real("rating").notNull().default(4.5),
  reviewCount: integer("review_count").notNull().default(0),
  stock: integer("stock").notNull().default(10),
  badge: varchar("badge", { length: 40 }),
  isNew: boolean("is_new").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  author: text("author").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  customerName: text("customer_name").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: text("email"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  postalCode: varchar("postal_code", { length: 20 }),
  note: text("note"),
  items: jsonb("items").$type<OrderItem[]>().notNull(),
  subtotal: integer("subtotal").notNull(),
  shipping: integer("shipping").notNull().default(0),
  total: integer("total").notNull(),
  status: varchar("status", { length: 30 }).notNull().default("در حال پردازش"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: varchar("phone", { length: 20 }),
  role: varchar("role", { length: 20 }).notNull().default("member"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 60 }).notNull().unique(),
  description: text("description"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export interface CourseFooterItem {
  label: string;
  value: string;
}

export interface CourseSocial {
  network: "instagram" | "telegram" | "whatsapp" | "site" | "phone";
  url: string;
  label?: string;
}

export const siteCourses = pgTable("site_courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  shortDesc: text("short_desc").notNull(),
  fullDesc: text("full_desc").notNull().default(""),
  icon: varchar("icon", { length: 40 }).notNull().default("Sparkles"),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  galleryMode: varchar("gallery_mode", { length: 20 }).notNull().default("featured"),
  layout: varchar("layout", { length: 20 }).notNull().default("image-right"),
  cardSize: varchar("card_size", { length: 20 }).notNull().default("default"),
  titleColor: varchar("title_color", { length: 20 }),
  textColor: varchar("text_color", { length: 20 }),
  accentColor: varchar("accent_color", { length: 20 }),
  titleSize: varchar("title_size", { length: 10 }).notNull().default("md"),
  bodySize: varchar("body_size", { length: 10 }).notNull().default("md"),
  bodyAlign: varchar("body_align", { length: 10 }).notNull().default("right"),
  footerItems: jsonb("footer_items").$type<CourseFooterItem[]>().notNull().default([]),
  socials: jsonb("socials").$type<CourseSocial[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteTestimonials = pgTable("site_testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  role: text("role"),
  text: text("text").notNull(),
  rating: integer("rating").notNull().default(5),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 60 }).notNull().unique(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
