import { Yacht, OwnershipOpportunity, Booking, FuelTransaction, Message } from "@shared/schema";

export const mockYachts: (Yacht & { owner: { name: string; avatar: string; verified: boolean; rating: number } })[] = [
  {
    id: "yacht-1",
    name: "Serenity Princess",
    description: "Luxury yacht with stunning Mediterranean views",
    location: "Monaco, France",
    pricePerDay: "2400.00",
    capacity: 12,
    cabins: 6,
    length: "78.00",
    yearBuilt: 2019,
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    ],
    amenities: ["WiFi", "Kitchen", "Swimming platform", "Sound system", "Air conditioning", "Jacuzzi"],
    ownerId: "owner-1",
    isActive: true,
    rating: "4.9",
    reviewCount: 127,
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: {
      name: "Captain Laurent",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      verified: true,
      rating: 5.0
    }
  },
  {
    id: "yacht-2",
    name: "Ocean's Dream",
    description: "Modern yacht perfect for tropical adventures",
    location: "Ibiza, Spain",
    pricePerDay: "1800.00",
    capacity: 8,
    cabins: 4,
    length: "65.00",
    yearBuilt: 2020,
    images: [
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    ],
    amenities: ["WiFi", "Kitchen", "Water sports equipment", "Sound system"],
    ownerId: "owner-2",
    isActive: true,
    rating: "4.7",
    reviewCount: 89,
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: {
      name: "Maria Rodriguez",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b0ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      verified: true,
      rating: 4.8
    }
  }
];

export const mockOwnershipOpportunities: (OwnershipOpportunity & { yacht: Yacht })[] = [
  {
    id: "opportunity-1",
    yachtId: "yacht-3",
    sharePrice: "45000.00",
    shareFraction: "1/8",
    usageWeeks: 6,
    totalShares: 8,
    availableShares: 3,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-3",
      name: "Azure Legend",
      description: "Premium yacht for fractional ownership",
      location: "French Riviera",
      pricePerDay: "3200.00",
      capacity: 10,
      cabins: 5,
      length: "85.00",
      yearBuilt: 2021,
      images: ["https://images.unsplash.com/photo-1540946485063-a40da27545f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120"],
      amenities: ["WiFi", "Kitchen", "Swimming platform", "Sound system"],
      ownerId: "owner-3",
      isActive: true,
      rating: "4.8",
      reviewCount: 56,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: "opportunity-2",
    yachtId: "yacht-4",
    sharePrice: "32000.00",
    shareFraction: "1/6",
    usageWeeks: 8,
    totalShares: 6,
    availableShares: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-4",
      name: "Wind Dancer",
      description: "Sailing yacht for ownership",
      location: "Greek Islands",
      pricePerDay: "2200.00",
      capacity: 8,
      cabins: 4,
      length: "72.00",
      yearBuilt: 2018,
      images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120"],
      amenities: ["WiFi", "Kitchen", "Sailing equipment"],
      ownerId: "owner-4",
      isActive: true,
      rating: "4.6",
      reviewCount: 34,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
];

export const mockBookings: (Booking & { yacht: Yacht })[] = [
  {
    id: "booking-1",
    yachtId: "yacht-1",
    userId: "user-1",
    startDate: new Date("2024-06-15"),
    endDate: new Date("2024-06-18"),
    guestCount: 6,
    totalPrice: "8190.00",
    status: "confirmed",
    addOns: { captain: true, catering: false },
    paymentMethod: "credit-card",
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: mockYachts[0]
  }
];

export const mockFuelTransactions: FuelTransaction[] = [
  {
    id: "transaction-1",
    userId: "user-1",
    amount: "200.00",
    type: "topup",
    description: "Fuel wallet top-up",
    bookingId: null,
    createdAt: new Date()
  },
  {
    id: "transaction-2",
    userId: "user-1",
    amount: "-150.00",
    type: "booking",
    description: "Fuel costs for Ocean's Dream booking",
    bookingId: "booking-1",
    createdAt: new Date()
  }
];

export const mockMessages: (Message & { sender: { name: string; avatar: string } })[] = [
  {
    id: "message-1",
    senderId: "owner-1",
    recipientId: "user-1",
    content: "Thank you for booking Serenity Princess! Looking forward to hosting you.",
    isRead: false,
    createdAt: new Date(),
    sender: {
      name: "Captain Laurent",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    }
  }
];
