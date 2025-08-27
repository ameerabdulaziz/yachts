import {
  users,
  yachts,
  bookings,
  ownershipOpportunities,
  sharePurchases,
  shareListings,
  messages,
  fuelTransactions,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | undefined>;
  getUser(id: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
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
}

export const storage = new DatabaseStorage();
