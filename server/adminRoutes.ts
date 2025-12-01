import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import {
  insertAdminUserSchema,
  insertDealerSchema,
  insertFleetModelSchema,
  insertDealerBoatSchema,
  insertBoatCalendarSchema,
  insertInquirySchema,
} from "@shared/schema";
import { z } from "zod";

// Extend Express Request to include admin user
declare global {
  namespace Express {
    interface Request {
      adminUser?: any;
    }
  }
}

// Auth middleware for admin routes
export function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const adminSession = (req.session as any)?.adminUser;
  if (!adminSession) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  req.adminUser = adminSession;
  next();
}

// Role check middleware
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.adminUser || !roles.includes(req.adminUser.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
}

export async function registerAdminRoutes(app: Express) {
  // ========== AUTH ROUTES ==========

  // Admin login
  app.post("/api/admin/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const user = await storage.getAdminUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: "Account is deactivated" });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Update last login
      await storage.updateAdminUser(user.id, { lastLoginAt: new Date() } as any);

      // Store in session
      (req.session as any).adminUser = {
        id: user.id,
        username: user.username,
        role: user.role,
        dealerId: user.dealerId,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      // Return user without password hash
      const { passwordHash, ...safeUser } = user;
      res.json({ user: safeUser });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Admin logout
  app.post("/api/admin/auth/logout", (req, res) => {
    delete (req.session as any).adminUser;
    res.json({ message: "Logged out successfully" });
  });

  // Get current admin user
  app.get("/api/admin/auth/me", adminAuthMiddleware, async (req, res) => {
    try {
      const user = await storage.getAdminUserById(req.adminUser.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { passwordHash, ...safeUser } = user;
      res.json({ user: safeUser });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ========== USER MANAGEMENT ROUTES (Admin only) ==========

  // Get all admin users
  app.get("/api/admin/users", adminAuthMiddleware, requireRole("super_admin", "staff"), async (req, res) => {
    try {
      const users = await storage.getAllAdminUsers();
      const safeUsers = users.map(({ passwordHash, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Create admin user
  app.post("/api/admin/users", adminAuthMiddleware, requireRole("super_admin"), async (req, res) => {
    try {
      const { password, ...userData } = req.body;

      if (!password || password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      // Check if username already exists
      const existing = await storage.getAdminUserByUsername(userData.username);
      if (existing) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await storage.createAdminUser({
        ...userData,
        passwordHash,
        createdBy: req.adminUser.id,
      });

      const { passwordHash: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Update admin user
  app.patch("/api/admin/users/:id", adminAuthMiddleware, requireRole("super_admin"), async (req, res) => {
    try {
      const { id } = req.params;
      const { password, ...updateData } = req.body;

      let finalUpdateData = { ...updateData };
      if (password && password.length >= 6) {
        finalUpdateData.passwordHash = await bcrypt.hash(password, 10);
      }

      const user = await storage.updateAdminUser(id, finalUpdateData);
      const { passwordHash, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // ========== DEALER ROUTES ==========

  // Get all dealers
  app.get("/api/admin/dealers", adminAuthMiddleware, async (req, res) => {
    try {
      const dealers = await storage.getAllDealers();
      res.json(dealers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dealers" });
    }
  });

  // Get single dealer
  app.get("/api/admin/dealers/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const dealer = await storage.getDealer(req.params.id);
      if (!dealer) {
        return res.status(404).json({ message: "Dealer not found" });
      }
      res.json(dealer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dealer" });
    }
  });

  // Create dealer
  app.post("/api/admin/dealers", adminAuthMiddleware, requireRole("super_admin", "staff"), async (req, res) => {
    try {
      const dealerData = insertDealerSchema.parse(req.body);
      const dealer = await storage.createDealer(dealerData);
      res.json(dealer);
    } catch (error) {
      console.error("Create dealer error:", error);
      res.status(500).json({ message: "Failed to create dealer" });
    }
  });

  // Update dealer
  app.patch("/api/admin/dealers/:id", adminAuthMiddleware, requireRole("super_admin", "staff"), async (req, res) => {
    try {
      const dealer = await storage.updateDealer(req.params.id, req.body);
      res.json(dealer);
    } catch (error) {
      res.status(500).json({ message: "Failed to update dealer" });
    }
  });

  // ========== FLEET MODEL ROUTES ==========

  // Get all fleet models (requires authentication)
  app.get("/api/admin/fleet-models", adminAuthMiddleware, async (req, res) => {
    try {
      const models = await storage.getAllFleetModels();
      res.json(models);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch fleet models" });
    }
  });

  // Get single fleet model (requires authentication)
  app.get("/api/admin/fleet-models/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const model = await storage.getFleetModel(req.params.id);
      if (!model) {
        return res.status(404).json({ message: "Fleet model not found" });
      }
      res.json(model);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch fleet model" });
    }
  });

  // Create fleet model
  app.post("/api/admin/fleet-models", adminAuthMiddleware, requireRole("super_admin", "staff"), async (req, res) => {
    try {
      const modelData = insertFleetModelSchema.parse(req.body);
      const model = await storage.createFleetModel(modelData);
      res.json(model);
    } catch (error) {
      console.error("Create fleet model error:", error);
      res.status(500).json({ message: "Failed to create fleet model" });
    }
  });

  // Update fleet model
  app.patch("/api/admin/fleet-models/:id", adminAuthMiddleware, requireRole("super_admin", "staff"), async (req, res) => {
    try {
      const model = await storage.updateFleetModel(req.params.id, req.body);
      res.json(model);
    } catch (error) {
      res.status(500).json({ message: "Failed to update fleet model" });
    }
  });

  // ========== DEALER BOAT ROUTES ==========

  // Get all boats (admin view)
  app.get("/api/admin/boats", adminAuthMiddleware, async (req, res) => {
    try {
      let boats;
      if (req.adminUser.role === "dealer" && req.adminUser.dealerId) {
        boats = await storage.getDealerBoats(req.adminUser.dealerId);
      } else {
        boats = await storage.getAllDealerBoats();
      }
      res.json(boats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch boats" });
    }
  });

  // Get single boat
  app.get("/api/admin/boats/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const boat = await storage.getDealerBoat(req.params.id);
      if (!boat) {
        return res.status(404).json({ message: "Boat not found" });
      }
      // Check dealer access
      if (req.adminUser.role === "dealer" && boat.dealerId !== req.adminUser.dealerId) {
        return res.status(403).json({ message: "Access denied" });
      }
      res.json(boat);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch boat" });
    }
  });

  // Create boat
  app.post("/api/admin/boats", adminAuthMiddleware, async (req, res) => {
    try {
      let dealerId = req.body.dealerId;
      
      // Dealers can only create boats for themselves
      if (req.adminUser.role === "dealer") {
        dealerId = req.adminUser.dealerId;
      }

      if (!dealerId) {
        return res.status(400).json({ message: "Dealer ID is required" });
      }

      const boatData = {
        ...req.body,
        dealerId,
      };

      const boat = await storage.createDealerBoat(boatData);
      res.json(boat);
    } catch (error) {
      console.error("Create boat error:", error);
      res.status(500).json({ message: "Failed to create boat" });
    }
  });

  // Update boat
  app.patch("/api/admin/boats/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const existingBoat = await storage.getDealerBoat(req.params.id);
      if (!existingBoat) {
        return res.status(404).json({ message: "Boat not found" });
      }

      // Check dealer access
      if (req.adminUser.role === "dealer" && existingBoat.dealerId !== req.adminUser.dealerId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const boat = await storage.updateDealerBoat(req.params.id, req.body);
      res.json(boat);
    } catch (error) {
      res.status(500).json({ message: "Failed to update boat" });
    }
  });

  // ========== CALENDAR ROUTES ==========

  // Get boat calendar
  app.get("/api/admin/boats/:boatId/calendar", adminAuthMiddleware, async (req, res) => {
    try {
      const { boatId } = req.params;
      const { startDate, endDate } = req.query;

      const boat = await storage.getDealerBoat(boatId);
      if (!boat) {
        return res.status(404).json({ message: "Boat not found" });
      }

      // Check dealer access
      if (req.adminUser.role === "dealer" && boat.dealerId !== req.adminUser.dealerId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const start = startDate ? new Date(startDate as string) : new Date();
      const end = endDate ? new Date(endDate as string) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

      const calendar = await storage.getBoatCalendar(boatId, start, end);
      res.json(calendar);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch calendar" });
    }
  });

  // Update calendar entry
  app.post("/api/admin/boats/:boatId/calendar", adminAuthMiddleware, async (req, res) => {
    try {
      const { boatId } = req.params;

      const boat = await storage.getDealerBoat(boatId);
      if (!boat) {
        return res.status(404).json({ message: "Boat not found" });
      }

      // Check dealer access
      if (req.adminUser.role === "dealer" && boat.dealerId !== req.adminUser.dealerId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const entryData = {
        ...req.body,
        dealerBoatId: boatId,
      };

      const entry = await storage.upsertCalendarEntry(entryData);
      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to update calendar" });
    }
  });

  // Bulk update calendar
  app.post("/api/admin/boats/:boatId/calendar/bulk", adminAuthMiddleware, async (req, res) => {
    try {
      const { boatId } = req.params;
      const { entries } = req.body;

      const boat = await storage.getDealerBoat(boatId);
      if (!boat) {
        return res.status(404).json({ message: "Boat not found" });
      }

      // Check dealer access
      if (req.adminUser.role === "dealer" && boat.dealerId !== req.adminUser.dealerId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const results = await Promise.all(
        entries.map((entry: any) =>
          storage.upsertCalendarEntry({ ...entry, dealerBoatId: boatId })
        )
      );

      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to update calendar" });
    }
  });

  // ========== INQUIRY ROUTES ==========

  // Get inquiries
  app.get("/api/admin/inquiries", adminAuthMiddleware, async (req, res) => {
    try {
      let inquiries;
      if (req.adminUser.role === "dealer" && req.adminUser.dealerId) {
        inquiries = await storage.getDealerInquiries(req.adminUser.dealerId);
      } else {
        inquiries = await storage.getAllInquiries();
      }
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  // Get single inquiry
  app.get("/api/admin/inquiries/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const inquiry = await storage.getInquiry(req.params.id);
      if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }

      // Check dealer access
      if (req.adminUser.role === "dealer" && inquiry.dealerId !== req.adminUser.dealerId) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiry" });
    }
  });

  // Create inquiry (public endpoint for website)
  app.post("/api/inquiries", async (req, res) => {
    try {
      const inquiryData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(inquiryData);
      res.json(inquiry);
    } catch (error) {
      console.error("Create inquiry error:", error);
      res.status(500).json({ message: "Failed to create inquiry" });
    }
  });

  // Update inquiry
  app.patch("/api/admin/inquiries/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const existingInquiry = await storage.getInquiry(req.params.id);
      if (!existingInquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }

      // Check dealer access
      if (req.adminUser.role === "dealer" && existingInquiry.dealerId !== req.adminUser.dealerId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const inquiry = await storage.updateInquiry(req.params.id, req.body);
      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ message: "Failed to update inquiry" });
    }
  });

  // ========== SEED DEFAULT ADMIN ==========
  
  // Create default super admin if none exists
  const existingAdmin = await storage.getAdminUserByUsername("admin");
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    await storage.createAdminUser({
      username: "admin",
      email: "admin@deantonioyachts.com",
      passwordHash,
      firstName: "De Antonio",
      lastName: "Admin",
      role: "super_admin",
      isActive: true,
    });
    console.log("Created default admin user: admin / admin123");
  }

  // Seed De Antonio fleet models if none exist
  const existingModels = await storage.getAllFleetModels();
  if (existingModels.length === 0) {
    const fleetData = [
      {
        modelName: "D29",
        displayName: "De Antonio D29",
        description: "The D29 is the perfect day boat, combining style with functionality. Featuring De Antonio's signature hidden outboard engines.",
        lengthMeters: "7.99",
        beamMeters: "2.55",
        draftMeters: "0.45",
        maxCapacity: 10,
        cabins: 1,
        berths: 2,
        engines: "Twin Mercury 250hp",
        maxSpeed: "42",
        cruisingSpeed: "28",
        fuelCapacity: 400,
        range: 200,
        basePrice: "213750",
        features: ["Hidden outboard engines", "Walk-around deck", "Premium sound system", "Hydraulic swim platform"],
        images: ["https://static.wixstatic.com/media/0fb4c8_b9744cfa841b4c4388ad78ac9b49bbe7~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85/THE%20RANGE_PORTADA_D29.jpg"],
        sortOrder: 1,
      },
      {
        modelName: "D32",
        displayName: "De Antonio D32",
        description: "The D32 offers enhanced comfort and performance for extended cruising with a spacious cockpit and full galley.",
        lengthMeters: "9.90",
        beamMeters: "2.90",
        draftMeters: "0.55",
        maxCapacity: 12,
        cabins: 1,
        berths: 2,
        engines: "Twin Mercury 300hp",
        maxSpeed: "45",
        cruisingSpeed: "30",
        fuelCapacity: 600,
        range: 250,
        basePrice: "309000",
        features: ["Twin engines", "Spacious cockpit", "Full galley", "Electric toilet"],
        images: ["https://static.wixstatic.com/media/0fb4c8_6cbbd012fc0645009bc4a91a412b293a~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85/THE%20RANGE_PORTADA_D32.jpg"],
        sortOrder: 2,
      },
      {
        modelName: "D36",
        displayName: "De Antonio D36",
        description: "The D36 bridges the gap between day cruiser and overnight yacht with master cabin and full bathroom.",
        lengthMeters: "10.40",
        beamMeters: "3.10",
        draftMeters: "0.60",
        maxCapacity: 14,
        cabins: 2,
        berths: 4,
        engines: "Triple Mercury 300hp",
        maxSpeed: "48",
        cruisingSpeed: "32",
        fuelCapacity: 800,
        range: 300,
        basePrice: "426000",
        features: ["Master cabin", "Full bathroom", "Modular seating", "Premium navigation"],
        images: ["https://static.wixstatic.com/media/0fb4c8_fbbb6a2569c747d48881f7ac065b947a~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85/THE%20RANGE_PORTADA_D36.jpg"],
        sortOrder: 3,
      },
      {
        modelName: "D42",
        displayName: "De Antonio D42",
        description: "The D42 is a true luxury cruiser with exceptional performance, 2 cabins, and full air conditioning.",
        lengthMeters: "11.40",
        beamMeters: "3.50",
        draftMeters: "0.70",
        maxCapacity: 16,
        cabins: 2,
        berths: 4,
        engines: "Triple Mercury 450hp",
        maxSpeed: "52",
        cruisingSpeed: "35",
        fuelCapacity: 1200,
        range: 350,
        basePrice: "650000",
        features: ["Triple engines", "Full galley", "2 cabins", "Hydraulic platform", "Air conditioning"],
        images: ["https://static.wixstatic.com/media/0fb4c8_008f1545c8764f8789a2b7415ca9dde7~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85/THE%20RANGE_PORTADA_D42.jpg"],
        sortOrder: 4,
      },
      {
        modelName: "D50",
        displayName: "De Antonio D50",
        description: "The flagship D50 represents the pinnacle of De Antonio engineering with 3 luxury cabins and full crew quarters.",
        lengthMeters: "12.65",
        beamMeters: "3.85",
        draftMeters: "0.80",
        maxCapacity: 18,
        cabins: 3,
        berths: 6,
        engines: "Quad Mercury 450hp",
        maxSpeed: "55",
        cruisingSpeed: "38",
        fuelCapacity: 1800,
        range: 400,
        basePrice: "950000",
        features: ["Quad engines", "3 luxury cabins", "Full crew quarters", "Premium entertainment", "Stabilizers"],
        images: ["https://static.wixstatic.com/media/0fb4c8_3aeb0bd0df9d4215b6a22f1fae5854a4~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85/THE%20RANGE_PORTADA_D50.jpg"],
        sortOrder: 5,
      },
      {
        modelName: "D60",
        displayName: "De Antonio D60",
        description: "The D60 is the ultimate expression of luxury yachting with 4 staterooms, Jacuzzi, beach club, and tender garage.",
        lengthMeters: "18.50",
        beamMeters: "4.50",
        draftMeters: "1.00",
        maxCapacity: 20,
        cabins: 4,
        berths: 8,
        engines: "Quad V12 1200hp",
        maxSpeed: "58",
        cruisingSpeed: "40",
        fuelCapacity: 3000,
        range: 500,
        basePrice: "2000000",
        features: ["Quad V12 engines", "4 staterooms", "Full crew accommodation", "Jacuzzi", "Beach club", "Tender garage"],
        images: ["https://static.wixstatic.com/media/0fb4c8_c63bfad6a5e74b36b5e6f8c0f23c93d7~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85/THE%20RANGE_PORTADA_D60.jpg"],
        sortOrder: 6,
      },
    ];

    for (const model of fleetData) {
      await storage.createFleetModel(model as any);
    }
    console.log("Seeded De Antonio fleet models");
  }
}
