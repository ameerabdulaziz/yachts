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
    id: "share-d32",
    yachtId: "yacht-4",
    sharePrice: "57143",
    shareFraction: "1/7",
    usageDaysPerYear: 48,
    totalShares: 7,
    availableShares: 2,
    isActive: true,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "715"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-4",
      name: "De Antonio D32 Open",
      description: "Newest compact model with 2 × 300 HP V-8 Fourstroke engines. Features practical outdoor galley in center and three seats in pilot area with generous bench seating.",
      location: "El Gouna, Egypt",
      pricePerDay: "1800",
      capacity: 10,
      cabins: 2,
      length: "32",
      yearBuilt: 2026,
      images: ["https://static.wixstatic.com/media/0fb4c8_6cbbd012fc0645009bc4a91a412b293a~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D32.jpg"],
      amenities: ["Dual 300HP V-8 Fourstroke", "Central Outdoor Galley", "Three Pilot Seats", "Generous Bench Seating", "650L Fuel Tank", "100L Freshwater", "80L Blackwater Tank", "CE Certification"],
      ownerId: "owner-4",
      isActive: true,
      rating: "4.6",
      reviewCount: 72,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: "share-d36",
    yachtId: "yacht-3",
    sharePrice: "71429",
    shareFraction: "1/7",
    usageDaysPerYear: 48,
    totalShares: 7,
    availableShares: 3,
    isActive: true,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "893"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-3",
      name: "De Antonio D36 Open",
      description: "Best-selling model with 350 HP V10 VERADO engine and hydraulic steering. Features practical outdoor galley and generous seating with walkaround deck design.",
      location: "El Gouna, Egypt",
      pricePerDay: "2200",
      capacity: 12,
      cabins: 1,
      length: "36",
      yearBuilt: 2026,
      images: [deAntonioD36],
      amenities: ["350HP V10 VERADO Engine", "Hydraulic Steering", "Outdoor Galley", "Walkaround Deck", "Large Central Table", "Pilot Area Seating", "VHF Radio", "Bilge Pumps"],
      ownerId: "owner-3",
      isActive: true,
      rating: "4.7",
      reviewCount: 156,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: "share-d42",
    yachtId: "yacht-2",
    sharePrice: "81250",
    shareFraction: "1/8",
    usageDaysPerYear: 40,
    totalShares: 8,
    availableShares: 1,
    isActive: true,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "1016"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-2",
      name: "De Antonio D42 Open",
      description: "Award-winning design with triple Mercury 400 HP concealed outboards. Features walk-around design with large sundecks and convertible center seating arrangements.",
      location: "El Gouna, Egypt",
      pricePerDay: "2800",
      capacity: 12,
      cabins: 2,
      length: "42",
      yearBuilt: 2026,
      images: ["https://static.wixstatic.com/media/0fb4c8_008f1545c8764f8789a2b7415ca9dde7~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D42.jpg"],
      amenities: ["Triple Mercury 400HP Outboards", "Walk-around Design", "Bow Lounge Area", "Convertible Center Seats", "Exterior Kitchen", "Large Sundecks", "Premium Sound System", "Navigation Package"],
      ownerId: "owner-2",
      isActive: true,
      rating: "4.8",
      reviewCount: 89,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: "share-d60",
    yachtId: "yacht-6",
    sharePrice: "166667",
    shareFraction: "1/12",
    usageDaysPerYear: 27,
    totalShares: 12,
    availableShares: 3,
    isActive: true,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "2083"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-6",
      name: "De Antonio D60 Open",
      description: "The ultimate luxury yacht with innovative space optimization and hidden outboard technology. Perfect for fractional ownership with premium amenities and Barcelona's finest craftsmanship.",
      location: "El Gouna, Egypt",
      pricePerDay: "4200",
      capacity: 12,
      cabins: 3,
      length: "60",
      yearBuilt: 2026,
      images: ["https://static.wixstatic.com/media/0fb4c8_1105b00d73ee4ddc9f1ad1d4b74d9ece~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D60.jpg"],
      amenities: ["Premium Hidden Outboards", "Master Suite", "VIP Cabin", "Outdoor Kitchen", "Premium Audio", "Advanced Navigation", "Flexiteek Decking", "Luxury Finishes"],
      ownerId: "owner-6",
      isActive: true,
      rating: "4.9",
      reviewCount: 56,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: "share-d50",
    yachtId: "yacht-1",
    sharePrice: "100000",
    shareFraction: "1/10",
    usageDaysPerYear: 32,
    totalShares: 10,
    availableShares: 2,
    isActive: true,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "1250"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-7",
      name: "De Antonio D50 Open",
      description: "The flagship model with hidden outboard engines, featuring a continuous wide stern platform and optimized hydrodynamics. Perfect for luxury day cruising with exceptional space optimization.",
      location: "El Gouna, Egypt",
      pricePerDay: "3200",
      capacity: 12,
      cabins: 2,
      length: "50",
      yearBuilt: 2026,
      images: [
        deAntonioD50,
        deAntonioD50Aerial,
        "https://static.wixstatic.com/media/0fb4c8_6858e9c5176b4ce29966b597a896ba3df000.jpg/v1/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/0fb4c8_6858e9c5176b4ce29966b597a896ba3df000.jpg"
      ],
      amenities: ["Hidden Outboard Engines", "Flexiteek Synthetic Teak Deck", "Outdoor Kitchen", "Fusion Audio System", "Simrad Navigation", "Electric Windlass", "LED Lighting", "Freshwater Shower"],
      ownerId: "owner-1",
      isActive: true,
      rating: "4.8",
      reviewCount: 34,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: "share-e23",
    yachtId: "yacht-8",
    sharePrice: "58000",
    shareFraction: "1/4",
    usageDaysPerYear: 80,
    totalShares: 4,
    availableShares: 1,
    isActive: true,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "725"
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    yacht: {
      id: "yacht-8",
      name: "De Antonio E23",
      description: "Revolutionary electric yacht with zero emissions and whisper-quiet operation. Features sustainable luxury with De Antonio's signature design language and innovative electric propulsion.",
      location: "El Gouna, Egypt",
      pricePerDay: "2400",
      capacity: 8,
      cabins: 1,
      length: "23",
      yearBuilt: 2026,
      images: ["https://static.wixstatic.com/media/0fb4c8_44dd9413f85a474e8822360eec904262~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_E23.jpg"],
      amenities: ["Electric Propulsion", "Zero Emissions", "Silent Operation", "Solar Panels", "Premium Interior", "Touch Screen Controls", "LED Lighting", "Sustainable Materials"],
      ownerId: "owner-8",
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
    content: "Thank you for booking the De Antonio D50 Open! Our Barcelona-crafted yacht with hidden outboard engines will provide an unforgettable experience. Looking forward to hosting you.",
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
    content: "Welcome to the De Antonio D42 Open experience! This award-winning yacht features triple Mercury 400HP concealed outboards for the ultimate performance. Can't wait to show you the innovative design!",
    isRead: false,
    createdAt: new Date("2025-10-20"),
    sender: {
      name: "Sofia Martinez",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b0ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    }
  }
];
