import express from "express";
import path from "path";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Parsers
app.use(express.json());

// In-memory simple store for registrations & webhooks (since we are creating a fully functional state)
interface VIPUser {
  id: string;
  name: string;
  email: string;
  whatsapp?: string;
  stylePreference?: string;
  role: "VIP" | "Guest";
}

const vipUsers: VIPUser[] = [
  {
    id: "user-1",
    name: "Classic VIP",
    email: "vip@shopname.com",
    role: "VIP",
    stylePreference: "Tailored Suits"
  }
];

// Fallback JWT secret if not configured
const JWT_SECRET = process.env.JWT_SECRET || "aura_noir_menswear_boutique_secure_token_secret";

// Middleware to authorize JWT requests
export function authenticateJWT(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: "Authorization header with Bearer token is required" });
  }
}

// ---------------- API ENDPOINTS ----------------

// Products list
const boutiqueProducts = [
  {
    id: "p1",
    name: "Phantom Tailored Wool Overcoat",
    price: "$1,850",
    category: "Shirts", // Category matching bento mesh or custom
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop",
    sizes: ["48", "50", "52", "54"],
    countInStock: 3,
    description: "Handcrafted double-breasted overcoat from premium Italian virgin wool, finished with a subtle anthracite metallic thread."
  },
  {
    id: "p2",
    name: "Noir Obsidian Leather Moto",
    price: "$2,400",
    category: "Shirts",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop",
    sizes: ["S", "M", "L", "XL"],
    countInStock: 2,
    description: "Matte black full-grain calfskin leather jacket with premium sterling silver hardware and 3D silhouette contour stitching."
  },
  {
    id: "p3",
    name: "Liquid-Silk Charcoal Dress Shirt",
    price: "$650",
    category: "Shirts",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop",
    sizes: ["39", "40", "41", "42", "43"],
    countInStock: 8,
    description: "100% mulberry silk classic silhouette dress shirt with hand-carved mother of pearl buttons and deep carbon grey sheen."
  },
  {
    id: "p4",
    name: "Carbon Cyber-Tech Chelsea Boots",
    price: "$1,100",
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=800&auto=format&fit=crop",
    sizes: ["41", "42", "43", "44", "45"],
    countInStock: 0, // Show Out of stock behavior
    description: "Laser-molded calfskin upper combined with a sculpted carbon-fiber modular heel chassis, styled in dark midnight black."
  },
  {
    id: "p5",
    name: "Vitesse Sterling Cufflinks",
    price: "$420",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop",
    sizes: ["O/S"],
    countInStock: 12,
    description: "Handmade solid sterling silver cufflinks representing skeletal geometric architectures with micro-embedded onyx stones."
  },
  {
    id: "p6",
    name: "Aura Matte Chromium Sunglasses",
    price: "$480",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop",
    sizes: ["O/S"],
    countInStock: 5,
    description: "Architectural monolithic Japanese titanium eyewear with high-rebound polarized electric blue reflective lenses."
  }
];

app.get("/api/products", (req, res) => {
  res.json({ products: boutiqueProducts });
});

// Authentication endpoints
app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required fields to register" });
  }

  // Check if exists
  const exists = vipUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: "User with this email is already registered as a VIP" });
  }

  const newUser: VIPUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    role: "VIP"
  };
  vipUsers.push(newUser);

  // Sign JWT
  const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name }, JWT_SECRET, { expiresIn: "7d" });
  res.status(201).json({ token, user: newUser });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email address is required" });
  }

  // Find VIP user or auto-register to make preview highly user friendly (password is simulated)
  let user = vipUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    // Elegant system feature: Auto-enroll VIP for preview purposes
    user = {
      id: `user-${Date.now()}`,
      name: email.split("@")[0].toUpperCase() || "VIP member",
      email,
      role: "VIP",
      stylePreference: "Avant-Garde Noir"
    };
    vipUsers.push(user);
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user });
});

app.get("/api/auth/me", authenticateJWT, (req: any, res) => {
  res.json({ user: req.user });
});

// WEBHOOK TRIGGERS (n8n API POST calls proxy)
app.post("/api/webhook/check-stock", async (req, res) => {
  const { productId, size, productName, whatsapp } = req.body;
  if (!productId || !size) {
    return res.status(400).json({ error: "Missing required fields productId or size" });
  }

  console.log(`[n8n Webhook] Stock check triggered for product ${productName} (ID: ${productId}), Size: ${size}. User WhatsApp: ${whatsapp || "Not provided"}`);

  const payload = {
    event: "stock_check",
    timestamp: new Date().toISOString(),
    productId,
    productName,
    size,
    whatsapp: whatsapp || ""
  };

  const webhookUrl = process.env.N8N_CHECK_STOCK_URL;
  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.text();
      return res.json({ success: true, via: "n8n_webhook", responseText: data });
    } catch (err: any) {
      console.error("Failed forwarding stock check to n8n Webhook URL:", err.message);
      return res.status(502).json({
        success: false,
        error: "n8n endpoint failed to respond",
        details: err.message
      });
    }
  } else {
    // Safe fall-back response when n8n webhook URL is not supplied in env (expected during preview)
    return res.json({
      success: true,
      via: "simulation",
      message: "Webhook simulation success. To complete physical integration, configure N8N_CHECK_STOCK_URL in application environments.",
      payload
    });
  }
});

app.post("/api/webhook/membership", async (req, res) => {
  const { name, whatsapp, stylePreference } = req.body;
  if (!name || !whatsapp) {
    return res.status(400).json({ error: "Missing required fields: Name and WhatsApp are mandatory for VIP elite membership" });
  }

  console.log(`[n8n Webhook] Elite Membership registered. Name: ${name}, WhatsApp: ${whatsapp}, Style Preference: ${stylePreference || "Classic Luxury"}`);

  const payload = {
    event: "vip_membership_sign_up",
    timestamp: new Date().toISOString(),
    name,
    whatsapp,
    stylePreference: stylePreference || "Avant-Garde Noir"
  };

  const webhookUrl = process.env.N8N_MEMBERSHIP_URL;
  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.text();
      return res.json({ success: true, via: "n8n_webhook", responseText: data });
    } catch (err: any) {
      console.error("Failed forwarding membership details to n8n Webhook URL:", err.message);
      return res.status(502).json({
        success: false,
        error: "n8n membership endpoint failed to respond",
        details: err.message
      });
    }
  } else {
    // Simulation fallback
    return res.json({
      success: true,
      via: "simulation",
      message: "Elite Member registration simulation completed. To authorize active webhooks, configure N8N_MEMBERSHIP_URL inside environment variables.",
      payload
    });
  }
});

// Stylist chat proxy or simulation (chat trigger via n8n or direct AI assistant responses)
app.post("/api/chat", async (req, res) => {
  const { message, messageHistory } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Empty prompt is not accepted" });
  }

  // Premeditated response options for luxury stylist experience
  const luxuryStylistPredefined = [
    "Excellent selection. For an overcoat like the Phantom Tailored Wool, I highly suggest matching it with our mulberry silk charcoal dress shirt and clean bespoke Chelsea boots.",
    "A sleek look requires contrasting silhouettes. Our Carbon Cyber-Tech shoes combine robust engineering structures with streamlined, elegant styling lines.",
    "As an Elite VIP, you have early access to the upcoming 'Vanguard' collection. I recommend staying in touch via VIP channels for private previews in Paris and Tokyo."
  ];
  const responseText = luxuryStylistPredefined[Math.floor(Math.random() * luxuryStylistPredefined.length)];

  return res.json({
    reply: responseText,
    stylist: {
      name: "Bespoke Bot",
      signature: "[SHOP NAME] Private Stylist"
    }
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Vite Middleware & SPA serving
async function setupViteServerPort() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting Express + Vite server in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting Express server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Boutique full-stack platform spinning elegantly on http://0.0.0.0:${PORT}`);
  });
}

setupViteServerPort().catch((err) => {
  console.error("Vite integration crash:", err);
});
