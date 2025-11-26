import { Yacht, OwnershipOpportunity, Booking, FuelTransaction, Message } from "@shared/schema";

export const mockYachts: (Yacht & { owner: { name: string; avatar: string; verified: boolean; rating: number } })[] = [
  {
    id: "yacht-1",
    name: "De Antonio D29",
    description: "The D29 is a 29-foot walk-around boat with hidden outboard engines, dual panoramic screens, and a forward cabin with double bed and full bathroom. Available in hardtop and softop versions.",
    location: "El Gouna, Egypt",
    pricePerDay: "€1,425",
    capacity: 10,
    cabins: 1,
    length: "29",
    yearBuilt: 2024,
    images: [
      "https://static.wixstatic.com/media/0fb4c8_b9744cfa841b4c4388ad78ac9b49bbe7~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D29.jpg"
    ],
    amenities: ["Hidden Outboard Engines", "Walk-Around Deck", "Dual Panoramic Screens", "Forward Cabin", "Full Bathroom", "300-400HP Engine", "360L Fuel Tank", "88L Water Tank"],
    ownerId: "owner-1",
    isActive: true,
    rating: "4.8",
    reviewCount: 127,
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: {
      name: "Marc Fernandez",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      verified: true,
      rating: 5.0
    }
  },
  {
    id: "yacht-2",
    name: "De Antonio D33",
    description: "The D33 is a compact design boat with V-shaped hull and all the comforts. Features a spacious walk-around deck, galley, 2 cabins and separate bathroom with 50 knots top speed.",
    location: "El Gouna, Egypt",
    pricePerDay: "€2,060",
    capacity: 10,
    cabins: 2,
    length: "33",
    yearBuilt: 2024,
    images: [
      "https://static.wixstatic.com/media/0fb4c8_6cbbd012fc0645009bc4a91a412b293a~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D32.jpg"
    ],
    amenities: ["V-Shaped Hull", "Walk-Around Deck", "2 Cabins", "Separate Bathroom", "400-600HP Engine", "585L Fuel Tank", "100L Water Tank", "50 Knots Max Speed"],
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
    name: "De Antonio D36",
    description: "Award-winning Best European Powerboat of the Year 2023. The D36 exudes design and originality with unique deck solutions, exceptional interior space and powerful engine for a singular experience.",
    location: "El Gouna, Egypt",
    pricePerDay: "€2,840",
    capacity: 12,
    cabins: 2,
    length: "36",
    yearBuilt: 2024,
    images: [
      "https://static.wixstatic.com/media/0fb4c8_fbbb6a2569c747d48881f7ac065b947a~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D36.jpg"
    ],
    amenities: ["Award-Winning Design", "2 Cabins", "1 Bathroom", "600-800HP Engine", "850L Fuel Tank", "150L Water Tank", "27 Knots Cruise", "45 Knots Max Speed"],
    ownerId: "owner-3",
    isActive: true,
    rating: "4.9",
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
    name: "De Antonio D42",
    description: "Over 12 metres of space with 3 powerful outboard engines. Features very spacious deck with three spaces, exterior galley and large sundeck at the stern for exceptional day cruising and overnight stays.",
    location: "El Gouna, Egypt",
    pricePerDay: "€3,420",
    capacity: 12,
    cabins: 2,
    length: "42",
    yearBuilt: 2024,
    images: [
      "https://static.wixstatic.com/media/0fb4c8_008f1545c8764f8789a2b7415ca9dde7~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D42.jpg"
    ],
    amenities: ["Triple Outboard Engines", "Exterior Galley", "Large Sundeck", "2 Cabins", "1 Bathroom", "900-1200HP Engine", "1300L Fuel Tank", "46 Knots Max Speed"],
    ownerId: "owner-4",
    isActive: true,
    rating: "4.9",
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
    name: "De Antonio D50",
    description: "Extraordinary 50-foot yacht capable of 50 knots with unequalled comfort in all spaces. Choose from 2 or 3 cabins, 1 or 2 bathrooms, and 2 to 4 engines for the perfect configuration.",
    location: "El Gouna, Egypt",
    pricePerDay: "€4,470",
    capacity: 12,
    cabins: 3,
    length: "50",
    yearBuilt: 2024,
    images: [
      "https://static.wixstatic.com/media/0fb4c8_60988eb5cf834fcb876c1d06bd8af594~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D50.jpg"
    ],
    amenities: ["2-3 Cabins", "1-2 Bathrooms", "2-4 Engine Options", "1200-1600HP Power", "1500L Fuel Tank", "340L Water Tank", "30 Knots Cruise", "50 Knots Max Speed"],
    ownerId: "owner-5",
    isActive: true,
    rating: "4.7",
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
    name: "De Antonio D60",
    description: "The flagship D60 masterpiece. Balanced, avant-garde, elegant and timeless design offering a unique sailing experience with extraordinary performance, hidden jacuzzi and smart technology.",
    location: "El Gouna, Egypt",
    pricePerDay: "€8,465",
    capacity: 12,
    cabins: 3,
    length: "60",
    yearBuilt: 2024,
    images: [
      "https://static.wixstatic.com/media/5c3629_a8b1aa6ff9244bddaf7383aa45b4afc1~mv2.jpg/v1/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/5c3629_a8b1aa6ff9244bddaf7383aa45b4afc1~mv2.jpg"
    ],
    amenities: ["2-3 Cabins", "2 Bathrooms", "Hidden Jacuzzi", "Aft Tender Garage", "2400HP Max Power", "30 Knots Cruise", "46 Knots Max Speed", "Smart Technology"],
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
  }
];

export const mockOwnershipOpportunities: (OwnershipOpportunity & { yacht: Yacht })[] = [
  {
    id: "share-deantonio-d29",
    yachtId: "yacht-1",
    sharePrice: "€42,750",
    shareFraction: "1/5",
    usageDaysPerYear: 73,
    totalShares: 5,
    availableShares: 2,
    isActive: true,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "745"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-1",
      name: "De Antonio D29",
      description: "The D29 is a 29-foot walk-around boat with hidden outboard engines, dual panoramic screens, and a forward cabin with double bed and full bathroom.",
      location: "El Gouna, Egypt",
      pricePerDay: "1425",
      capacity: 10,
      cabins: 1,
      length: "29",
      yearBuilt: 2024,
      images: ["https://static.wixstatic.com/media/0fb4c8_b9744cfa841b4c4388ad78ac9b49bbe7~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D29.jpg"],
      amenities: ["Hidden Outboard Engines", "Walk-Around Deck", "Dual Panoramic Screens", "Forward Cabin", "Full Bathroom"],
      ownerId: "owner-1",
      isActive: true,
      rating: "4.8",
      reviewCount: 127,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: "share-deantonio-d33",
    yachtId: "yacht-2",
    sharePrice: "€61,800",
    shareFraction: "1/5",
    usageDaysPerYear: 73,
    totalShares: 5,
    availableShares: 3,
    isActive: true,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "1,077"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-2",
      name: "De Antonio D33",
      description: "The D33 is a compact design boat with V-shaped hull and all the comforts. Features a spacious walk-around deck, galley, 2 cabins and separate bathroom.",
      location: "El Gouna, Egypt",
      pricePerDay: "2060",
      capacity: 10,
      cabins: 2,
      length: "33",
      yearBuilt: 2024,
      images: ["https://static.wixstatic.com/media/0fb4c8_6cbbd012fc0645009bc4a91a412b293a~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D32.jpg"],
      amenities: ["V-Shaped Hull", "Walk-Around Deck", "2 Cabins", "Separate Bathroom", "50 Knots Max Speed"],
      ownerId: "owner-2",
      isActive: true,
      rating: "4.8",
      reviewCount: 89,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: "share-deantonio-d36",
    yachtId: "yacht-3",
    sharePrice: "€85,200",
    shareFraction: "1/5",
    usageDaysPerYear: 73,
    totalShares: 5,
    availableShares: 1,
    isActive: true,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "1,485"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-3",
      name: "De Antonio D36",
      description: "Award-winning Best European Powerboat of the Year 2023. The D36 exudes design and originality with unique deck solutions.",
      location: "El Gouna, Egypt",
      pricePerDay: "2840",
      capacity: 12,
      cabins: 2,
      length: "36",
      yearBuilt: 2024,
      images: ["https://static.wixstatic.com/media/0fb4c8_fbbb6a2569c747d48881f7ac065b947a~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D36.jpg"],
      amenities: ["Award-Winning Design", "2 Cabins", "1 Bathroom", "600-800HP Engine", "45 Knots Max Speed"],
      ownerId: "owner-3",
      isActive: true,
      rating: "4.9",
      reviewCount: 156,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: "share-deantonio-d42",
    yachtId: "yacht-4",
    sharePrice: "€102,600",
    shareFraction: "1/5",
    usageDaysPerYear: 73,
    totalShares: 5,
    availableShares: 2,
    isActive: true,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "1,788"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-4",
      name: "De Antonio D42",
      description: "Over 12 metres of space with 3 powerful outboard engines. Features very spacious deck with three spaces, exterior galley and large sundeck.",
      location: "El Gouna, Egypt",
      pricePerDay: "3420",
      capacity: 12,
      cabins: 2,
      length: "42",
      yearBuilt: 2024,
      images: ["https://static.wixstatic.com/media/0fb4c8_008f1545c8764f8789a2b7415ca9dde7~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D42.jpg"],
      amenities: ["Triple Outboard Engines", "Exterior Galley", "Large Sundeck", "2 Cabins", "46 Knots Max Speed"],
      ownerId: "owner-4",
      isActive: true,
      rating: "4.9",
      reviewCount: 72,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: "share-deantonio-d50",
    yachtId: "yacht-5",
    sharePrice: "€134,100",
    shareFraction: "1/5",
    usageDaysPerYear: 73,
    totalShares: 5,
    availableShares: 3,
    isActive: true,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "2,337"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-5",
      name: "De Antonio D50",
      description: "Extraordinary 50-foot yacht capable of 50 knots with unequalled comfort in all spaces.",
      location: "El Gouna, Egypt",
      pricePerDay: "4470",
      capacity: 12,
      cabins: 3,
      length: "50",
      yearBuilt: 2024,
      images: ["https://static.wixstatic.com/media/0fb4c8_60988eb5cf834fcb876c1d06bd8af594~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D50.jpg"],
      amenities: ["2-3 Cabins", "1-2 Bathrooms", "1200-1600HP Power", "50 Knots Max Speed"],
      ownerId: "owner-5",
      isActive: true,
      rating: "4.7",
      reviewCount: 43,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: "share-deantonio-d60",
    yachtId: "yacht-6",
    sharePrice: "€253,950",
    shareFraction: "1/5",
    usageDaysPerYear: 73,
    totalShares: 5,
    availableShares: 1,
    isActive: true,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "4,426"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-6",
      name: "De Antonio D60",
      description: "The flagship D60 masterpiece with extraordinary performance, hidden jacuzzi and smart technology.",
      location: "El Gouna, Egypt",
      pricePerDay: "8465",
      capacity: 12,
      cabins: 3,
      length: "60",
      yearBuilt: 2024,
      images: ["https://static.wixstatic.com/media/5c3629_a8b1aa6ff9244bddaf7383aa45b4afc1~mv2.jpg/v1/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/5c3629_a8b1aa6ff9244bddaf7383aa45b4afc1~mv2.jpg"],
      amenities: ["2-3 Cabins", "2 Bathrooms", "Hidden Jacuzzi", "2400HP Max Power", "46 Knots Max Speed"],
      ownerId: "owner-6",
      isActive: true,
      rating: "4.9",
      reviewCount: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
];

export const mockBookings: (Booking & { yacht: Yacht })[] = [
  {
    id: "booking-1",
    yachtId: "yacht-4",
    userId: "user-1",
    startDate: new Date("2025-10-16"),
    endDate: new Date("2025-10-19"),
    guestCount: 6,
    totalPrice: "10260",
    status: "confirmed",
    addOns: { captain: true, catering: false },
    paymentMethod: "credit-card",
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: mockYachts[3]
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
    description: "Fuel costs for De Antonio D42 booking",
    bookingId: "booking-1",
    createdAt: new Date()
  }
];

export const mockMessages: (Message & { sender: { name: string; avatar: string } })[] = [
  {
    id: "message-1",
    senderId: "owner-4",
    recipientId: "user-1",
    content: "Thank you for booking the De Antonio D42! This Barcelona-engineered yacht with triple outboard engines and spacious sundeck will provide an unforgettable experience. Looking forward to hosting you.",
    isRead: false,
    createdAt: new Date(),
    sender: {
      name: "Carlos Mendez",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    }
  },
  {
    id: "message-2",
    senderId: "owner-6",
    recipientId: "user-1",
    content: "Welcome to the De Antonio D60 experience! This flagship yacht features extraordinary 2400HP power with hidden jacuzzi and smart technology. Can't wait to show you the Barcelona craftsmanship!",
    isRead: false,
    createdAt: new Date("2025-10-20"),
    sender: {
      name: "Alessandro Rossi",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    }
  }
];
