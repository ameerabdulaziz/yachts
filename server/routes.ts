import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import express from "express";
import { storage } from "./storage";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import session from "express-session";
import { insertUserSchema, insertYachtSchema, insertBookingSchema, insertOwnershipOpportunitySchema, insertSharePurchaseSchema, insertShareListingSchema, insertMessageSchema, insertFuelTransactionSchema } from "@shared/schema";
import { registerAdminRoutes } from "./adminRoutes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'nauttec-yacht-platform-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
  }));

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure Google OAuth strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await storage.getUserByEmail(profile.emails?.[0]?.value || '');
        
        if (!user) {
          // Create new user from Google profile
          const userData = {
            email: profile.emails?.[0]?.value || '',
            firstName: profile.name?.givenName || '',
            lastName: profile.name?.familyName || '',
            phone: '', // Will be added later if needed
            role: 'renter' as const,
            isVerified: true,
            fuelWalletBalance: '0.00'
          };
          user = await storage.createUser(userData);
        }
        
        return done(null, user);
      } catch (error) {
        return done(error, undefined);
      }
    }));
  }

  // Passport serialization
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUserById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Screenshot saving endpoint
  app.post('/api/save-screenshot', express.json({limit: '50mb'}), (req, res) => {
    try {
      const { filename, imageData } = req.body;
      
      if (!filename || !imageData) {
        return res.status(400).json({ error: 'Missing filename or imageData' });
      }

      // Remove data URL prefix
      const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
      
      // Save to all_app_screens folder
      const screenshotsDir = path.join(process.cwd(), 'all_app_screens');
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }
      
      const filepath = path.join(screenshotsDir, filename);
      fs.writeFileSync(filepath, base64Data, 'base64');
      
      console.log(`📸 Saved screenshot: ${filename}`);
      res.json({ success: true, filename, path: filepath });
      
    } catch (error) {
      console.error('Error saving screenshot:', error);
      res.status(500).json({ error: 'Failed to save screenshot' });
    }
  });

  // OAuth Routes
  app.get("/api/auth/google", 
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get("/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login?error=google_failed" }),
    (req, res) => {
      // Successful authentication
      res.redirect("/");
    }
  );

  app.get("/api/auth/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
  );

  app.get("/api/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/login?error=facebook_failed" }),
    (req, res) => {
      // Successful authentication
      res.redirect("/");
    }
  );

  // Get current user
  app.get("/api/auth/user", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Legacy authentication (keep for backward compatibility)
  app.post("/api/auth/phone-login", async (req, res) => {
    try {
      const { phone } = req.body;
      // In real app, send OTP via SMS
      res.json({ success: true, message: "OTP sent to phone" });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { phone, otp } = req.body;
      // Demo: accept "123456" as valid OTP
      if (otp === "123456") {
        const user = await storage.getUserByPhone(phone) || await storage.createUser({ phone, role: "renter" });
        res.json({ user });
      } else {
        res.status(400).json({ message: "Invalid OTP" });
      }
    } catch (error) {
      res.status(500).json({ message: "Verification failed" });
    }
  });

  app.post("/api/auth/setup-account", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      // For account setup, we're creating a new user, not updating existing one
      const user = await storage.createUser(userData);
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: "Account setup failed" });
    }
  });

  // Yacht routes
  app.get("/api/yachts", async (req, res) => {
    try {
      const yachts = await storage.getAllYachts();
      res.json(yachts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch yachts" });
    }
  });

  app.get("/api/yachts/:id", async (req, res) => {
    try {
      const yacht = await storage.getYacht(req.params.id);
      if (!yacht) {
        return res.status(404).json({ message: "Yacht not found" });
      }
      res.json(yacht);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch yacht" });
    }
  });

  app.post("/api/yachts", async (req, res) => {
    try {
      const yachtData = insertYachtSchema.parse(req.body);
      const yacht = await storage.createYacht(yachtData);
      res.json(yacht);
    } catch (error) {
      res.status(500).json({ message: "Failed to create yacht" });
    }
  });

  // Booking routes
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.get("/api/bookings/user/:userId", async (req, res) => {
    try {
      const bookings = await storage.getUserBookings(req.params.userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });

  // Ownership opportunities routes
  app.get("/api/ownership-opportunities", async (req, res) => {
    try {
      const opportunities = await storage.getAllOwnershipOpportunities();
      res.json(opportunities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ownership opportunities" });
    }
  });

  app.get("/api/ownership-opportunities/:id", async (req, res) => {
    try {
      const opportunity = await storage.getOwnershipOpportunity(req.params.id);
      if (!opportunity) {
        return res.status(404).json({ message: "Ownership opportunity not found" });
      }
      res.json(opportunity);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ownership opportunity" });
    }
  });

  app.post("/api/share-purchases", async (req, res) => {
    try {
      const purchaseData = insertSharePurchaseSchema.parse(req.body);
      const purchase = await storage.createSharePurchase(purchaseData);
      res.json(purchase);
    } catch (error) {
      res.status(500).json({ message: "Failed to purchase shares" });
    }
  });

  // Share marketplace routes
  app.get("/api/share-listings", async (req, res) => {
    try {
      const listings = await storage.getAllShareListings();
      res.json(listings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch share listings" });
    }
  });

  app.post("/api/share-listings", async (req, res) => {
    try {
      const listingData = insertShareListingSchema.parse(req.body);
      const listing = await storage.createShareListing(listingData);
      res.json(listing);
    } catch (error) {
      res.status(500).json({ message: "Failed to create share listing" });
    }
  });

  // User routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Users API error:', error);
      res.status(500).json({ message: "Failed to fetch users", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Fuel wallet routes
  app.get("/api/fuel-wallet/:userId", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ balance: user.fuelWalletBalance });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch fuel wallet balance" });
    }
  });

  app.post("/api/fuel-wallet/topup", async (req, res) => {
    try {
      const transactionData = insertFuelTransactionSchema.parse(req.body);
      const transaction = await storage.createFuelTransaction(transactionData);
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to top up fuel wallet" });
    }
  });

  app.get("/api/fuel-wallet/transactions/:userId", async (req, res) => {
    try {
      const transactions = await storage.getUserFuelTransactions(req.params.userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch fuel transactions" });
    }
  });

  // Handle mobile PWA redirects - Must be before other routes
  app.get("/hone", (req, res) => {
    console.log("Server: Redirecting /hone to /");
    res.redirect(301, "/");
  });
  
  app.get("/home", (req, res) => {
    console.log("Server: Redirecting /home to /charter");
    res.redirect(301, "/charter");
  });

  // Messaging routes
  app.get("/api/messages/:userId", async (req, res) => {
    try {
      const messages = await storage.getUserMessages(req.params.userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Serve presentation assets
  app.use('/presentation-assets', express.static(path.resolve('attached_assets'), { index: false }));
  
  // Serve the commercial presentation
  app.get('/presentation', (_req, res) => {
    res.sendFile(path.resolve('Yachtak_Commercial_Presentation.html'));
  });
  
  // Force download the presentation
  app.get('/download-presentation', (_req, res) => {
    res.download(path.resolve('Yachtak_Commercial_Presentation.html'), 'Yachtak_Commercial_Presentation.html');
  });
  
  // Download page
  app.get('/download', (_req, res) => {
    res.sendFile(path.resolve('download-page.html'));
  });

  // Register admin routes
  await registerAdminRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
