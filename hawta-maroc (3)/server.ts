import express from "express";
import type { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const apiOnly = process.argv.includes("--api-only");

// Lazy MongoDB connection
let isConnected = false;
async function connectToMongo(): Promise<boolean> {
  if (isConnected) return true;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("MONGODB_URI is not defined in environment variables. Database features will be disabled.");
    return false;
  }
  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log("Connected to MongoDB successfully");
    return true;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return false;
  }
}

const DealSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  partnerId: String,
  partnerName: String,
  category: String,
  imageUrl: String,
  originalPrice: Number,
  discountedPrice: Number,
  discountPercentage: Number,
  startDate: String,
  endDate: String,
  status: {
    type: String,
    enum: ["active", "pending", "expired", "paused"],
    default: "active",
  },
  tags: { type: [String], default: [] },
  views: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  favoritesCount: { type: Number, default: 0 },
  isVerifiedPartner: Boolean,
}, {
  timestamps: true,
  toJSON: {
    versionKey: false,
    transform: (_doc, ret) => {
      ret.id = ret.id || ret._id.toString();
      delete ret._id;
    },
  },
});

interface IDeal extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  partnerId: string;
  partnerName: string;
  category: string;
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  status: "active" | "pending" | "expired" | "paused";
  tags: string[];
  views: number;
  clicks: number;
  favoritesCount: number;
  isVerifiedPartner: boolean;
}

const UserSchema = new mongoose.Schema({
  id: String,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: String,
  phone: String,
  location: String,
  role: {
    type: String,
    enum: ["customer", "partner", "admin"],
    default: "customer",
  },
  category: String,
  favorites: { type: [String], default: [] },
  notificationPreferences: {
    emailAlerts: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    partnerOffers: { type: Boolean, default: false },
    accountActivity: { type: Boolean, default: true },
  },
}, {
  timestamps: true,
  toJSON: {
    versionKey: false,
    transform: (_doc, ret) => {
      ret.id = ret.id || ret._id.toString();
      delete ret._id;
      delete ret.password;
    },
  },
});

interface IUser extends mongoose.Document {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  location?: string;
  role: "customer" | "partner" | "admin";
  category?: string;
  favorites: string[];
}

const RequestSchema = new mongoose.Schema({
  id: String,
  title: { type: String, required: true },
  description: String,
  category: String,
  budget: Number,
  contactEmail: String,
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
}, {
  timestamps: true,
  toJSON: {
    versionKey: false,
    transform: (_doc, ret) => {
      ret.id = ret.id || ret._id.toString();
      delete ret._id;
    },
  },
});

const ActivitySchema = new mongoose.Schema({
  id: String,
  type: { type: String, required: true },
  message: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, {
  timestamps: true,
  toJSON: {
    versionKey: false,
    transform: (_doc, ret) => {
      ret.id = ret.id || ret._id.toString();
      delete ret._id;
    },
  },
});

const OrderSchema = new mongoose.Schema({
  id: String,
  dealId: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  buyerEmail: String,
  status: {
    type: String,
    enum: ["pending", "paid", "cancelled"],
    default: "pending",
  },
}, {
  timestamps: true,
  toJSON: {
    versionKey: false,
    transform: (_doc, ret) => {
      ret.id = ret.id || ret._id.toString();
      delete ret._id;
    },
  },
});

const Deal: mongoose.Model<IDeal> = mongoose.models.Deal || mongoose.model<IDeal>("Deal", DealSchema, "deals");
const User: mongoose.Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema, "users");
const RequestModel: mongoose.Model<any> = mongoose.models.Request || mongoose.model("Request", RequestSchema, "requests");
const Activity: mongoose.Model<any> = mongoose.models.Activity || mongoose.model("Activity", ActivitySchema, "activities");
const Order: mongoose.Model<any> = mongoose.models.Order || mongoose.model("Order", OrderSchema, "orders");

app.use(express.json());

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", database: isConnected ? "connected" : "disconnected" });
});

app.get("/api/promotions", async (req, res) => {
  res.redirect(307, "/api/deals");
});

app.get("/api/deals", async (req, res) => {
  const connected = await connectToMongo();
  if (!connected) {
    res.json([]);
    return;
  }
  try {
    const deals = await Deal.find({}).sort({ createdAt: -1 });
    res.json(deals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch deals" });
  }
});

async function createDeal(req: Request, res: Response) {
  const connected = await connectToMongo();
  if (!connected) {
    res.status(503).json({ error: "Database is not configured. Set MONGODB_URI in .env." });
    return;
  }
  try {
    const deal = new Deal({
      ...req.body,
      id: req.body.id || new mongoose.Types.ObjectId().toString(),
    });
    await deal.save();
    res.status(201).json(deal);
  } catch (error) {
    res.status(500).json({ error: "Failed to create deal" });
  }
}

app.post("/api/promotions", createDeal);
app.post("/api/deals", createDeal);

app.put("/api/deals/:id", async (req, res) => {
  const connected = await connectToMongo();
  if (!connected) {
    res.status(503).json({ error: "Database is not configured. Set MONGODB_URI in .env." });
    return;
  }
  try {
    const deal = await Deal.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!deal) {
      res.status(404).json({ error: "Deal not found" });
      return;
    }
    res.json(deal);
  } catch (error) {
    res.status(500).json({ error: "Failed to update deal" });
  }
});

app.delete("/api/deals/:id", async (req, res) => {
  const connected = await connectToMongo();
  if (!connected) {
    res.status(503).json({ error: "Database is not configured. Set MONGODB_URI in .env." });
    return;
  }
  try {
    const deal = await Deal.findOneAndDelete({ id: req.params.id });
    if (!deal) {
      res.status(404).json({ error: "Deal not found" });
      return;
    }
    res.json({ status: "deleted", id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete deal" });
  }
});

app.get("/api/users", async (req, res) => {
  const connected = await connectToMongo();
  if (!connected) {
    res.json([]);
    return;
  }
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.post("/api/users", async (req, res) => {
  const connected = await connectToMongo();
  if (!connected) {
    res.status(503).json({ error: "Database is not configured. Set MONGODB_URI in .env." });
    return;
  }
  try {
    const user = new User({
      ...req.body,
      id: req.body.id || new mongoose.Types.ObjectId().toString(),
    });
    await user.save();
    res.status(201).json(user);
  } catch (error: any) {
    if (error?.code === 11000) {
      res.status(409).json({ error: "A user with this email already exists" });
      return;
    }
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const connected = await connectToMongo();
  if (!connected) {
    res.status(503).json({ error: "Database is not configured. Set MONGODB_URI in .env." });
    return;
  }
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const role = email === "mohamadelbouhali465@gmail.com" ? "admin" : "customer";
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        id: new mongoose.Types.ObjectId().toString(),
        name: email.split("@")[0],
        email,
        password,
        role,
        phone: "",
        location: "Morocco",
        category: role === "admin" ? "Admin" : "Customer",
      });
      await user.save();
    } else if (user.password && user.password !== password) {
      res.status(401).json({ error: "Wrong password" });
      return;
    } else if (user.role !== role) {
      user.role = role;
      user.category = role === "admin" ? "Admin" : user.category;
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to sign in" });
  }
});

app.put("/api/users/:id", async (req, res) => {
  const connected = await connectToMongo();
  if (!connected) {
    res.status(503).json({ error: "Database is not configured. Set MONGODB_URI in .env." });
    return;
  }
  try {
    const user = await User.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

app.post("/api/requests", async (req, res) => {
  const connected = await connectToMongo();
  if (!connected) {
    res.status(503).json({ error: "Database is not configured. Set MONGODB_URI in .env." });
    return;
  }
  try {
    const request = new RequestModel({
      ...req.body,
      id: req.body.id || new mongoose.Types.ObjectId().toString(),
    });
    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: "Failed to create request" });
  }
});

app.get("/api/requests", async (req, res) => {
  const connected = await connectToMongo();
  if (!connected) {
    res.json([]);
    return;
  }
  try {
    const requests = await RequestModel.find({}).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

app.post("/api/activities", async (req, res) => {
  const connected = await connectToMongo();
  if (!connected) {
    res.status(503).json({ error: "Database is not configured. Set MONGODB_URI in .env." });
    return;
  }
  try {
    const activity = new Activity({
      ...req.body,
      id: req.body.id || new mongoose.Types.ObjectId().toString(),
    });
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ error: "Failed to create activity" });
  }
});

app.get("/api/activities", async (req, res) => {
  const connected = await connectToMongo();
  if (!connected) {
    res.json([]);
    return;
  }
  try {
    const activities = await Activity.find({}).sort({ createdAt: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

app.post("/api/orders", async (req, res) => {
  const connected = await connectToMongo();
  if (!connected) {
    res.status(503).json({ error: "Database is not configured. Set MONGODB_URI in .env." });
    return;
  }
  try {
    const order = new Order({
      ...req.body,
      id: req.body.id || new mongoose.Types.ObjectId().toString(),
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.get("/api/orders", async (req, res) => {
  const connected = await connectToMongo();
  if (!connected) {
    res.json([]);
    return;
  }
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Middleware for Vite / Static files
async function startServer() {
  if (apiOnly) {
    app.get("/", (req, res) => {
      res.json({ status: "ok", service: "hawta-maroc-api" });
    });
  } else if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
