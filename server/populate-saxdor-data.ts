import { db } from "./db";
import { yachts, ownershipOpportunities } from "@shared/schema";
import { eq } from "drizzle-orm";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Saxdor yacht data based on real models and pricing
const saxdorYachts = [
  {
    id: "yacht-1",
    name: "Saxdor 400 GTO Nordic Pearl",
    description: "The flagship Saxdor 400 GTO with signature 13-foot side terraces and twin-stepped hull. Features premium Finnish engineering with twin outboard configuration and exceptional performance.",
    location: "El Gouna, Egypt",
    pricePerDay: "2310.00",
    capacity: 12,
    cabins: 2,
    length: "40.00",
    yearBuilt: 2024,
    images: [
      "https://saxdoryachts.com/wp-content/uploads/2023/10/400-GTO-1.jpg",
      "https://saxdoryachts.com/wp-content/uploads/2023/10/400-GTO-2.jpg"
    ],
    amenities: ["13-Foot Side Terraces", "Twin-Stepped Hull", "Joystick Control", "Premium Audio System", "Advanced Navigation", "Electric Windlass", "LED Lighting", "Freshwater Shower"],
    ownerId: "owner-1",
    isActive: true,
    rating: "4.9",
    reviewCount: 127
  },
  {
    id: "yacht-2",
    name: "Saxdor 340 GTWA Baltic Explorer",
    description: "All-weather walkaround with superior performance and innovative design. Features twin Mercury V8 engines with advanced hull technology and spacious deck layout.",
    location: "El Gouna, Egypt",
    pricePerDay: "1295.00",
    capacity: 12,
    cabins: 2,
    length: "34.00",
    yearBuilt: 2024,
    images: [
      "https://saxdoryachts.com/wp-content/uploads/2023/10/340-GTWA-1.jpg",
      "https://saxdoryachts.com/wp-content/uploads/2023/10/340-GTWA-2.jpg"
    ],
    amenities: ["Twin Mercury 300HP V8", "All-Weather Design", "Side Terraces", "Joystick Control", "Premium Interior", "Galley Kitchen", "Sound System", "Navigation Package"],
    ownerId: "owner-2",
    isActive: true,
    rating: "4.8",
    reviewCount: 89
  },
  {
    id: "yacht-3",
    name: "Saxdor 320 GTC Scandinavian Star",
    description: "All-weather cabin cruiser with enclosed hard top and climate control. Features sound-isolated wheelhouse and advanced navigation systems with premium comfort.",
    location: "El Gouna, Egypt",
    pricePerDay: "1380.00",
    capacity: 10,
    cabins: 1,
    length: "32.00",
    yearBuilt: 2024,
    images: [
      "https://saxdoryachts.com/wp-content/uploads/2023/10/320-GTC-1.jpg",
      "https://saxdoryachts.com/wp-content/uploads/2023/10/320-GTC-2.jpg"
    ],
    amenities: ["Mercury 300HP Engine", "Sound-Isolated Cabin", "Climate Control", "Joystick Control", "Dual Displays", "Radar & VHF", "Lithium Systems", "Premium Interior"],
    ownerId: "owner-3",
    isActive: true,
    rating: "4.7",
    reviewCount: 156
  },
  {
    id: "yacht-4",
    name: "Saxdor 320 GTO Performance",
    description: "Award-winning sportboat with twin Mercury V8 engines reaching 50+ knots. Features convertible cockpit seating and twin-stepped hull for exceptional performance.",
    location: "El Gouna, Egypt",
    pricePerDay: "1155.00",
    capacity: 10,
    cabins: 1,
    length: "32.00",
    yearBuilt: 2024,
    images: [
      "https://saxdoryachts.com/wp-content/uploads/2023/10/320-GTO-1.jpg",
      "https://saxdoryachts.com/wp-content/uploads/2023/10/320-GTO-2.jpg"
    ],
    amenities: ["Twin Mercury 300HP V8", "50+ Knots Top Speed", "Twin-Stepped Hull", "Convertible Seating", "Full Cabin", "Galley Kitchen", "Premium Audio", "Joystick Control"],
    ownerId: "owner-4",
    isActive: true,
    rating: "4.6",
    reviewCount: 72
  },
  {
    id: "yacht-5",
    name: "Saxdor 270 GTO Compact",
    description: "Award-winning 27-foot sportboat with twin Mercury V6 engines. Features twin sunbeds and convertible dining, perfect for day cruising with exceptional performance.",
    location: "El Gouna, Egypt",
    pricePerDay: "760.00",
    capacity: 8,
    cabins: 1,
    length: "27.00",
    yearBuilt: 2024,
    images: [
      "https://saxdoryachts.com/wp-content/uploads/2023/10/270-GTO-1.jpg",
      "https://saxdoryachts.com/wp-content/uploads/2023/10/270-GTO-2.jpg"
    ],
    amenities: ["Twin Mercury 200HP V6", "Award-Winning Design", "Twin Sunbeds", "Convertible Dining", "Vacuum Infusion Hull", "Joystick Control", "Audio System", "Swimming Platform"],
    ownerId: "owner-5",
    isActive: true,
    rating: "4.5",
    reviewCount: 43
  },
  {
    id: "yacht-6",
    name: "Saxdor 400 GTO Premium",
    description: "The ultimate Saxdor flagship with premium configuration and extended side terraces. Features twin Mercury V10 engines with advanced electronics and luxury appointments.",
    location: "El Gouna, Egypt",
    pricePerDay: "3080.00",
    capacity: 12,
    cabins: 2,
    length: "40.00",
    yearBuilt: 2024,
    images: [
      "https://saxdoryachts.com/wp-content/uploads/2023/10/400-GTO-Premium-1.jpg",
      "https://saxdoryachts.com/wp-content/uploads/2023/10/400-GTO-Premium-2.jpg"
    ],
    amenities: ["Twin Mercury 400HP V10", "13-Foot Side Terraces", "Lithium Battery System", "Advanced Navigation Package", "Hardtop with Sunroof", "Dual Swim Platforms", "Premium Audio", "Joystick Control"],
    ownerId: "owner-6",
    isActive: true,
    rating: "4.9",
    reviewCount: 12
  }
];

// Ownership opportunities with 1/5 fractions only
const saxdorOwnershipOpportunities = [
  {
    id: "share-saxdor-320-gto",
    yachtId: "yacht-4",
    sharePrice: "33000.00",
    shareFraction: "1/5",
    usageDaysPerYear: 73,
    totalShares: 5,
    availableShares: 2,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "413.00"
    },
    isActive: true
  },
  {
    id: "share-saxdor-320-gtc",
    yachtId: "yacht-3",
    sharePrice: "39400.00",
    shareFraction: "1/5",
    usageDaysPerYear: 73,
    totalShares: 5,
    availableShares: 3,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "493.00"
    },
    isActive: true
  },
  {
    id: "share-saxdor-340-gtwa",
    yachtId: "yacht-2",
    sharePrice: "37000.00",
    shareFraction: "1/5",
    usageDaysPerYear: 73,
    totalShares: 5,
    availableShares: 1,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "463.00"
    },
    isActive: true
  },
  {
    id: "share-saxdor-400-gto-premium",
    yachtId: "yacht-6",
    sharePrice: "88000.00",
    shareFraction: "1/5",
    usageDaysPerYear: 73,
    totalShares: 5,
    availableShares: 3,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "1100.00"
    },
    isActive: true
  },
  {
    id: "share-saxdor-400-gto",
    yachtId: "yacht-1",
    sharePrice: "66000.00",
    shareFraction: "1/5",
    usageDaysPerYear: 73,
    totalShares: 5,
    availableShares: 2,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "825.00"
    },
    isActive: true
  },
  {
    id: "share-saxdor-270-gto",
    yachtId: "yacht-5",
    sharePrice: "21800.00",
    shareFraction: "1/5",
    usageDaysPerYear: 73,
    totalShares: 5,
    availableShares: 1,
    financing: {
      available: true,
      downPaymentPercent: 25,
      termMonths: 60,
      monthlyPayment: "273.00"
    },
    isActive: true
  }
];

export async function populateSaxdorData() {
  console.log("🚤 Starting Saxdor data population...");

  try {
    // Clear existing data
    console.log("🗑️ Clearing existing data...");
    await db.delete(ownershipOpportunities);
    await db.delete(yachts);

    // Insert Saxdor yachts
    console.log("🛥️ Inserting Saxdor yachts...");
    for (const yacht of saxdorYachts) {
      await db.insert(yachts).values(yacht);
      console.log(`✅ Inserted: ${yacht.name}`);
    }

    // Insert ownership opportunities
    console.log("🤝 Inserting ownership opportunities...");
    for (const opportunity of saxdorOwnershipOpportunities) {
      await db.insert(ownershipOpportunities).values(opportunity);
      console.log(`✅ Inserted ownership for yacht ${opportunity.yachtId}: ${opportunity.shareFraction} share at $${opportunity.sharePrice}`);
    }

    console.log("🎉 Saxdor data population complete!");
    console.log(`📊 Inserted ${saxdorYachts.length} yachts and ${saxdorOwnershipOpportunities.length} ownership opportunities`);

  } catch (error) {
    console.error("❌ Error populating Saxdor data:", error);
    throw error;
  }
}

// Run if called directly
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (import.meta.url === `file://${process.argv[1]}`) {
  populateSaxdorData()
    .then(() => {
      console.log("Database population completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Database population failed:", error);
      process.exit(1);
    });
}