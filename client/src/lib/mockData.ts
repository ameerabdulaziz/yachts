import { Yacht, OwnershipOpportunity, Booking, FuelTransaction, Message } from "@shared/schema";

export const mockYachts: (Yacht & { owner: { name: string; avatar: string; verified: boolean; rating: number } })[] = [
  {
    id: "yacht-1",
    name: "De Antonio D50 Open",
    description: "The flagship De Antonio D50 Open with signature hidden outboard engines and expansive sundeck. Features Barcelona-engineered design with exceptional performance and luxury appointments.",
    location: "El Gouna, Egypt",
    pricePerDay: "€4,500",
    capacity: 12,
    cabins: 2,
    length: "50",
    yearBuilt: 2024,
    images: [
      "https://images.boatsgroup.com/images/1/51/79/de-antonio-yachts-d50-open-9275179-20240619063113-0.jpg",
      "https://images.boatsgroup.com/images/1/51/79/de-antonio-yachts-d50-open-9275179-20240619063114-1.jpg"
    ],
    amenities: ["Hidden Outboard Engines", "Spacious Sundeck", "Walk-Around Deck", "Premium Audio System", "Advanced Navigation", "Electric Windlass", "LED Lighting", "Freshwater Shower"],
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
    name: "De Antonio D42 Open",
    description: "Award-winning mid-range sport yacht with superior performance and innovative Barcelona design. Features hidden outboards with advanced hull technology and spacious deck layout.",
    location: "El Gouna, Egypt",
    pricePerDay: "€2,800",
    capacity: 12,
    cabins: 2,
    length: "42",
    yearBuilt: 2024,
    images: [
      "https://images.boatsgroup.com/images/1/17/29/de-antonio-yachts-d42-9141729-20240221104818-0.jpg",
      "https://images.boatsgroup.com/images/1/17/29/de-antonio-yachts-d42-9141729-20240221104820-2.jpg"
    ],
    amenities: ["Triple Outboard Engines", "Hidden Engine Design", "Walk-Around Deck", "Joystick Control", "Premium Interior", "Galley Kitchen", "Sound System", "Navigation Package"],
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
    name: "De Antonio D34 Cruiser",
    description: "Versatile cabin cruiser with 2 guest cabins and full bathroom. Features CE Class B certification for offshore cruising with premium comfort and Barcelona craftsmanship.",
    location: "El Gouna, Egypt",
    pricePerDay: "€1,800",
    capacity: 11,
    cabins: 2,
    length: "34",
    yearBuilt: 2024,
    images: [
      "https://images.boatsgroup.com/images/1/85/3/de-antonio-yachts-d34-cruiser-9068503-20231212093632-0.jpg",
      "https://images.boatsgroup.com/images/1/85/3/de-antonio-yachts-d34-cruiser-9068503-20231212093634-2.jpg"
    ],
    amenities: ["Twin Outboard Engines", "2 Guest Cabins", "Full Bathroom", "Joystick Control", "Dual Displays", "Radar & VHF", "Hidden Engines", "Premium Interior"],
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
    name: "De Antonio D34 Open",
    description: "Award-winning center console with hidden outboard configuration reaching 43 knots. Features walk-around deck and spacious sundeck for exceptional day cruising.",
    location: "El Gouna, Egypt",
    pricePerDay: "€1,650",
    capacity: 11,
    cabins: 1,
    length: "34",
    yearBuilt: 2024,
    images: [
      "https://images.boatsgroup.com/images/1/13/61/de-antonio-yachts-d34-open-9091361-20240109094358-0.jpg",
      "https://images.boatsgroup.com/images/1/13/61/de-antonio-yachts-d34-open-9091361-20240109094400-2.jpg"
    ],
    amenities: ["Twin Outboard Engines", "43 Knots Top Speed", "Hidden Engine Design", "Walk-Around Deck", "Full Cabin", "Galley Kitchen", "Premium Audio", "Joystick Control"],
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
    name: "De Antonio D28 Open",
    description: "Award-winning 28-foot sportboat with imposing black console and hidden outboards. Features capacity for 10 guests with exceptional Barcelona design and 40 knot performance.",
    location: "El Gouna, Egypt",
    pricePerDay: "€950",
    capacity: 10,
    cabins: 1,
    length: "28",
    yearBuilt: 2024,
    images: [
      "https://images.boatsgroup.com/images/1/63/84/de-antonio-yachts-d28-open-9226384-20240502160147-0.jpg",
      "https://images.boatsgroup.com/images/1/63/84/de-antonio-yachts-d28-open-9226384-20240502160149-2.jpg"
    ],
    amenities: ["Twin Outboard Engines", "40 Knots Top Speed", "Black Console Design", "Walk-Around Deck", "Full Bathroom", "V-Shaped Hull", "Audio System", "Swimming Platform"],
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
    name: "De Antonio D50 Coupe",
    description: "The ultimate De Antonio flagship with premium enclosed coupe configuration. Features powerful triple outboard engines with advanced electronics and luxury appointments.",
    location: "El Gouna, Egypt",
    pricePerDay: "€5,200",
    capacity: 12,
    cabins: 2,
    length: "50",
    yearBuilt: 2024,
    images: [
      "https://images.boatsgroup.com/images/1/75/30/de-antonio-yachts-d50-coupe-9177530-20240404054946-0.jpg",
      "https://images.boatsgroup.com/images/1/75/30/de-antonio-yachts-d50-coupe-9177530-20240404054948-2.jpg"
    ],
    amenities: ["Triple Outboard Engines", "Enclosed Coupe Design", "Air Conditioning", "Advanced Navigation Package", "Hardtop with Sunroof", "Dual Swim Platforms", "Premium Audio", "Joystick Control"],
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

];

export const mockOwnershipOpportunities: (OwnershipOpportunity & { yacht: Yacht })[] = [
  {
    id: "share-deantonio-d34-open",
    yachtId: "yacht-4",
    sharePrice: "€33,980",
    shareFraction: "1/5",
    usageDaysPerYear: 73,
    totalShares: 5,
    availableShares: 2,
    isActive: true,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "592"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-4",
      name: "De Antonio D34 Open",
      description: "Award-winning center console with hidden outboard configuration reaching 43 knots. Features walk-around deck and spacious sundeck for exceptional day cruising.",
      location: "El Gouna, Egypt",
      pricePerDay: "1650",
      capacity: 11,
      cabins: 1,
      length: "34",
      yearBuilt: 2024,
      images: ["https://images.boatsgroup.com/images/1/13/61/de-antonio-yachts-d34-open-9091361-20240109094358-0.jpg"],
      amenities: ["Twin Outboard Engines", "43 Knots Top Speed", "Hidden Engine Design", "Walk-Around Deck", "Full Cabin", "Galley Kitchen", "Premium Audio", "Joystick Control"],
      ownerId: "owner-4",
      isActive: true,
      rating: "4.6",
      reviewCount: 72,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: "share-deantonio-d34-cruiser",
    yachtId: "yacht-3",
    sharePrice: "€35,980",
    shareFraction: "1/5",
    usageDaysPerYear: 73,
    totalShares: 5,
    availableShares: 3,
    isActive: true,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "627"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-3",
      name: "De Antonio D34 Cruiser",
      description: "Versatile cabin cruiser with 2 guest cabins and full bathroom. Features CE Class B certification for offshore cruising with premium comfort and Barcelona craftsmanship.",
      location: "El Gouna, Egypt",
      pricePerDay: "1800",
      capacity: 11,
      cabins: 2,
      length: "34",
      yearBuilt: 2024,
      images: ["https://images.boatsgroup.com/images/1/85/3/de-antonio-yachts-d34-cruiser-9068503-20231212093632-0.jpg"],
      amenities: ["Twin Outboard Engines", "2 Guest Cabins", "Full Bathroom", "Joystick Control", "Dual Displays", "Radar & VHF", "Hidden Engines", "Premium Interior"],
      ownerId: "owner-3",
      isActive: true,
      rating: "4.7",
      reviewCount: 156,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: "share-deantonio-d42",
    yachtId: "yacht-2",
    sharePrice: "€107,000",
    shareFraction: "1/5",
    usageDaysPerYear: 73,
    totalShares: 5,
    availableShares: 1,
    isActive: true,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "1,864"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-2",
      name: "De Antonio D42 Open",
      description: "Award-winning mid-range sport yacht with superior performance and innovative Barcelona design. Features hidden outboards with advanced hull technology and spacious deck layout.",
      location: "El Gouna, Egypt",
      pricePerDay: "2800",
      capacity: 12,
      cabins: 2,
      length: "42",
      yearBuilt: 2024,
      images: ["https://images.boatsgroup.com/images/1/17/29/de-antonio-yachts-d42-9141729-20240221104818-0.jpg"],
      amenities: ["Triple Outboard Engines", "Hidden Engine Design", "Walk-Around Deck", "Joystick Control", "Premium Interior", "Galley Kitchen", "Sound System", "Navigation Package"],
      ownerId: "owner-2",
      isActive: true,
      rating: "4.8",
      reviewCount: 89,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: "share-deantonio-d50-coupe",
    yachtId: "yacht-6",
    sharePrice: "€243,800",
    shareFraction: "1/5",
    usageDaysPerYear: 73,
    totalShares: 5,
    availableShares: 3,
    isActive: true,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "4,248"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-6",
      name: "De Antonio D50 Coupe",
      description: "The ultimate De Antonio flagship with premium enclosed coupe configuration. Features powerful triple outboard engines with advanced electronics and luxury appointments.",
      location: "El Gouna, Egypt",
      pricePerDay: "5200",
      capacity: 12,
      cabins: 2,
      length: "50",
      yearBuilt: 2024,
      images: ["https://images.boatsgroup.com/images/1/75/30/de-antonio-yachts-d50-coupe-9177530-20240404054946-0.jpg"],
      amenities: ["Triple Outboard Engines", "Enclosed Coupe Design", "Air Conditioning", "Advanced Navigation Package", "Hardtop with Sunroof", "Dual Swim Platforms", "Premium Audio", "Joystick Control"],
      ownerId: "owner-6",
      isActive: true,
      rating: "4.9",
      reviewCount: 56,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: "share-deantonio-d50-open",
    yachtId: "yacht-1",
    sharePrice: "€243,800",
    shareFraction: "1/5",
    usageDaysPerYear: 73,
    totalShares: 5,
    availableShares: 2,
    isActive: true,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "4,248"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-1",
      name: "De Antonio D50 Open",
      description: "The flagship De Antonio D50 Open with signature hidden outboard engines and expansive sundeck. Features Barcelona-engineered design with exceptional performance and luxury appointments.",
      location: "El Gouna, Egypt",
      pricePerDay: "4500",
      capacity: 12,
      cabins: 2,
      length: "50",
      yearBuilt: 2024,
      images: [
        "https://images.boatsgroup.com/images/1/51/79/de-antonio-yachts-d50-open-9275179-20240619063113-0.jpg",
        "https://images.boatsgroup.com/images/1/51/79/de-antonio-yachts-d50-open-9275179-20240619063114-1.jpg"
      ],
      amenities: ["Hidden Outboard Engines", "Spacious Sundeck", "Walk-Around Deck", "Premium Audio System", "Advanced Navigation", "Electric Windlass", "LED Lighting", "Freshwater Shower"],
      ownerId: "owner-1",
      isActive: true,
      rating: "4.8",
      reviewCount: 34,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: "share-deantonio-d28",
    yachtId: "yacht-5",
    sharePrice: "€40,740",
    shareFraction: "1/5",
    usageDaysPerYear: 73,
    totalShares: 5,
    availableShares: 1,
    isActive: true,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "710"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-5",
      name: "De Antonio D28 Open",
      description: "Award-winning 28-foot sportboat with imposing black console and hidden outboards. Features capacity for 10 guests with exceptional Barcelona design and 40 knot performance.",
      location: "El Gouna, Egypt",
      pricePerDay: "950",
      capacity: 10,
      cabins: 1,
      length: "28",
      yearBuilt: 2024,
      images: ["https://images.boatsgroup.com/images/1/63/84/de-antonio-yachts-d28-open-9226384-20240502160147-0.jpg"],
      amenities: ["Twin Outboard Engines", "40 Knots Top Speed", "Black Console Design", "Walk-Around Deck", "Full Bathroom", "V-Shaped Hull", "Audio System", "Swimming Platform"],
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
    totalPrice: "13500",
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
    description: "Fuel costs for De Antonio D50 Open booking",
    bookingId: "booking-1",
    createdAt: new Date()
  }
];

export const mockMessages: (Message & { sender: { name: string; avatar: string } })[] = [
  {
    id: "message-1",
    senderId: "owner-1",
    recipientId: "user-1",
    content: "Thank you for booking the De Antonio D50 Open! Our Barcelona-engineered yacht with signature hidden outboards and expansive sundeck will provide an unforgettable experience. Looking forward to hosting you.",
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
    content: "Welcome to the De Antonio D42 experience! This award-winning sport yacht features triple outboard engines with innovative hidden engine design for the ultimate performance. Can't wait to show you the Barcelona craftsmanship!",
    isRead: false,
    createdAt: new Date("2025-10-20"),
    sender: {
      name: "Sofia Martinez",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b0ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    }
  }
];
