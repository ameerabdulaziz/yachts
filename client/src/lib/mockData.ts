import { Yacht, OwnershipOpportunity, Booking, FuelTransaction, Message } from "@shared/schema";
import deAntonioD50 from "@assets/image_1754579474724.png";
import deAntonioD50Aerial from "@assets/de antonio D50 (1)_1754331061302.jpg";

export const mockYachts: (Yacht & { owner: { name: string; avatar: string; verified: boolean; rating: number } })[] = [
  {
    id: "yacht-1",
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
      "https://static.wixstatic.com/media/0fb4c8_6858e9c5176b4ce29966b597a896ba3df000.jpg/v1/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/0fb4c8_6858e9c5176b4ce29966b597a896ba3df000.jpg"
    ],
    amenities: ["Hidden Outboard Engines", "Flexiteek Synthetic Teak Deck", "Outdoor Kitchen", "Fusion Audio System", "Simrad Navigation", "Electric Windlass", "LED Lighting", "Freshwater Shower"],
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
    description: "Award-winning design with triple Mercury 400 HP concealed outboards. Features walk-around design with large sundecks and convertible center seating arrangements.",
    location: "El Gouna, Egypt",
    pricePerDay: "2800",
    capacity: 12,
    cabins: 2,
    length: "42",
    yearBuilt: 2026,
    images: [
      "https://static.wixstatic.com/media/0fb4c8_008f1545c8764f8789a2b7415ca9dde7~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D42.jpg",
      "https://static.wixstatic.com/media/0fb4c8_7c755f09d13f412dbc05e7e373459d1ff000.jpg/v1/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/0fb4c8_7c755f09d13f412dbc05e7e373459d1ff000.jpg"
    ],
    amenities: ["Triple Mercury 400HP Outboards", "Walk-around Design", "Bow Lounge Area", "Convertible Center Seats", "Exterior Kitchen", "Large Sundecks", "Premium Sound System", "Navigation Package"],
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
    name: "De Antonio D36 Open",
    description: "Best-selling model with 350 HP V10 VERADO engine and hydraulic steering. Features practical outdoor galley and generous seating with walkaround deck design.",
    location: "El Gouna, Egypt",
    pricePerDay: "2200",
    capacity: 12,
    cabins: 1,
    length: "36",
    yearBuilt: 2026,
    images: [
      "https://static.wixstatic.com/media/0fb4c8_fbbb6a2569c747d48881f7ac065b947a~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D36.jpg",
      "https://static.wixstatic.com/media/0fb4c8_8b966046562f427b8b62d4479b53d852f000.jpg/v1/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/0fb4c8_8b966046562f427b8b62d4479b53d852f000.jpg"
    ],
    amenities: ["350HP V10 VERADO Engine", "Hydraulic Steering", "Outdoor Galley", "Walkaround Deck", "Large Central Table", "Pilot Area Seating", "VHF Radio", "Bilge Pumps"],
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
    name: "De Antonio D32 Open",
    description: "Newest compact model with 2 × 300 HP V-8 Fourstroke engines. Features practical outdoor galley in center and three seats in pilot area with generous bench seating.",
    location: "El Gouna, Egypt",
    pricePerDay: "1800",
    capacity: 10,
    cabins: 2,
    length: "32",
    yearBuilt: 2026,
    images: [
      "https://static.wixstatic.com/media/0fb4c8_6cbbd012fc0645009bc4a91a412b293a~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D32.jpg",
      "https://static.wixstatic.com/media/0fb4c8_b477bd8bfe504485855871529fcb3f53f000.jpg/v1/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/0fb4c8_b477bd8bfe504485855871529fcb3f53f000.jpg"
    ],
    amenities: ["Dual 300HP V-8 Fourstroke", "Central Outdoor Galley", "Three Pilot Seats", "Generous Bench Seating", "650L Fuel Tank", "100L Freshwater", "80L Blackwater Tank", "CE Certification"],
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
    name: "De Antonio D29 Open",
    description: "Elegant compact yacht with innovative space optimization. Perfect for day cruising with De Antonio's signature hidden outboard design and contemporary styling.",
    location: "El Gouna, Egypt",
    pricePerDay: "1600",
    capacity: 8,
    cabins: 1,
    length: "29",
    yearBuilt: 2026,
    images: [
      "https://static.wixstatic.com/media/0fb4c8_b9744cfa841b4c4388ad78ac9b49bbe7~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D29.jpg",
      "https://static.wixstatic.com/media/0fb4c8_37f396843d334191b8a1d91b9c519f33f000.jpg/v1/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/0fb4c8_37f396843d334191b8a1d91b9c519f33f000.jpg"
    ],
    amenities: ["Hidden Outboard Design", "Space Optimization", "Contemporary Styling", "Practical Layout", "Premium Finish", "Navigation Lights", "Audio System", "Swimming Platform"],
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
    name: "De Antonio D60 Open",
    description: "The new flagship model with four hidden outboard engines and unmatched luxury. Available for 2026 delivery with customizable layout options and premium Barcelona craftsmanship.",
    location: "El Gouna, Egypt",
    pricePerDay: "4200",
    capacity: 12,
    cabins: 3,
    length: "60",
    yearBuilt: 2026,
    images: [
      "https://static.wixstatic.com/media/5c3629_a8b1aa6ff9244bddaf7383aa45b4afc1~mv2.jpg/v1/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/5c3629_a8b1aa6ff9244bddaf7383aa45b4afc1~mv2.jpg",
      "https://static.wixstatic.com/media/0fb4c8_038f4da53a4848a784b7c1d1bac8dfdb~mv2.jpg/v1/fill/w_800,h_400,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/D60%20PLANTA%20EXTERIOR%20HARD%20TOP.jpg"
    ],
    amenities: ["Four Hidden Outboard Engines", "Master Stateroom", "Up to 3 Cabins", "Hot Tub", "Walk-around Design", "46 Knots Top Speed", "2400HP Max Power", "Premium Finishes"],
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
    name: "De Antonio D50 Coupe",
    description: "Enclosed version of the flagship D50 with climate-controlled cabin and weather protection. Features the signature hidden outboard design with luxury accommodations.",
    location: "El Gouna, Egypt",
    pricePerDay: "3600",
    capacity: 12,
    cabins: 2,
    length: "50",
    yearBuilt: 2026,
    images: [
      "https://static.wixstatic.com/media/0fb4c8_60988eb5cf834fcb876c1d06bd8af594~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D50.jpg",
      "https://static.wixstatic.com/media/0fb4c8_6858e9c5176b4ce29966b597a896ba3df000.jpg/v1/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/0fb4c8_6858e9c5176b4ce29966b597a896ba3df000.jpg"
    ],
    amenities: ["Climate Control", "Enclosed Hard Top", "Hidden Outboard Engines", "Premium Interior", "Navigation Package", "Entertainment System", "Galley Kitchen", "Head Compartment"],
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
      images: ["https://static.wixstatic.com/media/0fb4c8_fbbb6a2569c747d48881f7ac065b947a~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D36.jpg"],
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
