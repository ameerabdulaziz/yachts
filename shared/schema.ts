import { sql, relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table - matching actual database schema
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phone: varchar("phone", { length: 20 }).unique(),
  email: varchar("email"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { length: 20 }).default("renter"), // renter, owner, both
  isVerified: boolean("is_verified").default(false),
  fuelWalletBalance: decimal("fuel_wallet_balance", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Yachts table
export const yachts = pgTable("yachts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  location: varchar("location", { length: 255 }).notNull(),
  pricePerDay: decimal("price_per_day", { precision: 10, scale: 2 }).notNull(),
  capacity: integer("capacity").notNull(),
  cabins: integer("cabins").notNull(),
  length: decimal("length", { precision: 5, scale: 2 }), // in feet
  yearBuilt: integer("year_built"),
  images: text("images").array(),
  amenities: text("amenities").array(),
  ownerId: varchar("owner_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  yachtId: varchar("yacht_id").references(() => yachts.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  guestCount: integer("guest_count").notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).default("pending"), // pending, confirmed, cancelled
  addOns: jsonb("add_ons"), // captain, catering, etc.
  paymentMethod: varchar("payment_method", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Ownership opportunities table
export const ownershipOpportunities = pgTable("ownership_opportunities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  yachtId: varchar("yacht_id").references(() => yachts.id).notNull(),
  sharePrice: decimal("share_price", { precision: 10, scale: 2 }).notNull(),
  shareFraction: varchar("share_fraction", { length: 10 }).notNull(), // "1/8", "1/6", etc.
  usageDaysPerYear: integer("usage_days_per_year").notNull(),
  totalShares: integer("total_shares").notNull(),
  availableShares: integer("available_shares").notNull(),
  financing: jsonb("financing"), // { available: boolean, downPaymentPercent: number, termMonths: number, monthlyPayment: string }
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Share purchases table
export const sharePurchases = pgTable("share_purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  opportunityId: varchar("opportunity_id").references(() => ownershipOpportunities.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  sharesPurchased: integer("shares_purchased").notNull(),
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }).notNull(),
  purchaseDate: timestamp("purchase_date").defaultNow(),
});

// Share marketplace listings
export const shareListings = pgTable("share_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sharePurchaseId: varchar("share_purchase_id").references(() => sharePurchases.id).notNull(),
  sellerId: varchar("seller_id").references(() => users.id).notNull(),
  askingPrice: decimal("asking_price", { precision: 10, scale: 2 }).notNull(),
  sharesForSale: integer("shares_for_sale").notNull(),
  status: varchar("status", { length: 20 }).default("active"), // active, sold, cancelled
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Messages table
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  recipientId: varchar("recipient_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Fuel wallet transactions
export const fuelTransactions = pgTable("fuel_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(), // topup, booking, refund
  description: text("description"),
  bookingId: varchar("booking_id").references(() => bookings.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  yachts: many(yachts),
  bookings: many(bookings),
  sharePurchases: many(sharePurchases),
  shareListings: many(shareListings),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "recipient" }),
  fuelTransactions: many(fuelTransactions),
}));

export const yachtsRelations = relations(yachts, ({ one, many }) => ({
  owner: one(users, { fields: [yachts.ownerId], references: [users.id] }),
  bookings: many(bookings),
  ownershipOpportunities: many(ownershipOpportunities),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  yacht: one(yachts, { fields: [bookings.yachtId], references: [yachts.id] }),
  user: one(users, { fields: [bookings.userId], references: [users.id] }),
}));

export const ownershipOpportunitiesRelations = relations(ownershipOpportunities, ({ one, many }) => ({
  yacht: one(yachts, { fields: [ownershipOpportunities.yachtId], references: [yachts.id] }),
  sharePurchases: many(sharePurchases),
}));

export const sharePurchasesRelations = relations(sharePurchases, ({ one, many }) => ({
  opportunity: one(ownershipOpportunities, { fields: [sharePurchases.opportunityId], references: [ownershipOpportunities.id] }),
  user: one(users, { fields: [sharePurchases.userId], references: [users.id] }),
  shareListings: many(shareListings),
}));

export const shareListingsRelations = relations(shareListings, ({ one }) => ({
  sharePurchase: one(sharePurchases, { fields: [shareListings.sharePurchaseId], references: [sharePurchases.id] }),
  seller: one(users, { fields: [shareListings.sellerId], references: [users.id] }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, { fields: [messages.senderId], references: [users.id], relationName: "sender" }),
  recipient: one(users, { fields: [messages.recipientId], references: [users.id], relationName: "recipient" }),
}));

export const fuelTransactionsRelations = relations(fuelTransactions, ({ one }) => ({
  user: one(users, { fields: [fuelTransactions.userId], references: [users.id] }),
  booking: one(bookings, { fields: [fuelTransactions.bookingId], references: [bookings.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertYachtSchema = createInsertSchema(yachts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertOwnershipOpportunitySchema = createInsertSchema(ownershipOpportunities).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSharePurchaseSchema = createInsertSchema(sharePurchases).omit({ id: true });
export const insertShareListingSchema = createInsertSchema(shareListings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertFuelTransactionSchema = createInsertSchema(fuelTransactions).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Yacht = typeof yachts.$inferSelect;
export type InsertYacht = z.infer<typeof insertYachtSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type OwnershipOpportunity = typeof ownershipOpportunities.$inferSelect;
export type InsertOwnershipOpportunity = z.infer<typeof insertOwnershipOpportunitySchema>;
export type SharePurchase = typeof sharePurchases.$inferSelect;
export type InsertSharePurchase = z.infer<typeof insertSharePurchaseSchema>;
export type ShareListing = typeof shareListings.$inferSelect;
export type InsertShareListing = z.infer<typeof insertShareListingSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type FuelTransaction = typeof fuelTransactions.$inferSelect;
export type InsertFuelTransaction = z.infer<typeof insertFuelTransactionSchema>;

// Financing type for ownership opportunities
export type FinancingInfo = {
  available: boolean;
  downPaymentPercent: number;
  termMonths: number;
  monthlyPayment: string;
};
