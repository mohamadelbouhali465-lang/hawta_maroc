import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" })); // Support base64 image uploads

// ----------------------------------------------------
// MongoDB Connection Logic
// ----------------------------------------------------
let isConnected = false;

async function connectToMongo() {
  if (isConnected) return true;
  const uri = process.env.MONGODB_URI;
  if (!uri || uri === "your_mongodb_connection_string_here" || (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://"))) {
    console.warn("MONGODB_URI is missing, invalid, or left as default. Server is running on in-memory mode.");
    return false;
  }
  try {
    // Prevent multiple parallel connection requests
    if (mongoose.connection.readyState === 1) {
      isConnected = true;
      return true;
    }
    await mongoose.connect(uri);
    isConnected = true;
    console.log("Connected to MongoDB successfully");
    await seedDatabase();
    return true;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return false;
  }
}

// ----------------------------------------------------
// Schemas and Models
// ----------------------------------------------------

// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  phone: String,
  location: String,
  password: String,
  avatar: String
});
const UserDb: any = mongoose.models.User || mongoose.model("User", UserSchema);

// Promotion Schema
const PromotionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
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
  status: { type: String, default: 'active' },
  tags: [String],
  views: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  favoritesCount: { type: Number, default: 0 },
  isVerifiedPartner: Boolean
});
const PromotionDb: any = mongoose.models.Promotion || mongoose.model("Promotion", PromotionSchema);

// Partner Schema
const PartnerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  logo: String,
  category: String,
  description: String,
  verified: { type: Boolean, default: false },
  joinDate: String,
  status: { type: String, default: 'pending' },
  email: { type: String, required: true },
  phone: String
});
const PartnerDb: any = mongoose.models.Partner || mongoose.model("Partner", PartnerSchema);

// Tracked Order Schema
const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  promotionId: String,
  productTitle: String,
  productImage: String,
  price: Number,
  quantity: Number,
  total: Number,
  date: String,
  status: { type: String, default: 'placed' },
  partnerName: String,
  city: String,
  address: String,
  phone: String
});
const OrderDb: any = mongoose.models.Order || mongoose.model("Order", OrderSchema);

// Category Schema
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});
const CategoryDb: any = mongoose.models.Category || mongoose.model("Category", CategorySchema);

// ----------------------------------------------------
// Fallback In-Memory Storage Databases
// ----------------------------------------------------
let localPromotions: any[] = [
  {
    id: '1',
    title: 'iPhone 15 Pro - Limited Offer',
    description: 'Get the latest iPhone with a massive discount. Limited stock available.',
    partnerId: 'p1',
    partnerName: 'TechStore',
    category: 'High-Tech',
    imageUrl: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=800&q=80',
    originalPrice: 12000,
    discountedPrice: 9500,
    discountPercentage: 20,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    tags: ['Apple', 'Smartphone', 'Premium'],
    views: 1250,
    clicks: 450,
    favoritesCount: 89,
    isVerifiedPartner: true
  },
  {
    id: '2',
    title: 'Nike Air Max - Summer Sale',
    description: 'Step up your game with 40% off on all Nike Air Max models.',
    partnerId: 'p2',
    partnerName: 'SportCenter',
    category: 'Sport',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    originalPrice: 1500,
    discountedPrice: 900,
    discountPercentage: 40,
    startDate: '2024-05-01',
    endDate: '2024-06-30',
    status: 'active',
    tags: ['Shoes', 'Sale', 'Nike'],
    views: 2300,
    clicks: 800,
    favoritesCount: 156,
    isVerifiedPartner: true
  },
  {
    id: '3',
    title: 'Gourmet Burger Menu for Two',
    description: 'Enjoy our signature burgers with drinks and fries at a special price.',
    partnerId: 'p3',
    partnerName: 'BurgerKing',
    category: 'Restauration',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    originalPrice: 250,
    discountedPrice: 150,
    discountPercentage: 40,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    tags: ['Food', 'Combo', 'Delicious'],
    views: 800,
    clicks: 320,
    favoritesCount: 45
  },
  {
    id: '4',
    title: 'Luxury Spa Weekend',
    description: 'Relax and unwind with a full weekend pas at our luxury spa.',
    partnerId: 'p4',
    partnerName: 'ZenResort',
    category: 'Beauté',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecee?auto=format&fit=crop&w=800&q=80',
    originalPrice: 3000,
    discountedPrice: 1800,
    discountPercentage: 40,
    startDate: '2024-05-15',
    endDate: '2024-08-15',
    status: 'active',
    tags: ['Relax', 'Healthcare', 'Luxury'],
    views: 1500,
    clicks: 200,
    favoritesCount: 112
  }
];

let localPartners: any[] = [
  {
    id: 'p1',
    name: 'TechStore',
    logo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    category: 'High-Tech',
    description: 'Premier wholesale supplier of smartphones and technology accessories in Casablanca.',
    verified: true,
    joinDate: '2023-11-12',
    status: 'active',
    email: 'contact@techstore.ma',
    phone: '+212 522-345678'
  },
  {
    id: 'p2',
    name: 'SportCenter',
    logo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    category: 'Sport',
    description: 'Official athletic garments and bulk sneaker supplier in Rabat.',
    verified: true,
    joinDate: '2024-01-20',
    status: 'active',
    email: 'sales@sportcenter.ma',
    phone: '+212 537-891011'
  },
  {
    id: 'p3',
    name: 'BurgerKing',
    logo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
    category: 'Restauration',
    description: 'Wholesale hospitality, catering services, and premium food franchise packages.',
    verified: false,
    joinDate: '2024-03-05',
    status: 'active',
    email: 'wholesale@burgerking.ma',
    phone: '+212 522-998877'
  },
  {
    id: 'p4',
    name: 'ZenResort',
    logo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    category: 'Beauté',
    description: 'Wellness, luxury spa franchise, and wholesale organic cosmetic materials from Agadir.',
    verified: false,
    joinDate: '2024-04-12',
    status: 'suspended',
    email: 'info@zenresort.ma',
    phone: '+212 528-665544'
  }
];

let localUsers: any[] = [
  {
    name: 'System Admin',
    email: 'admin@hawta.com',
    role: 'admin',
    phone: '+212 600-111111',
    location: 'Rabat, Morocco',
    password: 'admin'
  },
  {
    name: 'TechStore Supplier',
    email: 'contact@techstore.ma',
    role: 'user',
    phone: '+212 522-345678',
    location: 'Casablanca, Morocco',
    password: 'password'
  },
  {
    name: 'SportCenter Distributor',
    email: 'sales@sportcenter.ma',
    role: 'user',
    phone: '+212 537-891011',
    location: 'Rabat, Morocco',
    password: 'password'
  },
  {
    name: 'Mohamed El Bouhali',
    email: 'mohamadelbouhali465@gmail.com',
    role: 'client',
    phone: '+212 612-345678',
    location: 'Marrakech, Morocco',
    password: 'password'
  },
  {
    name: 'Anas Mansouri',
    email: 'anas@gmail.com',
    role: 'client',
    phone: '+212 655-778899',
    location: 'Tangier, Morocco',
    password: 'password'
  },
  {
    name: 'Yasmine Alami',
    email: 'yasmine@gmail.com',
    role: 'client',
    phone: '+212 644-223344',
    location: 'Fes, Morocco',
    password: 'password'
  }
];

let localCategories: string[] = ['All', 'Mode', 'Restauration', 'High-Tech', 'Beauté', 'Maison', 'Sport', 'Voyage'];

let localOrders: any[] = [
  {
    id: 'HAWTA-784920',
    promotionId: '2',
    productTitle: 'Nike Air Max - Summer Sale',
    productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    price: 900,
    quantity: 1,
    total: 935,
    date: '2026-06-11',
    status: 'shipped',
    partnerName: 'SportCenter',
    city: 'Rabat',
    address: 'Avenue de France, Agdal',
    phone: '+212 612-345678'
  },
  {
    id: 'HAWTA-421039',
    promotionId: '1',
    productTitle: 'iPhone 15 Pro - Limited Offer',
    productImage: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=800&q=80',
    price: 9500,
    quantity: 1,
    total: 9500,
    date: '2026-06-08',
    status: 'delivered',
    partnerName: 'TechStore',
    city: 'Casablanca',
    address: 'Boulevard Zerktouni, Gauthier',
    phone: '+212 612-345678'
  }
];

// ----------------------------------------------------
// Seeding Logic
// ----------------------------------------------------
async function seedDatabase() {
  try {
    const promoCount = await PromotionDb.countDocuments();
    if (promoCount === 0) {
      await PromotionDb.insertMany(localPromotions);
      console.log("Seeded default promotions in MongoDB");
    }
    const partnerCount = await PartnerDb.countDocuments();
    if (partnerCount === 0) {
      await PartnerDb.insertMany(localPartners);
      console.log("Seeded default partners in MongoDB");
    }
    const userCount = await UserDb.countDocuments();
    if (userCount === 0) {
      await UserDb.insertMany(localUsers);
      console.log("Seeded default users in MongoDB");
    }
    const categoryCount = await CategoryDb.countDocuments();
    if (categoryCount === 0) {
      const mappedCats = localCategories.map(c => ({ name: c }));
      await CategoryDb.insertMany(mappedCats);
      console.log("Seeded initial categories in MongoDB");
    }
    const orderCount = await OrderDb.countDocuments();
    if (orderCount === 0) {
      await OrderDb.insertMany(localOrders);
      console.log("Seeded default orders in MongoDB");
    }
  } catch (err) {
    console.error("Failed to seed database: ", err);
  }
}

// ----------------------------------------------------
// REST API REST ENDPOINTS
// ----------------------------------------------------

// HEALTH
app.get("/api/health", async (req, res) => {
  const dbStatus = await connectToMongo();
  res.json({
    status: "ok",
    database: dbStatus ? "connected" : "in-memory-fallback"
  });
});

// CATEGORIES
app.get("/api/categories", async (req, res) => {
  const dbConnected = await connectToMongo();
  if (!dbConnected) {
    return res.json(localCategories);
  }
  try {
    const items = await CategoryDb.find({});
    res.json(items.map(i => i.name));
  } catch (error) {
    res.json(localCategories);
  }
});

app.post("/api/categories", async (req, res) => {
  const dbConnected = await connectToMongo();
  const { category } = req.body;
  if (!category) return res.status(400).json({ error: "Category is required" });

  if (!localCategories.includes(category)) {
    localCategories.push(category);
  }

  if (!dbConnected) {
    return res.json({ name: category });
  }
  try {
    const existing = await CategoryDb.findOne({ name: category });
    if (!existing) {
      const item = new CategoryDb({ name: category });
      await item.save();
    }
    res.json({ name: category });
  } catch (error) {
    res.json({ name: category });
  }
});

app.delete("/api/categories/:category", async (req, res) => {
  const dbConnected = await connectToMongo();
  const { category } = req.params;
  
  localCategories = localCategories.filter(c => c.toLowerCase() !== category.toLowerCase());

  if (!dbConnected) {
    return res.json({ success: true });
  }
  try {
    await CategoryDb.deleteOne({ name: category });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: true });
  }
});

// PROMOTIONS
app.get("/api/promotions", async (req, res) => {
  const dbConnected = await connectToMongo();
  if (!dbConnected) {
    return res.json(localPromotions);
  }
  try {
    const promos = await PromotionDb.find({}).sort({ _id: -1 });
    res.json(promos);
  } catch (error) {
    console.error("MongoDB query promotions failed:", error);
    res.json(localPromotions);
  }
});

app.post("/api/promotions", async (req, res) => {
  const dbConnected = await connectToMongo();
  const rawPromo = req.body;
  if (!rawPromo.id) {
    rawPromo.id = `p-${Date.now()}`;
  }

  // Update in local fallback
  const index = localPromotions.findIndex(p => p.id === rawPromo.id);
  if (index >= 0) {
    localPromotions[index] = { ...localPromotions[index], ...rawPromo };
  } else {
    localPromotions.unshift(rawPromo);
  }

  if (!dbConnected) {
    return res.status(201).json(rawPromo);
  }
  try {
    const updated = await PromotionDb.findOneAndUpdate(
      { id: rawPromo.id },
      { $set: rawPromo },
      { upsert: true, new: true }
    );
    res.status(201).json(updated);
  } catch (error) {
    console.error("MongoDB save promotion failed:", error);
    res.status(201).json(rawPromo);
  }
});

app.delete("/api/promotions/:id", async (req, res) => {
  const dbConnected = await connectToMongo();
  const { id } = req.params;

  localPromotions = localPromotions.filter(p => p.id !== id);

  if (!dbConnected) {
    return res.json({ success: true });
  }
  try {
    await PromotionDb.deleteOne({ id });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: true });
  }
});

app.put("/api/promotions/:id/status", async (req, res) => {
  const dbConnected = await connectToMongo();
  const { id } = req.params;
  const { status } = req.body;

  localPromotions = localPromotions.map(p => p.id === id ? { ...p, status } : p);

  if (!dbConnected) {
    return res.json({ success: true });
  }
  try {
    await PromotionDb.updateOne({ id }, { $set: { status } });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: true });
  }
});

// PARTNERS
app.get("/api/partners", async (req, res) => {
  const dbConnected = await connectToMongo();
  if (!dbConnected) {
    return res.json(localPartners);
  }
  try {
    const partners = await PartnerDb.find({}).sort({ _id: -1 });
    res.json(partners);
  } catch (error) {
    res.json(localPartners);
  }
});

app.post("/api/partners", async (req, res) => {
  const dbConnected = await connectToMongo();
  const rawPartner = req.body;
  if (!rawPartner.id) {
    rawPartner.id = `p-${Date.now()}`;
  }

  const idx = localPartners.findIndex(p => p.id === rawPartner.id);
  if (idx >= 0) {
    localPartners[idx] = { ...localPartners[idx], ...rawPartner };
  } else {
    localPartners.unshift(rawPartner);
  }

  if (!dbConnected) {
    return res.status(201).json(rawPartner);
  }
  try {
    const updated = await PartnerDb.findOneAndUpdate(
      { id: rawPartner.id },
      { $set: rawPartner },
      { upsert: true, new: true }
    );
    res.status(201).json(updated);
  } catch (error) {
    res.status(201).json(rawPartner);
  }
});

app.put("/api/partners/:id/status", async (req, res) => {
  const dbConnected = await connectToMongo();
  const { id } = req.params;
  const { status } = req.body;

  localPartners = localPartners.map(p => p.id === id ? { ...p, status } : p);

  if (!dbConnected) {
    return res.json({ success: true });
  }
  try {
    await PartnerDb.updateOne({ id }, { $set: { status } });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: true });
  }
});

app.put("/api/partners/:id/verification", async (req, res) => {
  const dbConnected = await connectToMongo();
  const { id } = req.params;
  const { verified } = req.body;

  localPartners = localPartners.map(p => p.id === id ? { ...p, verified } : p);

  if (!dbConnected) {
    return res.json({ success: true });
  }
  try {
    await PartnerDb.updateOne({ id }, { $set: { verified } });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: true });
  }
});

app.delete("/api/partners/:id", async (req, res) => {
  const dbConnected = await connectToMongo();
  const { id } = req.params;

  localPartners = localPartners.filter(p => p.id !== id);

  if (!dbConnected) {
    return res.json({ success: true });
  }
  try {
    await PartnerDb.deleteOne({ id });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: true });
  }
});

// USERS
app.get("/api/users", async (req, res) => {
  const dbConnected = await connectToMongo();
  if (!dbConnected) {
    return res.json(localUsers);
  }
  try {
    const list = await UserDb.find({});
    res.json(list);
  } catch (error) {
    res.json(localUsers);
  }
});

app.post("/api/users", async (req, res) => {
  const dbConnected = await connectToMongo();
  const rawUser = req.body;
  if (!rawUser.email) return res.status(400).json({ error: "Email is required" });

  const idx = localUsers.findIndex(u => u.email.toLowerCase() === rawUser.email.toLowerCase());
  if (idx >= 0) {
    localUsers[idx] = { ...localUsers[idx], ...rawUser };
  } else {
    localUsers.push(rawUser);
  }

  if (!dbConnected) {
    return res.json(rawUser);
  }
  try {
    const updated = await UserDb.findOneAndUpdate(
      { email: rawUser.email.toLowerCase() },
      { $set: rawUser },
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (error) {
    res.json(rawUser);
  }
});

app.put("/api/users/:email/role", async (req, res) => {
  const dbConnected = await connectToMongo();
  const email = req.params.email.toLowerCase();
  const { role } = req.body;

  localUsers = localUsers.map(u => u.email.toLowerCase() === email ? { ...u, role } : u);

  if (!dbConnected) {
    return res.json({ success: true });
  }
  try {
    await UserDb.updateOne({ email }, { $set: { role } });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: true });
  }
});

app.delete("/api/users/:email", async (req, res) => {
  const dbConnected = await connectToMongo();
  const email = req.params.email.toLowerCase();

  localUsers = localUsers.filter(u => u.email.toLowerCase() !== email);

  if (!dbConnected) {
    return res.json({ success: true });
  }
  try {
    await UserDb.deleteOne({ email });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: true });
  }
});

// ORDERS
app.get("/api/orders", async (req, res) => {
  const dbConnected = await connectToMongo();
  if (!dbConnected) {
    return res.json(localOrders);
  }
  try {
    const list = await OrderDb.find({}).sort({ _id: -1 });
    res.json(list);
  } catch (error) {
    res.json(localOrders);
  }
});

app.post("/api/orders", async (req, res) => {
  const dbConnected = await connectToMongo();
  const rawOrder = req.body;
  if (!rawOrder.id) {
    rawOrder.id = `HAWTA-${Math.floor(100000 + Math.random() * 900000)}`;
  }

  localOrders.unshift(rawOrder);

  if (!dbConnected) {
    return res.status(201).json(rawOrder);
  }
  try {
    const item = new OrderDb(rawOrder);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(201).json(rawOrder);
  }
});

app.put("/api/orders/:id/status", async (req, res) => {
  const dbConnected = await connectToMongo();
  const { id } = req.params;
  const { status } = req.body;

  localOrders = localOrders.map(o => o.id === id ? { ...o, status } : o);

  if (!dbConnected) {
    return res.json({ success: true });
  }
  try {
    await OrderDb.updateOne({ id }, { $set: { status } });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: true });
  }
});

// ----------------------------------------------------
// Middleware for Vite / Static files
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
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
