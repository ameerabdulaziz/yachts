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

// ========== NAUTTEC MODALITIES SYSTEM ==========

// Modality types enum
export const ModalityType = {
  OWN: "OWN",
  EARN: "EARN",
  CO_OWN: "CO_OWN",
  INVEST: "INVEST",
} as const;
export type ModalityTypeEnum = (typeof ModalityType)[keyof typeof ModalityType];

// Goal types enum
export const GoalType = {
  LIFESTYLE: "lifestyle",
  LIFESTYLE_PLUS_INCOME: "lifestyle_plus_income",
  MOSTLY_INCOME: "mostly_income",
  PURE_INVESTMENT: "pure_investment",
} as const;
export type GoalTypeEnum = (typeof GoalType)[keyof typeof GoalType];

// Geography preference enum
export const GeoPreference = {
  NEAR_ME: "near_me",
  REGION: "region",
  ANYWHERE: "anywhere",
} as const;
export type GeoPreferenceEnum = (typeof GeoPreference)[keyof typeof GeoPreference];

// Risk rating enum
export const RiskRating = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;
export type RiskRatingEnum = (typeof RiskRating)[keyof typeof RiskRating];

// User Profile for segmentation
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  country: varchar("country", { length: 100 }),
  preferredCurrency: varchar("preferred_currency", { length: 10 }).default("EUR"),
  segmentPrimary: varchar("segment_primary", { length: 20 }), // OWN, EARN, CO_OWN, INVEST
  segmentSecondary: text("segment_secondary").array(),
  budgetCapexMin: decimal("budget_capex_min", { precision: 12, scale: 2 }),
  budgetCapexMax: decimal("budget_capex_max", { precision: 12, scale: 2 }),
  monthlyPaymentComfort: decimal("monthly_payment_comfort", { precision: 10, scale: 2 }),
  openToFinancing: boolean("open_to_financing").default(true),
  goalType: varchar("goal_type", { length: 30 }), // lifestyle, lifestyle_plus_income, mostly_income, pure_investment
  geoPreference: varchar("geo_preference", { length: 20 }), // near_me, region, anywhere
  expectedUsageDays: integer("expected_usage_days"),
  involvementLevel: varchar("involvement_level", { length: 20 }), // hands_on, managed, fully_managed
  onboardingCompleted: boolean("onboarding_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Modality Configuration per yacht
export const modalityConfigs = pgTable("modality_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  yachtId: varchar("yacht_id").references(() => yachts.id).notNull(),
  modalityType: varchar("modality_type", { length: 20 }).notNull(), // OWN, EARN, CO_OWN, INVEST
  isActive: boolean("is_active").default(true),
  // EARN specific fields
  projectedYieldMin: decimal("projected_yield_min", { precision: 5, scale: 2 }),
  projectedYieldBase: decimal("projected_yield_base", { precision: 5, scale: 2 }),
  projectedYieldMax: decimal("projected_yield_max", { precision: 5, scale: 2 }),
  netAnnualCostEstimate: decimal("net_annual_cost_estimate", { precision: 10, scale: 2 }),
  supportsMultiOwner: boolean("supports_multi_owner").default(false),
  // CO_OWN specific fields
  allowedShares: text("allowed_shares").array(), // ["0.5", "0.25", "0.1667"]
  usageDaysPerShare: jsonb("usage_days_per_share"), // { "0.5": 182, "0.25": 91, "0.1667": 60 }
  // INVEST specific fields
  minTicket: decimal("min_ticket", { precision: 12, scale: 2 }),
  projectedYieldAnnual: decimal("projected_yield_annual", { precision: 5, scale: 2 }),
  yieldCurrency: varchar("yield_currency", { length: 10 }).default("EUR"),
  riskRating: varchar("risk_rating", { length: 20 }), // low, medium, high
  investorType: varchar("investor_type", { length: 20 }), // single, multi
  allowsPersonalUse: boolean("allows_personal_use").default(false),
  personalUseDaysMax: integer("personal_use_days_max"),
  // Financing and insurance
  allowsFinancing: boolean("allows_financing").default(true),
  allowsInsurance: boolean("allows_insurance").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Financing Offers
export const financingOffers = pgTable("financing_offers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  yachtId: varchar("yacht_id").references(() => yachts.id),
  modalityType: varchar("modality_type", { length: 20 }),
  minAmount: decimal("min_amount", { precision: 12, scale: 2 }).notNull(),
  maxAmount: decimal("max_amount", { precision: 12, scale: 2 }).notNull(),
  tenorOptions: integer("tenor_options").array(), // [60, 84, 120] months
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }),
  provider: varchar("provider", { length: 100 }),
  productCode: varchar("product_code", { length: 50 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insurance Offers
export const insuranceOffers = pgTable("insurance_offers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  yachtId: varchar("yacht_id").references(() => yachts.id),
  coverageSummary: text("coverage_summary"),
  provider: varchar("provider", { length: 100 }),
  annualPremium: decimal("annual_premium", { precision: 10, scale: 2 }),
  coverageType: varchar("coverage_type", { length: 50 }), // basic, comprehensive, premium
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations for new tables
export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, { fields: [userProfiles.userId], references: [users.id] }),
}));

export const modalityConfigsRelations = relations(modalityConfigs, ({ one }) => ({
  yacht: one(yachts, { fields: [modalityConfigs.yachtId], references: [yachts.id] }),
}));

export const financingOffersRelations = relations(financingOffers, ({ one }) => ({
  yacht: one(yachts, { fields: [financingOffers.yachtId], references: [yachts.id] }),
}));

export const insuranceOffersRelations = relations(insuranceOffers, ({ one }) => ({
  yacht: one(yachts, { fields: [insuranceOffers.yachtId], references: [yachts.id] }),
}));

// Insert schemas for new tables
export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({ id: true, createdAt: true, updatedAt: true });
export const insertModalityConfigSchema = createInsertSchema(modalityConfigs).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFinancingOfferSchema = createInsertSchema(financingOffers).omit({ id: true, createdAt: true, updatedAt: true });
export const insertInsuranceOfferSchema = createInsertSchema(insuranceOffers).omit({ id: true, createdAt: true, updatedAt: true });

// Types for new tables
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type ModalityConfig = typeof modalityConfigs.$inferSelect;
export type InsertModalityConfig = z.infer<typeof insertModalityConfigSchema>;
export type FinancingOffer = typeof financingOffers.$inferSelect;
export type InsertFinancingOffer = z.infer<typeof insertFinancingOfferSchema>;
export type InsuranceOffer = typeof insuranceOffers.$inferSelect;
export type InsertInsuranceOffer = z.infer<typeof insertInsuranceOfferSchema>;

// Onboarding answers type
export type OnboardingAnswers = {
  goals: string[];
  budgetMin: number;
  budgetMax: number;
  monthlyPaymentComfort: number;
  openToFinancing: boolean;
  usageVsYield: GoalTypeEnum;
  geoPreference: GeoPreferenceEnum;
  expectedUsageDays: number;
  involvementLevel: string;
};

// Recommendation result type
export type ModalityRecommendation = {
  primary: ModalityTypeEnum;
  confidence: number;
  alternatives: { modality: ModalityTypeEnum; score: number }[];
};

// ========== ADMIN TOOL SYSTEM ==========

// Admin user roles
export const AdminRole = {
  SUPER_ADMIN: "super_admin", // De Antonio admin
  STAFF: "staff", // De Antonio staff
  DEALER: "dealer", // Dealer account
} as const;
export type AdminRoleEnum = (typeof AdminRole)[keyof typeof AdminRole];

// Admin users table - for De Antonio admins, staff, and dealers
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 255 }),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  role: varchar("role", { length: 20 }).notNull().default("staff"), // super_admin, staff, dealer
  dealerId: varchar("dealer_id"), // Only for dealer role
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdBy: varchar("created_by"), // Admin who created this user
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Dealers table - Dealer organizations
export const dealers = pgTable("dealers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  companyName: varchar("company_name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  country: varchar("country", { length: 100 }),
  website: varchar("website", { length: 255 }),
  logoUrl: varchar("logo_url", { length: 500 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fleet models table - De Antonio yacht models (base fleet)
export const fleetModels = pgTable("fleet_models", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  modelName: varchar("model_name", { length: 100 }).notNull(), // D29, D32, D36, D42, D50, D60
  displayName: varchar("display_name", { length: 255 }).notNull(),
  description: text("description"),
  lengthMeters: decimal("length_meters", { precision: 5, scale: 2 }),
  beamMeters: decimal("beam_meters", { precision: 5, scale: 2 }),
  draftMeters: decimal("draft_meters", { precision: 5, scale: 2 }),
  displacement: decimal("displacement", { precision: 10, scale: 2 }),
  fuelCapacity: integer("fuel_capacity"), // liters
  waterCapacity: integer("water_capacity"), // liters
  maxCapacity: integer("max_capacity"), // passengers
  cabins: integer("cabins"),
  berths: integer("berths"),
  engines: varchar("engines", { length: 255 }),
  maxSpeed: decimal("max_speed", { precision: 5, scale: 2 }), // knots
  cruisingSpeed: decimal("cruising_speed", { precision: 5, scale: 2 }), // knots
  range: integer("range"), // nautical miles
  features: text("features").array(),
  images: text("images").array(),
  basePrice: decimal("base_price", { precision: 12, scale: 2 }), // Reference price
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sale type enum
export const SaleType = {
  SALE_ONLY: "sale_only",
  SALE_AND_CHARTER: "sale_and_charter",
} as const;
export type SaleTypeEnum = (typeof SaleType)[keyof typeof SaleType];

// Dealer boats table - Boats added by dealers
export const dealerBoats = pgTable("dealer_boats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dealerId: varchar("dealer_id").references(() => dealers.id).notNull(),
  fleetModelId: varchar("fleet_model_id").references(() => fleetModels.id).notNull(),
  boatName: varchar("boat_name", { length: 255 }),
  hullNumber: varchar("hull_number", { length: 100 }),
  yearBuilt: integer("year_built"),
  location: varchar("location", { length: 255 }),
  marina: varchar("marina", { length: 255 }),
  // Pricing
  totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
  numberOfFractions: integer("number_of_fractions").notNull().default(5), // How many shares
  fractionPrice: decimal("fraction_price", { precision: 12, scale: 2 }), // Auto-calculated
  // Sale type
  saleType: varchar("sale_type", { length: 30 }).notNull().default("sale_only"), // sale_only, sale_and_charter
  // Usage details per share
  annualUsageDays: integer("annual_usage_days"), // Per share
  engineHoursPerShare: integer("engine_hours_per_share"), // Per share per year
  // Charter rate (for sale_and_charter)
  dailyCharterRate: decimal("daily_charter_rate", { precision: 10, scale: 2 }),
  // Condition and extras
  condition: varchar("condition", { length: 50 }), // new, like_new, excellent, good
  extras: text("extras").array(),
  images: text("images").array(),
  description: text("description"),
  // Status
  status: varchar("status", { length: 30 }).default("active"), // active, sold, reserved, inactive
  isActive: boolean("is_active").default(true),
  availableShares: integer("available_shares"), // Remaining shares for sale
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Calendar status enum
export const CalendarStatus = {
  AVAILABLE: "available",
  BOOKED: "booked",
  BLOCKED: "blocked",
  MAINTENANCE: "maintenance",
} as const;
export type CalendarStatusEnum = (typeof CalendarStatus)[keyof typeof CalendarStatus];

// Boat calendar table - Charter availability
export const boatCalendar = pgTable("boat_calendar", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dealerBoatId: varchar("dealer_boat_id").references(() => dealerBoats.id).notNull(),
  date: timestamp("date").notNull(),
  status: varchar("status", { length: 30 }).notNull().default("available"), // available, booked, blocked, maintenance
  dailyRate: decimal("daily_rate", { precision: 10, scale: 2 }), // Override rate for this date
  bookingId: varchar("booking_id"), // Reference to booking if booked
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Inquiry type enum
export const InquiryType = {
  PURCHASE: "purchase",
  CHARTER: "charter",
  OWNERSHIP: "ownership", // Fractional ownership
  GENERAL: "general",
} as const;
export type InquiryTypeEnum = (typeof InquiryType)[keyof typeof InquiryType];

// Inquiry status enum
export const InquiryStatus = {
  NEW: "new",
  CONTACTED: "contacted",
  IN_PROGRESS: "in_progress",
  QUALIFIED: "qualified",
  CLOSED_WON: "closed_won",
  CLOSED_LOST: "closed_lost",
} as const;
export type InquiryStatusEnum = (typeof InquiryStatus)[keyof typeof InquiryStatus];

// Inquiries table - Customer inquiries
export const inquiries = pgTable("inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dealerId: varchar("dealer_id").references(() => dealers.id),
  dealerBoatId: varchar("dealer_boat_id").references(() => dealerBoats.id),
  fleetModelId: varchar("fleet_model_id").references(() => fleetModels.id),
  inquiryType: varchar("inquiry_type", { length: 30 }).notNull(), // purchase, charter, ownership, general
  status: varchar("status", { length: 30 }).default("new"), // new, contacted, in_progress, qualified, closed_won, closed_lost
  // Customer details
  customerFirstName: varchar("customer_first_name", { length: 100 }).notNull(),
  customerLastName: varchar("customer_last_name", { length: 100 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }),
  customerCountry: varchar("customer_country", { length: 100 }),
  // Inquiry details
  preferredContactMethod: varchar("preferred_contact_method", { length: 30 }), // email, phone, whatsapp
  budget: decimal("budget", { precision: 12, scale: 2 }),
  desiredStartDate: timestamp("desired_start_date"),
  desiredEndDate: timestamp("desired_end_date"),
  numberOfGuests: integer("number_of_guests"),
  message: text("message"),
  // For charter inquiries
  charterDays: integer("charter_days"),
  // For purchase/ownership inquiries
  interestedInFinancing: boolean("interested_in_financing"),
  desiredFractions: integer("desired_fractions"),
  // Internal notes
  internalNotes: text("internal_notes"),
  assignedTo: varchar("assigned_to").references(() => adminUsers.id),
  // Source tracking
  source: varchar("source", { length: 100 }), // website, phone, referral, etc.
  utmSource: varchar("utm_source", { length: 100 }),
  utmMedium: varchar("utm_medium", { length: 100 }),
  utmCampaign: varchar("utm_campaign", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations for admin tables
export const adminUsersRelations = relations(adminUsers, ({ one }) => ({
  dealer: one(dealers, { fields: [adminUsers.dealerId], references: [dealers.id] }),
}));

export const dealersRelations = relations(dealers, ({ many }) => ({
  adminUsers: many(adminUsers),
  dealerBoats: many(dealerBoats),
  inquiries: many(inquiries),
}));

export const fleetModelsRelations = relations(fleetModels, ({ many }) => ({
  dealerBoats: many(dealerBoats),
  inquiries: many(inquiries),
}));

export const dealerBoatsRelations = relations(dealerBoats, ({ one, many }) => ({
  dealer: one(dealers, { fields: [dealerBoats.dealerId], references: [dealers.id] }),
  fleetModel: one(fleetModels, { fields: [dealerBoats.fleetModelId], references: [fleetModels.id] }),
  calendar: many(boatCalendar),
  inquiries: many(inquiries),
}));

export const boatCalendarRelations = relations(boatCalendar, ({ one }) => ({
  dealerBoat: one(dealerBoats, { fields: [boatCalendar.dealerBoatId], references: [dealerBoats.id] }),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  dealer: one(dealers, { fields: [inquiries.dealerId], references: [dealers.id] }),
  dealerBoat: one(dealerBoats, { fields: [inquiries.dealerBoatId], references: [dealerBoats.id] }),
  fleetModel: one(fleetModels, { fields: [inquiries.fleetModelId], references: [fleetModels.id] }),
  assignedUser: one(adminUsers, { fields: [inquiries.assignedTo], references: [adminUsers.id] }),
}));

// Insert schemas for admin tables
export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDealerSchema = createInsertSchema(dealers).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFleetModelSchema = createInsertSchema(fleetModels).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDealerBoatSchema = createInsertSchema(dealerBoats).omit({ id: true, createdAt: true, updatedAt: true });
export const insertBoatCalendarSchema = createInsertSchema(boatCalendar).omit({ id: true, createdAt: true, updatedAt: true });
export const insertInquirySchema = createInsertSchema(inquiries).omit({ id: true, createdAt: true, updatedAt: true });

// Types for admin tables
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type Dealer = typeof dealers.$inferSelect;
export type InsertDealer = z.infer<typeof insertDealerSchema>;
export type FleetModel = typeof fleetModels.$inferSelect;
export type InsertFleetModel = z.infer<typeof insertFleetModelSchema>;
export type DealerBoat = typeof dealerBoats.$inferSelect;
export type InsertDealerBoat = z.infer<typeof insertDealerBoatSchema>;
export type BoatCalendar = typeof boatCalendar.$inferSelect;
export type InsertBoatCalendar = z.infer<typeof insertBoatCalendarSchema>;
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
