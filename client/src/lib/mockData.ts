import { Yacht, OwnershipOpportunity, Booking, FuelTransaction, Message } from "@shared/schema";
import deAntonioD50 from "@assets/image_1754579474724.png";
import deAntonioD50Aerial from "@assets/de antonio D50 (1)_1754331061302.jpg";
import deAntonioD36 from "@assets/image_1754582579453.png";

export const mockYachts: (Yacht & { owner: { name: string; avatar: string; verified: boolean; rating: number } })[] = [
  {
    id: "yacht-1",
    name: "Saxdor 400 GTO Nordic Pearl",
    description: "The flagship Saxdor 400 GTO with signature 13-foot side terraces and twin-stepped hull. Features premium Finnish engineering with twin outboard configuration and exceptional performance.",
    location: "El Gouna, Egypt",
    pricePerDay: "2310",
    capacity: 12,
    cabins: 2,
    length: "40",
    yearBuilt: 2024,
    images: [
      "https://saxdoryachts.com/wp-content/uploads/2023/10/400-GTO-1.jpg",
      "https://saxdoryachts.com/wp-content/uploads/2023/10/400-GTO-2.jpg"
    ],
    amenities: ["13-Foot Side Terraces", "Twin-Stepped Hull", "Joystick Control", "Premium Audio System", "Advanced Navigation", "Electric Windlass", "LED Lighting", "Freshwater Shower"],
    ownerId: "owner-1",
    isActive: true,
    rating: "4.9",
    reviewCount: 127,
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: {
      name: "Marc Fernandez",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      verified: false,
      rating: 5.0
    }
  },
  {
    id: "yacht-2",
    name: "Saxdor 340 GTWA Baltic Explorer",
    description: "All-weather walkaround with superior performance and innovative design. Features twin Mercury V8 engines with advanced hull technology and spacious deck layout.",
    location: "El Gouna, Egypt",
    pricePerDay: "1295",
    capacity: 12,
    cabins: 2,
    length: "34",
    yearBuilt: 2024,
    images: [
      "https://saxdoryachts.com/wp-content/uploads/2023/10/340-GTWA-1.jpg",
      "https://saxdoryachts.com/wp-content/uploads/2023/10/340-GTWA-2.jpg"
    ],
    amenities: ["Twin Mercury 300HP V8", "All-Weather Design", "Side Terraces", "Joystick Control", "Premium Interior", "Galley Kitchen", "Sound System", "Navigation Package"],
    ownerId: "owner-2",
    isActive: true,
    rating: "4.8",
    reviewCount: 89,
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: {
      name: "Sofia Martinez",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b0ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      verified: true,
      rating: 4.8
    }
  },
  {
    id: "yacht-3",
    name: "Saxdor 320 GTC Scandinavian Star",
    description: "All-weather cabin cruiser with enclosed hard top and climate control. Features sound-isolated wheelhouse and advanced navigation systems with premium comfort.",
    location: "El Gouna, Egypt",
    pricePerDay: "1380",
    capacity: 10,
    cabins: 1,
    length: "32",
    yearBuilt: 2024,
    images: [
      "https://saxdoryachts.com/wp-content/uploads/2023/10/320-GTC-1.jpg",
      "https://saxdoryachts.com/wp-content/uploads/2023/10/320-GTC-2.jpg"
    ],
    amenities: ["Mercury 300HP Engine", "Sound-Isolated Cabin", "Climate Control", "Joystick Control", "Dual Displays", "Radar & VHF", "Lithium Systems", "Premium Interior"],
    ownerId: "owner-3",
    isActive: true,
    rating: "4.7",
    reviewCount: 156,
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: {
      name: "Jean-Luc Dubois",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      verified: true,
      rating: 4.9
    }
  },
  {
    id: "yacht-4",
    name: "Saxdor 320 GTO Performance",
    description: "Award-winning sportboat with twin Mercury V8 engines reaching 50+ knots. Features convertible cockpit seating and twin-stepped hull for exceptional performance.",
    location: "El Gouna, Egypt",
    pricePerDay: "1155",
    capacity: 10,
    cabins: 1,
    length: "32",
    yearBuilt: 2024,
    images: [
      "https://saxdoryachts.com/wp-content/uploads/2023/10/320-GTO-1.jpg",
      "https://saxdoryachts.com/wp-content/uploads/2023/10/320-GTO-2.jpg"
    ],
    amenities: ["Twin Mercury 300HP V8", "50+ Knots Top Speed", "Twin-Stepped Hull", "Convertible Seating", "Full Cabin", "Galley Kitchen", "Premium Audio", "Joystick Control"],
    ownerId: "owner-4",
    isActive: true,
    rating: "4.6",
    reviewCount: 72,
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: {
      name: "Carlos Mendez",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      verified: true,
      rating: 4.7
    }
  },
  {
    id: "yacht-5",
    name: "Saxdor 270 GTO Compact",
    description: "Award-winning 27-foot sportboat with twin Mercury V6 engines. Features twin sunbeds and convertible dining, perfect for day cruising with exceptional performance.",
    location: "El Gouna, Egypt",
    pricePerDay: "760",
    capacity: 8,
    cabins: 1,
    length: "27",
    yearBuilt: 2024,
    images: [
      "https://saxdoryachts.com/wp-content/uploads/2023/10/270-GTO-1.jpg",
      "https://saxdoryachts.com/wp-content/uploads/2023/10/270-GTO-2.jpg"
    ],
    amenities: ["Twin Mercury 200HP V6", "Award-Winning Design", "Twin Sunbeds", "Convertible Dining", "Vacuum Infusion Hull", "Joystick Control", "Audio System", "Swimming Platform"],
    ownerId: "owner-5",
    isActive: true,
    rating: "4.5",
    reviewCount: 43,
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: {
      name: "Isabella Romano",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      verified: true,
      rating: 4.6
    }
  },
  {
    id: "yacht-6",
    name: "Saxdor 400 GTO Premium",
    description: "The ultimate Saxdor flagship with premium configuration and extended side terraces. Features twin Mercury V10 engines with advanced electronics and luxury appointments.",
    location: "El Gouna, Egypt",
    pricePerDay: "3080",
    capacity: 12,
    cabins: 2,
    length: "40",
    yearBuilt: 2024,
    images: [
      "https://saxdoryachts.com/wp-content/uploads/2023/10/400-GTO-Premium-1.jpg",
      "https://saxdoryachts.com/wp-content/uploads/2023/10/400-GTO-Premium-2.jpg"
    ],
    amenities: ["Twin Mercury 400HP V10", "13-Foot Side Terraces", "Lithium Battery System", "Advanced Navigation Package", "Hardtop with Sunroof", "Dual Swim Platforms", "Premium Audio", "Joystick Control"],
    ownerId: "owner-6",
    isActive: true,
    rating: "4.9",
    reviewCount: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: {
      name: "Alessandro Rossi",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      verified: true,
      rating: 5.0
    }
  },
  {
    id: "yacht-7",
    name: "Saxdor 320 GTO Sport",
    description: "High-performance sport configuration with enhanced engines and racing setup. Features aggressive styling with premium materials and track-inspired cockpit layout.",
    location: "El Gouna, Egypt",
    pricePerDay: "1380",
    capacity: 10,
    cabins: 1,
    length: "32",
    yearBuilt: 2024,
    images: [
      "https://saxdoryachts.com/wp-content/uploads/2023/10/320-GTO-Sport-1.jpg",
      "https://saxdoryachts.com/wp-content/uploads/2023/10/320-GTO-Sport-2.jpg"
    ],
    amenities: ["Enhanced V8 Engines", "Sport Configuration", "Racing Cockpit", "Premium Materials", "Performance Package", "Sport Audio", "Carbon Accents", "Track Setup"],
    ownerId: "owner-7",
    isActive: true,
    rating: "4.8",
    reviewCount: 28,
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: {
      name: "Lucia Mendoza",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      verified: true,
      rating: 4.9
    }
  },

];

export const mockOwnershipOpportunities: (OwnershipOpportunity & { yacht: Yacht })[] = [
  {
    id: "share-saxdor-320-gto",
    yachtId: "yacht-4",
    sharePrice: "33000",
    shareFraction: "1/5",
    usageDaysPerYear: 73,
    totalShares: 5,
    availableShares: 2,
    isActive: true,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "413"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-4",
      name: "Saxdor 320 GTO Performance",
      description: "Award-winning sportboat with twin Mercury V8 engines reaching 50+ knots. Features convertible cockpit seating and twin-stepped hull for exceptional performance.",
      location: "El Gouna, Egypt",
      pricePerDay: "1155",
      capacity: 10,
      cabins: 1,
      length: "32",
      yearBuilt: 2024,
      images: ["https://saxdoryachts.com/wp-content/uploads/2023/10/320-GTO-1.jpg"],
      amenities: ["Twin Mercury 300HP V8", "50+ Knots Top Speed", "Twin-Stepped Hull", "Convertible Seating", "Full Cabin", "Galley Kitchen", "Premium Audio", "Joystick Control"],
      ownerId: "owner-4",
      isActive: true,
      rating: "4.6",
      reviewCount: 72,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: "share-saxdor-320-gtc",
    yachtId: "yacht-3",
    sharePrice: "39400",
    shareFraction: "1/5",
    usageDaysPerYear: 73,
    totalShares: 5,
    availableShares: 3,
    isActive: true,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "493"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-3",
      name: "Saxdor 320 GTC Scandinavian Star",
      description: "All-weather cabin cruiser with enclosed hard top and climate control. Features sound-isolated wheelhouse and advanced navigation systems with premium comfort.",
      location: "El Gouna, Egypt",
      pricePerDay: "1380",
      capacity: 10,
      cabins: 1,
      length: "32",
      yearBuilt: 2024,
      images: ["https://saxdoryachts.com/wp-content/uploads/2023/10/320-GTC-1.jpg"],
      amenities: ["Mercury 300HP Engine", "Sound-Isolated Cabin", "Climate Control", "Joystick Control", "Dual Displays", "Radar & VHF", "Lithium Systems", "Premium Interior"],
      ownerId: "owner-3",
      isActive: true,
      rating: "4.7",
      reviewCount: 156,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: "share-saxdor-340-gtwa",
    yachtId: "yacht-2",
    sharePrice: "37000",
    shareFraction: "1/5",
    usageDaysPerYear: 73,
    totalShares: 5,
    availableShares: 1,
    isActive: true,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "463"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-2",
      name: "Saxdor 340 GTWA Baltic Explorer",
      description: "All-weather walkaround with superior performance and innovative design. Features twin Mercury V8 engines with advanced hull technology and spacious deck layout.",
      location: "El Gouna, Egypt",
      pricePerDay: "1295",
      capacity: 12,
      cabins: 2,
      length: "34",
      yearBuilt: 2024,
      images: ["https://saxdoryachts.com/wp-content/uploads/2023/10/340-GTWA-1.jpg"],
      amenities: ["Twin Mercury 300HP V8", "All-Weather Design", "Side Terraces", "Joystick Control", "Premium Interior", "Galley Kitchen", "Sound System", "Navigation Package"],
      ownerId: "owner-2",
      isActive: true,
      rating: "4.8",
      reviewCount: 89,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: "share-saxdor-400-gto-premium",
    yachtId: "yacht-6",
    sharePrice: "88000",
    shareFraction: "1/5",
    usageDaysPerYear: 73,
    totalShares: 5,
    availableShares: 3,
    isActive: true,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "1100"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-6",
      name: "Saxdor 400 GTO Premium",
      description: "The ultimate Saxdor flagship with premium configuration and extended side terraces. Features twin Mercury V10 engines with advanced electronics and luxury appointments.",
      location: "El Gouna, Egypt",
      pricePerDay: "3080",
      capacity: 12,
      cabins: 2,
      length: "40",
      yearBuilt: 2024,
      images: ["https://saxdoryachts.com/wp-content/uploads/2023/10/400-GTO-Premium-1.jpg"],
      amenities: ["Twin Mercury 400HP V10", "13-Foot Side Terraces", "Lithium Battery System", "Advanced Navigation Package", "Hardtop with Sunroof", "Dual Swim Platforms", "Premium Audio", "Joystick Control"],
      ownerId: "owner-6",
      isActive: true,
      rating: "4.9",
      reviewCount: 56,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: "share-saxdor-400-gto",
    yachtId: "yacht-1",
    sharePrice: "66000",
    shareFraction: "1/5",
    usageDaysPerYear: 73,
    totalShares: 5,
    availableShares: 2,
    isActive: true,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "825"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-1",
      name: "Saxdor 400 GTO Nordic Pearl",
      description: "The flagship Saxdor 400 GTO with signature 13-foot side terraces and twin-stepped hull. Features premium Finnish engineering with twin outboard configuration and exceptional performance.",
      location: "El Gouna, Egypt",
      pricePerDay: "2310",
      capacity: 12,
      cabins: 2,
      length: "40",
      yearBuilt: 2024,
      images: [
        "https://saxdoryachts.com/wp-content/uploads/2023/10/400-GTO-1.jpg",
        "https://saxdoryachts.com/wp-content/uploads/2023/10/400-GTO-2.jpg"
      ],
      amenities: ["13-Foot Side Terraces", "Twin-Stepped Hull", "Joystick Control", "Premium Audio System", "Advanced Navigation", "Electric Windlass", "LED Lighting", "Freshwater Shower"],
      ownerId: "owner-1",
      isActive: true,
      rating: "4.8",
      reviewCount: 34,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: "share-saxdor-270-gto",
    yachtId: "yacht-5",
    sharePrice: "21800",
    shareFraction: "1/5",
    usageDaysPerYear: 73,
    totalShares: 5,
    availableShares: 1,
    isActive: true,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "273"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-5",
      name: "Saxdor 270 GTO Compact",
      description: "Award-winning 27-foot sportboat with twin Mercury V6 engines. Features twin sunbeds and convertible dining, perfect for day cruising with exceptional performance.",
      location: "El Gouna, Egypt",
      pricePerDay: "760",
      capacity: 8,
      cabins: 1,
      length: "27",
      yearBuilt: 2024,
      images: ["https://saxdoryachts.com/wp-content/uploads/2023/10/270-GTO-1.jpg"],
      amenities: ["Twin Mercury 200HP V6", "Award-Winning Design", "Twin Sunbeds", "Convertible Dining", "Vacuum Infusion Hull", "Joystick Control", "Audio System", "Swimming Platform"],
      ownerId: "owner-5",
      isActive: true,
      rating: "4.7",
      reviewCount: 28,
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
    startDate: new Date("2025-10-16"),
    endDate: new Date("2025-10-19"),
    guestCount: 6,
    totalPrice: "8190",
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
    amount: "200",
    type: "topup",
    description: "Fuel wallet top-up",
    bookingId: null,
    createdAt: new Date()
  },
  {
    id: "transaction-2",
    userId: "user-1",
    amount: "-150",
    type: "booking",
    description: "Fuel costs for Saxdor 400 GTO Nordic Pearl booking",
    bookingId: "booking-1",
    createdAt: new Date()
  }
];

export const mockMessages: (Message & { sender: { name: string; avatar: string } })[] = [
  {
    id: "message-1",
    senderId: "owner-1",
    recipientId: "user-1",
    content: "Thank you for booking the Saxdor 400 GTO Nordic Pearl! Our Finnish-engineered yacht with signature side terraces and twin-stepped hull will provide an unforgettable experience. Looking forward to hosting you.",
    isRead: false,
    createdAt: new Date(),
    sender: {
      name: "Marc Fernandez",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    }
  },
  {
    id: "message-2",
    senderId: "owner-2",
    recipientId: "user-1",
    content: "Welcome to the Saxdor 340 GTWA Baltic Explorer experience! This all-weather walkaround features twin Mercury V8 engines and innovative hull technology for the ultimate performance. Can't wait to show you the Finnish design!",
    isRead: false,
    createdAt: new Date("2025-10-20"),
    sender: {
      name: "Sofia Martinez",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b0ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    }
  }
];
