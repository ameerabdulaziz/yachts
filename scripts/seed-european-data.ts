import { storage } from "../server/storage";

async function seedEuropeanData() {
  console.log("Seeding European market data...");

  // Create European Dealers
  const dealers = [
    {
      name: "Mediterranean Yachts Barcelona",
      region: "Spain",
      country: "Spain",
      city: "Barcelona",
      address: "Port Vell, Moll de la Fusta, 08002 Barcelona",
      phone: "+34 93 221 4567",
      email: "info@medyachts-barcelona.es",
      contactPerson: "Carlos Rodriguez",
      status: "active",
    },
    {
      name: "Côte d'Azur Marine",
      region: "France",
      country: "France", 
      city: "Nice",
      address: "Port de Nice, Quai Amiral Infernet, 06300 Nice",
      phone: "+33 4 93 89 1234",
      email: "contact@coteazurmarine.fr",
      contactPerson: "Jean-Pierre Dubois",
      status: "active",
    },
    {
      name: "Adriatic Luxury Boats",
      region: "Croatia",
      country: "Croatia",
      city: "Split",
      address: "ACI Marina Split, Put Supavla 1, 21000 Split",
      phone: "+385 21 456 789",
      email: "sales@adriaticluxury.hr",
      contactPerson: "Marko Petrović",
      status: "active",
    },
    {
      name: "Italian Riviera Yachts",
      region: "Italy",
      country: "Italy",
      city: "Portofino",
      address: "Calata Marconi 12, 16034 Portofino",
      phone: "+39 0185 269 123",
      email: "info@italianrivierayachts.it",
      contactPerson: "Marco Bianchi",
      status: "active",
    },
    {
      name: "Greek Islands Marine",
      region: "Greece",
      country: "Greece",
      city: "Athens",
      address: "Alimos Marina, 174 55 Alimos",
      phone: "+30 210 985 4321",
      email: "info@greekislandsmarine.gr",
      contactPerson: "Nikolaos Papadopoulos",
      status: "active",
    },
  ];

  const createdDealers: any[] = [];
  for (const dealer of dealers) {
    try {
      const created = await storage.createDealer(dealer);
      createdDealers.push(created);
      console.log(`Created dealer: ${dealer.name}`);
    } catch (e) {
      console.log(`Dealer may already exist: ${dealer.name}`);
    }
  }

  // Create European Customers
  const customers = [
    { phone: "+34612345678", firstName: "Miguel", lastName: "García", email: "miguel.garcia@email.es", role: "owner", fuelBalance: "2500" },
    { phone: "+33612345678", firstName: "Sophie", lastName: "Martin", email: "sophie.martin@email.fr", role: "owner", fuelBalance: "3200" },
    { phone: "+39321654987", firstName: "Alessandro", lastName: "Rossi", email: "a.rossi@email.it", role: "renter", fuelBalance: "500" },
    { phone: "+385912345678", firstName: "Ana", lastName: "Kovač", email: "ana.kovac@email.hr", role: "renter", fuelBalance: "800" },
    { phone: "+30698765432", firstName: "Dimitris", lastName: "Alexopoulos", email: "d.alexopoulos@email.gr", role: "owner", fuelBalance: "4100" },
    { phone: "+49171234567", firstName: "Hans", lastName: "Müller", email: "hans.mueller@email.de", role: "investor", fuelBalance: "1500" },
    { phone: "+31612345678", firstName: "Willem", lastName: "de Vries", email: "w.devries@email.nl", role: "owner", fuelBalance: "2800" },
    { phone: "+44789012345", firstName: "James", lastName: "Thompson", email: "j.thompson@email.co.uk", role: "renter", fuelBalance: "600" },
    { phone: "+351912345678", firstName: "João", lastName: "Silva", email: "joao.silva@email.pt", role: "renter", fuelBalance: "450" },
    { phone: "+41789012345", firstName: "Lukas", lastName: "Schneider", email: "l.schneider@email.ch", role: "investor", fuelBalance: "5000" },
  ];

  for (const customer of customers) {
    try {
      await storage.createUser(customer);
      console.log(`Created customer: ${customer.firstName} ${customer.lastName}`);
    } catch (e) {
      console.log(`Customer may already exist: ${customer.firstName}`);
    }
  }

  // Get dealer IDs for creating boats and skippers
  const allDealers = await storage.getAllDealers();
  if (allDealers.length === 0) {
    console.log("No dealers found, skipping boats and skippers");
    return;
  }

  // Create Skippers for each dealer
  const skipperData = [
    { firstName: "Pablo", lastName: "Fernández", email: "pablo.fernandez@skipper.es", phone: "+34655123456", licenseType: "RYA Yachtmaster Ocean", yearsExperience: 15, dailyRate: "450", rating: "4.9", status: "active" },
    { firstName: "Pierre", lastName: "Moreau", email: "pierre.moreau@skipper.fr", phone: "+33677889900", licenseType: "RYA Yachtmaster Offshore", yearsExperience: 12, dailyRate: "400", rating: "4.8", status: "active" },
    { firstName: "Luka", lastName: "Jurić", email: "luka.juric@skipper.hr", phone: "+385987654321", licenseType: "RYA Yachtmaster", yearsExperience: 8, dailyRate: "350", rating: "4.7", status: "active" },
    { firstName: "Giovanni", lastName: "Ferrari", email: "g.ferrari@skipper.it", phone: "+39345678901", licenseType: "MCA STCW", yearsExperience: 20, dailyRate: "500", rating: "5.0", status: "on_trip" },
    { firstName: "Kostas", lastName: "Stavros", email: "k.stavros@skipper.gr", phone: "+30694567890", licenseType: "RYA Yachtmaster Offshore", yearsExperience: 10, dailyRate: "380", rating: "4.6", status: "active" },
  ];

  const createdSkippers: any[] = [];
  for (let i = 0; i < skipperData.length; i++) {
    const dealer = allDealers[i % allDealers.length];
    try {
      const skipper = await storage.createSkipper({
        ...skipperData[i],
        dealerId: dealer.id,
        halfDayRate: String(Math.round(Number(skipperData[i].dailyRate) * 0.6)),
        overnightRate: String(Math.round(Number(skipperData[i].dailyRate) * 1.2)),
        totalTrips: Math.floor(Math.random() * 200) + 50,
      });
      createdSkippers.push(skipper);
      console.log(`Created skipper: ${skipperData[i].firstName} ${skipperData[i].lastName}`);
    } catch (e) {
      console.log(`Skipper may already exist: ${skipperData[i].firstName}`);
    }
  }

  // Get fleet models and create dealer boats
  const fleetModels = await storage.getAllFleetModels();
  const createdBoats: any[] = [];

  for (const dealer of allDealers.slice(0, 3)) {
    for (const model of fleetModels.slice(0, 3)) {
      try {
        const boat = await storage.createDealerBoat({
          dealerId: dealer.id,
          fleetModelId: model.id,
          name: `${model.modelName} - ${dealer.city}`,
          hullNumber: `DA${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          yearBuilt: 2023,
          totalPrice: model.basePrice,
          numberOfFractions: 5,
          status: "available",
          homePort: dealer.city,
          currentLocation: dealer.city,
        });
        createdBoats.push(boat);
        console.log(`Created boat: ${boat.name}`);
      } catch (e) {
        console.log(`Boat creation skipped`);
      }
    }
  }

  // Create Skipper Assignments
  const allSkippers = await storage.getAllSkippers();
  const allBoats = await storage.getAllDealerBoats();

  if (allSkippers.length > 0 && allBoats.length > 0) {
    const assignments = [
      { title: "Barcelona to Ibiza Charter", assignmentType: "charter", departurePort: "Barcelona", arrivalPort: "Ibiza", guestCount: 6, paymentAmount: "2800", status: "completed" },
      { title: "Nice Day Trip", assignmentType: "charter", departurePort: "Nice", arrivalPort: "Monaco", guestCount: 4, paymentAmount: "1500", status: "completed" },
      { title: "Split Island Hopping", assignmentType: "charter", departurePort: "Split", arrivalPort: "Hvar", guestCount: 8, paymentAmount: "2200", status: "in_progress" },
      { title: "Portofino Sunset Cruise", assignmentType: "owner_trip", departurePort: "Portofino", arrivalPort: "Portofino", guestCount: 4, paymentAmount: "800", status: "scheduled" },
      { title: "Athens to Mykonos Delivery", assignmentType: "delivery", departurePort: "Athens", arrivalPort: "Mykonos", guestCount: 0, paymentAmount: "1200", status: "scheduled" },
    ];

    for (let i = 0; i < assignments.length; i++) {
      const skipper = allSkippers[i % allSkippers.length];
      const boat = allBoats[i % allBoats.length];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + (i * 3) - 6);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      try {
        await storage.createSkipperAssignment({
          ...assignments[i],
          skipperId: skipper.id,
          dealerId: skipper.dealerId,
          dealerBoatId: boat.id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          paymentStatus: assignments[i].status === "completed" ? "paid" : "pending",
        });
        console.log(`Created assignment: ${assignments[i].title}`);
      } catch (e) {
        console.log(`Assignment creation skipped: ${assignments[i].title}`);
      }
    }
  }

  // Create Trip Logs
  if (allSkippers.length > 0 && allBoats.length > 0) {
    const tripLogs = [
      { departurePort: "Barcelona", arrivalPort: "Sitges", tripDurationHours: "4.5", fuelUsedLiters: "120", fuelCost: "180", weatherConditions: "Sunny", seaState: "Calm", status: "submitted" },
      { departurePort: "Nice", arrivalPort: "Cannes", tripDurationHours: "2.5", fuelUsedLiters: "65", fuelCost: "98", weatherConditions: "Partly Cloudy", seaState: "Light Chop", status: "submitted" },
      { departurePort: "Split", arrivalPort: "Brač", tripDurationHours: "3.0", fuelUsedLiters: "85", fuelCost: "127", weatherConditions: "Clear", seaState: "Calm", status: "reviewed" },
      { departurePort: "Portofino", arrivalPort: "Santa Margherita", tripDurationHours: "1.5", fuelUsedLiters: "40", fuelCost: "60", weatherConditions: "Sunny", seaState: "Calm", status: "submitted" },
    ];

    for (let i = 0; i < tripLogs.length; i++) {
      const skipper = allSkippers[i % allSkippers.length];
      const boat = allBoats[i % allBoats.length];
      const depTime = new Date();
      depTime.setDate(depTime.getDate() - (i + 1));

      try {
        await storage.createTripLog({
          ...tripLogs[i],
          skipperId: skipper.id,
          dealerId: skipper.dealerId,
          dealerBoatId: boat.id,
          departureTime: depTime.toISOString(),
          arrivalTime: new Date(depTime.getTime() + Number(tripLogs[i].tripDurationHours) * 3600000).toISOString(),
          guestCount: 4,
          fuelLevelStart: 80,
          fuelLevelEnd: 50,
          preCheckCompleted: true,
          postCheckCompleted: true,
        });
        console.log(`Created trip log: ${tripLogs[i].departurePort} to ${tripLogs[i].arrivalPort}`);
      } catch (e) {
        console.log(`Trip log creation skipped`);
      }
    }
  }

  // Create Maintenance Records
  if (allBoats.length > 0) {
    const maintenanceRecords = [
      { title: "Annual Engine Service", category: "Engine", maintenanceType: "scheduled", laborCost: "800", partsCost: "450", priority: "normal", status: "completed" },
      { title: "Hull Cleaning & Antifouling", category: "Hull", maintenanceType: "scheduled", laborCost: "600", partsCost: "350", priority: "normal", status: "completed" },
      { title: "Navigation System Update", category: "Navigation", maintenanceType: "scheduled", laborCost: "200", partsCost: "0", priority: "low", status: "scheduled" },
      { title: "Safety Equipment Inspection", category: "Safety Equipment", maintenanceType: "inspection", laborCost: "150", partsCost: "0", priority: "high", status: "scheduled" },
      { title: "Electrical System Check", category: "Electrical", maintenanceType: "unscheduled", laborCost: "300", partsCost: "150", priority: "urgent", status: "in_progress" },
    ];

    for (let i = 0; i < maintenanceRecords.length; i++) {
      const boat = allBoats[i % allBoats.length];
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + (i * 7) - 14);

      try {
        await storage.createMaintenanceRecord({
          ...maintenanceRecords[i],
          dealerBoatId: boat.id,
          dealerId: boat.dealerId,
          scheduledDate: scheduledDate.toISOString(),
          totalCost: String(Number(maintenanceRecords[i].laborCost) + Number(maintenanceRecords[i].partsCost)),
          currency: "EUR",
        });
        console.log(`Created maintenance: ${maintenanceRecords[i].title}`);
      } catch (e) {
        console.log(`Maintenance creation skipped: ${maintenanceRecords[i].title}`);
      }
    }
  }

  console.log("European market data seeding complete!");
}

seedEuropeanData().catch(console.error);
