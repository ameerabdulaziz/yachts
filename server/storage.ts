import {
  users,
  yachts,
  bookings,
  ownershipOpportunities,
  sharePurchases,
  shareListings,
  messages,
  fuelTransactions,
  adminUsers,
  dealers,
  fleetModels,
  dealerBoats,
  boatCalendar,
  inquiries,
  skippers,
  skipperAssignments,
  tripLogs,
  maintenanceRecords,
  payments,
  skipperAvailability,
  type User,
  type InsertUser,
  type Yacht,
  type InsertYacht,
  type Booking,
  type InsertBooking,
  type OwnershipOpportunity,
  type InsertOwnershipOpportunity,
  type SharePurchase,
  type InsertSharePurchase,
  type ShareListing,
  type InsertShareListing,
  type Message,
  type InsertMessage,
  type FuelTransaction,
  type InsertFuelTransaction,
  type AdminUser,
  type InsertAdminUser,
  type Dealer,
  type InsertDealer,
  type FleetModel,
  type InsertFleetModel,
  type DealerBoat,
  type InsertDealerBoat,
  type BoatCalendar,
  type InsertBoatCalendar,
  type Inquiry,
  type InsertInquiry,
  type Skipper,
  type InsertSkipper,
  type SkipperAssignment,
  type InsertSkipperAssignment,
  type TripLog,
  type InsertTripLog,
  type MaintenanceRecord,
  type InsertMaintenanceRecord,
  type Payment,
  type InsertPayment,
  type SkipperAvailability,
  type InsertSkipperAvailability,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | undefined>;
  getUser(id: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(user: Partial<User> & { id: string }): Promise<User>;

  // Yacht operations
  getAllYachts(): Promise<Yacht[]>;
  getYacht(id: string): Promise<Yacht | undefined>;
  createYacht(yacht: InsertYacht): Promise<Yacht>;
  updateYacht(id: string, yacht: Partial<InsertYacht>): Promise<Yacht>;

  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: string): Promise<Booking | undefined>;
  getUserBookings(userId: string): Promise<Booking[]>;
  updateBooking(id: string, booking: Partial<InsertBooking>): Promise<Booking>;

  // Ownership operations
  getAllOwnershipOpportunities(): Promise<OwnershipOpportunity[]>;
  getOwnershipOpportunity(id: string): Promise<OwnershipOpportunity | undefined>;
  createOwnershipOpportunity(opportunity: InsertOwnershipOpportunity): Promise<OwnershipOpportunity>;

  // Share operations
  createSharePurchase(purchase: InsertSharePurchase): Promise<SharePurchase>;
  getAllShareListings(): Promise<ShareListing[]>;
  createShareListing(listing: InsertShareListing): Promise<ShareListing>;

  // Messaging operations
  getUserMessages(userId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Fuel wallet operations
  createFuelTransaction(transaction: InsertFuelTransaction): Promise<FuelTransaction>;
  getUserFuelTransactions(userId: string): Promise<FuelTransaction[]>;

  // Admin user operations
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  getAdminUserById(id: string): Promise<AdminUser | undefined>;
  getAllAdminUsers(): Promise<AdminUser[]>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  updateAdminUser(id: string, user: Partial<InsertAdminUser>): Promise<AdminUser>;

  // Dealer operations
  getAllDealers(): Promise<Dealer[]>;
  getDealer(id: string): Promise<Dealer | undefined>;
  createDealer(dealer: InsertDealer): Promise<Dealer>;
  updateDealer(id: string, dealer: Partial<InsertDealer>): Promise<Dealer>;

  // Fleet model operations
  getAllFleetModels(): Promise<FleetModel[]>;
  getFleetModel(id: string): Promise<FleetModel | undefined>;
  createFleetModel(model: InsertFleetModel): Promise<FleetModel>;
  updateFleetModel(id: string, model: Partial<InsertFleetModel>): Promise<FleetModel>;

  // Dealer boat operations
  getDealerBoats(dealerId: string): Promise<DealerBoat[]>;
  getAllDealerBoats(): Promise<DealerBoat[]>;
  getDealerBoat(id: string): Promise<DealerBoat | undefined>;
  createDealerBoat(boat: InsertDealerBoat): Promise<DealerBoat>;
  updateDealerBoat(id: string, boat: Partial<InsertDealerBoat>): Promise<DealerBoat>;

  // Calendar operations
  getBoatCalendar(boatId: string, startDate: Date, endDate: Date): Promise<BoatCalendar[]>;
  upsertCalendarEntry(entry: InsertBoatCalendar): Promise<BoatCalendar>;

  // Inquiry operations
  getDealerInquiries(dealerId: string): Promise<Inquiry[]>;
  getAllInquiries(): Promise<Inquiry[]>;
  getInquiry(id: string): Promise<Inquiry | undefined>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiry(id: string, inquiry: Partial<InsertInquiry>): Promise<Inquiry>;

  // Skipper operations
  getAllSkippers(): Promise<Skipper[]>;
  getDealerSkippers(dealerId: string): Promise<Skipper[]>;
  getSkipper(id: string): Promise<Skipper | undefined>;
  createSkipper(skipper: InsertSkipper): Promise<Skipper>;
  updateSkipper(id: string, skipper: Partial<InsertSkipper>): Promise<Skipper>;

  // Skipper assignment operations
  getAllAssignments(): Promise<SkipperAssignment[]>;
  getDealerAssignments(dealerId: string): Promise<SkipperAssignment[]>;
  getSkipperAssignments(skipperId: string): Promise<SkipperAssignment[]>;
  getAssignment(id: string): Promise<SkipperAssignment | undefined>;
  createAssignment(assignment: InsertSkipperAssignment): Promise<SkipperAssignment>;
  updateAssignment(id: string, assignment: Partial<InsertSkipperAssignment>): Promise<SkipperAssignment>;

  // Trip log operations
  getAllTripLogs(): Promise<TripLog[]>;
  getDealerTripLogs(dealerId: string): Promise<TripLog[]>;
  getSkipperTripLogs(skipperId: string): Promise<TripLog[]>;
  getTripLog(id: string): Promise<TripLog | undefined>;
  createTripLog(log: InsertTripLog): Promise<TripLog>;
  updateTripLog(id: string, log: Partial<InsertTripLog>): Promise<TripLog>;

  // Maintenance operations
  getAllMaintenanceRecords(): Promise<MaintenanceRecord[]>;
  getDealerMaintenanceRecords(dealerId: string): Promise<MaintenanceRecord[]>;
  getBoatMaintenanceRecords(boatId: string): Promise<MaintenanceRecord[]>;
  getMaintenanceRecord(id: string): Promise<MaintenanceRecord | undefined>;
  createMaintenanceRecord(record: InsertMaintenanceRecord): Promise<MaintenanceRecord>;
  updateMaintenanceRecord(id: string, record: Partial<InsertMaintenanceRecord>): Promise<MaintenanceRecord>;

  // Payment operations
  getAllPayments(): Promise<Payment[]>;
  getDealerPayments(dealerId: string): Promise<Payment[]>;
  getPayment(id: string): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, payment: Partial<InsertPayment>): Promise<Payment>;

  // Booking admin operations
  getAllBookings(): Promise<Booking[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getAllUsers(): Promise<User[]> {
    console.log('Storage: Getting all users from database');
    const result = await db.select().from(users);
    console.log('Storage: Found', result.length, 'users');
    return result;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(userData: Partial<User> & { id: string }): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, userData.id))
      .returning();
    return user;
  }

  // Yacht operations
  async getAllYachts(): Promise<Yacht[]> {
    return await db.select().from(yachts).where(eq(yachts.isActive, true));
  }

  async getYacht(id: string): Promise<Yacht | undefined> {
    const [yacht] = await db.select().from(yachts).where(eq(yachts.id, id));
    return yacht;
  }

  async createYacht(yachtData: InsertYacht): Promise<Yacht> {
    const [yacht] = await db
      .insert(yachts)
      .values(yachtData)
      .returning();
    return yacht;
  }

  async updateYacht(id: string, yachtData: Partial<InsertYacht>): Promise<Yacht> {
    const [yacht] = await db
      .update(yachts)
      .set({ ...yachtData, updatedAt: new Date() })
      .where(eq(yachts.id, id))
      .returning();
    return yacht;
  }

  // Booking operations
  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const [booking] = await db
      .insert(bookings)
      .values(bookingData)
      .returning();
    return booking;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt));
  }

  async updateBooking(id: string, bookingData: Partial<InsertBooking>): Promise<Booking> {
    const [booking] = await db
      .update(bookings)
      .set({ ...bookingData, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  // Ownership operations
  async getAllOwnershipOpportunities(): Promise<OwnershipOpportunity[]> {
    return await db
      .select()
      .from(ownershipOpportunities)
      .where(eq(ownershipOpportunities.isActive, true));
  }

  async getOwnershipOpportunity(id: string): Promise<OwnershipOpportunity | undefined> {
    const [opportunity] = await db
      .select()
      .from(ownershipOpportunities)
      .where(eq(ownershipOpportunities.id, id));
    return opportunity;
  }

  async createOwnershipOpportunity(opportunityData: InsertOwnershipOpportunity): Promise<OwnershipOpportunity> {
    const [opportunity] = await db
      .insert(ownershipOpportunities)
      .values(opportunityData)
      .returning();
    return opportunity;
  }

  // Share operations
  async createSharePurchase(purchaseData: InsertSharePurchase): Promise<SharePurchase> {
    const [purchase] = await db
      .insert(sharePurchases)
      .values(purchaseData)
      .returning();
    return purchase;
  }

  async getAllShareListings(): Promise<ShareListing[]> {
    return await db
      .select()
      .from(shareListings)
      .where(eq(shareListings.status, "active"))
      .orderBy(desc(shareListings.createdAt));
  }

  async createShareListing(listingData: InsertShareListing): Promise<ShareListing> {
    const [listing] = await db
      .insert(shareListings)
      .values(listingData)
      .returning();
    return listing;
  }

  // Messaging operations
  async getUserMessages(userId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.recipientId, userId))
      .orderBy(desc(messages.createdAt));
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(messageData)
      .returning();
    return message;
  }

  // Fuel wallet operations
  async createFuelTransaction(transactionData: InsertFuelTransaction): Promise<FuelTransaction> {
    const [transaction] = await db
      .insert(fuelTransactions)
      .values(transactionData)
      .returning();
    return transaction;
  }

  async getUserFuelTransactions(userId: string): Promise<FuelTransaction[]> {
    return await db
      .select()
      .from(fuelTransactions)
      .where(eq(fuelTransactions.userId, userId))
      .orderBy(desc(fuelTransactions.createdAt));
  }

  // Admin user operations
  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user;
  }

  async getAdminUserById(id: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user;
  }

  async getAllAdminUsers(): Promise<AdminUser[]> {
    return await db.select().from(adminUsers).orderBy(desc(adminUsers.createdAt));
  }

  async createAdminUser(userData: InsertAdminUser): Promise<AdminUser> {
    const [user] = await db.insert(adminUsers).values(userData).returning();
    return user;
  }

  async updateAdminUser(id: string, userData: Partial<InsertAdminUser>): Promise<AdminUser> {
    const [user] = await db
      .update(adminUsers)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(adminUsers.id, id))
      .returning();
    return user;
  }

  // Dealer operations
  async getAllDealers(): Promise<Dealer[]> {
    return await db.select().from(dealers).where(eq(dealers.isActive, true)).orderBy(desc(dealers.createdAt));
  }

  async getDealer(id: string): Promise<Dealer | undefined> {
    const [dealer] = await db.select().from(dealers).where(eq(dealers.id, id));
    return dealer;
  }

  async createDealer(dealerData: InsertDealer): Promise<Dealer> {
    const [dealer] = await db.insert(dealers).values(dealerData).returning();
    return dealer;
  }

  async updateDealer(id: string, dealerData: Partial<InsertDealer>): Promise<Dealer> {
    const [dealer] = await db
      .update(dealers)
      .set({ ...dealerData, updatedAt: new Date() })
      .where(eq(dealers.id, id))
      .returning();
    return dealer;
  }

  // Fleet model operations
  async getAllFleetModels(): Promise<FleetModel[]> {
    return await db.select().from(fleetModels).where(eq(fleetModels.isActive, true)).orderBy(fleetModels.sortOrder);
  }

  async getFleetModel(id: string): Promise<FleetModel | undefined> {
    const [model] = await db.select().from(fleetModels).where(eq(fleetModels.id, id));
    return model;
  }

  async createFleetModel(modelData: InsertFleetModel): Promise<FleetModel> {
    const [model] = await db.insert(fleetModels).values(modelData).returning();
    return model;
  }

  async updateFleetModel(id: string, modelData: Partial<InsertFleetModel>): Promise<FleetModel> {
    const [model] = await db
      .update(fleetModels)
      .set({ ...modelData, updatedAt: new Date() })
      .where(eq(fleetModels.id, id))
      .returning();
    return model;
  }

  // Dealer boat operations
  async getDealerBoats(dealerId: string): Promise<DealerBoat[]> {
    return await db
      .select()
      .from(dealerBoats)
      .where(and(eq(dealerBoats.dealerId, dealerId), eq(dealerBoats.isActive, true)))
      .orderBy(desc(dealerBoats.createdAt));
  }

  async getAllDealerBoats(): Promise<DealerBoat[]> {
    return await db.select().from(dealerBoats).where(eq(dealerBoats.isActive, true)).orderBy(desc(dealerBoats.createdAt));
  }

  async getDealerBoat(id: string): Promise<DealerBoat | undefined> {
    const [boat] = await db.select().from(dealerBoats).where(eq(dealerBoats.id, id));
    return boat;
  }

  async createDealerBoat(boatData: InsertDealerBoat): Promise<DealerBoat> {
    // Auto-calculate fraction price
    const fractions = boatData.numberOfFractions ?? 5;
    const fractionPrice = Number(boatData.totalPrice) / fractions;
    const [boat] = await db
      .insert(dealerBoats)
      .values({ ...boatData, numberOfFractions: fractions, fractionPrice: fractionPrice.toString(), availableShares: fractions })
      .returning();
    return boat;
  }

  async updateDealerBoat(id: string, boatData: Partial<InsertDealerBoat>): Promise<DealerBoat> {
    // Recalculate fraction price if total price or number of fractions changed
    let updateData: any = { ...boatData, updatedAt: new Date() };
    if (boatData.totalPrice || boatData.numberOfFractions) {
      const existingBoat = await this.getDealerBoat(id);
      if (existingBoat) {
        const totalPrice = boatData.totalPrice ? Number(boatData.totalPrice) : Number(existingBoat.totalPrice);
        const fractions = boatData.numberOfFractions ?? existingBoat.numberOfFractions;
        updateData.fractionPrice = (totalPrice / fractions).toString();
      }
    }
    const [boat] = await db.update(dealerBoats).set(updateData).where(eq(dealerBoats.id, id)).returning();
    return boat;
  }

  // Calendar operations
  async getBoatCalendar(boatId: string, startDate: Date, endDate: Date): Promise<BoatCalendar[]> {
    return await db
      .select()
      .from(boatCalendar)
      .where(
        and(
          eq(boatCalendar.dealerBoatId, boatId),
          gte(boatCalendar.date, startDate),
          lte(boatCalendar.date, endDate)
        )
      )
      .orderBy(boatCalendar.date);
  }

  async upsertCalendarEntry(entryData: InsertBoatCalendar): Promise<BoatCalendar> {
    const [entry] = await db
      .insert(boatCalendar)
      .values(entryData)
      .onConflictDoUpdate({
        target: [boatCalendar.dealerBoatId, boatCalendar.date],
        set: { status: entryData.status, dailyRate: entryData.dailyRate, notes: entryData.notes, updatedAt: new Date() },
      })
      .returning();
    return entry;
  }

  // Inquiry operations
  async getDealerInquiries(dealerId: string): Promise<Inquiry[]> {
    return await db
      .select()
      .from(inquiries)
      .where(eq(inquiries.dealerId, dealerId))
      .orderBy(desc(inquiries.createdAt));
  }

  async getAllInquiries(): Promise<Inquiry[]> {
    return await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  }

  async getInquiry(id: string): Promise<Inquiry | undefined> {
    const [inquiry] = await db.select().from(inquiries).where(eq(inquiries.id, id));
    return inquiry;
  }

  async createInquiry(inquiryData: InsertInquiry): Promise<Inquiry> {
    const [inquiry] = await db.insert(inquiries).values(inquiryData).returning();
    return inquiry;
  }

  async updateInquiry(id: string, inquiryData: Partial<InsertInquiry>): Promise<Inquiry> {
    const [inquiry] = await db
      .update(inquiries)
      .set({ ...inquiryData, updatedAt: new Date() })
      .where(eq(inquiries.id, id))
      .returning();
    return inquiry;
  }

  // Skipper operations
  async getAllSkippers(): Promise<Skipper[]> {
    return await db.select().from(skippers).orderBy(desc(skippers.createdAt));
  }

  async getDealerSkippers(dealerId: string): Promise<Skipper[]> {
    return await db.select().from(skippers).where(eq(skippers.dealerId, dealerId)).orderBy(desc(skippers.createdAt));
  }

  async getSkipper(id: string): Promise<Skipper | undefined> {
    const [skipper] = await db.select().from(skippers).where(eq(skippers.id, id));
    return skipper;
  }

  async createSkipper(skipperData: InsertSkipper): Promise<Skipper> {
    const [skipper] = await db.insert(skippers).values(skipperData).returning();
    return skipper;
  }

  async updateSkipper(id: string, skipperData: Partial<InsertSkipper>): Promise<Skipper> {
    const [skipper] = await db.update(skippers).set({ ...skipperData, updatedAt: new Date() }).where(eq(skippers.id, id)).returning();
    return skipper;
  }

  // Skipper assignment operations
  async getAllAssignments(): Promise<SkipperAssignment[]> {
    return await db.select().from(skipperAssignments).orderBy(desc(skipperAssignments.startDate));
  }

  async getDealerAssignments(dealerId: string): Promise<SkipperAssignment[]> {
    return await db.select().from(skipperAssignments).where(eq(skipperAssignments.dealerId, dealerId)).orderBy(desc(skipperAssignments.startDate));
  }

  async getSkipperAssignments(skipperId: string): Promise<SkipperAssignment[]> {
    return await db.select().from(skipperAssignments).where(eq(skipperAssignments.skipperId, skipperId)).orderBy(desc(skipperAssignments.startDate));
  }

  async getAssignment(id: string): Promise<SkipperAssignment | undefined> {
    const [assignment] = await db.select().from(skipperAssignments).where(eq(skipperAssignments.id, id));
    return assignment;
  }

  async createAssignment(assignmentData: InsertSkipperAssignment): Promise<SkipperAssignment> {
    const [assignment] = await db.insert(skipperAssignments).values(assignmentData).returning();
    return assignment;
  }

  async updateAssignment(id: string, assignmentData: Partial<InsertSkipperAssignment>): Promise<SkipperAssignment> {
    const [assignment] = await db.update(skipperAssignments).set({ ...assignmentData, updatedAt: new Date() }).where(eq(skipperAssignments.id, id)).returning();
    return assignment;
  }

  // Trip log operations
  async getAllTripLogs(): Promise<TripLog[]> {
    return await db.select().from(tripLogs).orderBy(desc(tripLogs.createdAt));
  }

  async getDealerTripLogs(dealerId: string): Promise<TripLog[]> {
    return await db.select().from(tripLogs).where(eq(tripLogs.dealerId, dealerId)).orderBy(desc(tripLogs.createdAt));
  }

  async getSkipperTripLogs(skipperId: string): Promise<TripLog[]> {
    return await db.select().from(tripLogs).where(eq(tripLogs.skipperId, skipperId)).orderBy(desc(tripLogs.createdAt));
  }

  async getTripLog(id: string): Promise<TripLog | undefined> {
    const [log] = await db.select().from(tripLogs).where(eq(tripLogs.id, id));
    return log;
  }

  async createTripLog(logData: InsertTripLog): Promise<TripLog> {
    const [log] = await db.insert(tripLogs).values(logData).returning();
    return log;
  }

  async updateTripLog(id: string, logData: Partial<InsertTripLog>): Promise<TripLog> {
    const [log] = await db.update(tripLogs).set({ ...logData, updatedAt: new Date() }).where(eq(tripLogs.id, id)).returning();
    return log;
  }

  // Maintenance operations
  async getAllMaintenanceRecords(): Promise<MaintenanceRecord[]> {
    return await db.select().from(maintenanceRecords).orderBy(desc(maintenanceRecords.createdAt));
  }

  async getDealerMaintenanceRecords(dealerId: string): Promise<MaintenanceRecord[]> {
    return await db.select().from(maintenanceRecords).where(eq(maintenanceRecords.dealerId, dealerId)).orderBy(desc(maintenanceRecords.createdAt));
  }

  async getBoatMaintenanceRecords(boatId: string): Promise<MaintenanceRecord[]> {
    return await db.select().from(maintenanceRecords).where(eq(maintenanceRecords.dealerBoatId, boatId)).orderBy(desc(maintenanceRecords.scheduledDate));
  }

  async getMaintenanceRecord(id: string): Promise<MaintenanceRecord | undefined> {
    const [record] = await db.select().from(maintenanceRecords).where(eq(maintenanceRecords.id, id));
    return record;
  }

  async createMaintenanceRecord(recordData: InsertMaintenanceRecord): Promise<MaintenanceRecord> {
    const [record] = await db.insert(maintenanceRecords).values(recordData).returning();
    return record;
  }

  async updateMaintenanceRecord(id: string, recordData: Partial<InsertMaintenanceRecord>): Promise<MaintenanceRecord> {
    const [record] = await db.update(maintenanceRecords).set({ ...recordData, updatedAt: new Date() }).where(eq(maintenanceRecords.id, id)).returning();
    return record;
  }

  // Payment operations
  async getAllPayments(): Promise<Payment[]> {
    return await db.select().from(payments).orderBy(desc(payments.createdAt));
  }

  async getDealerPayments(dealerId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.dealerId, dealerId)).orderBy(desc(payments.createdAt));
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
  }

  async createPayment(paymentData: InsertPayment): Promise<Payment> {
    const [payment] = await db.insert(payments).values(paymentData).returning();
    return payment;
  }

  async updatePayment(id: string, paymentData: Partial<InsertPayment>): Promise<Payment> {
    const [payment] = await db.update(payments).set({ ...paymentData, updatedAt: new Date() }).where(eq(payments.id, id)).returning();
    return payment;
  }

  // Booking admin operations
  async getAllBookings(): Promise<Booking[]> {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }
}

export const storage = new DatabaseStorage();
