import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import { connectDB, getDB, initializeCollections } from "./utils/database.js"

// Import API route handlers
import agentRegister from "./api/auth/agent/register.js"
import agentLogin from "./api/auth/agent/login.js"
import farmerRegister from "./api/auth/farmer/register.js"
import farmerLogin from "./api/auth/farmer/login.js"
import marketsHandler from "./api/markets.js"
import productsHandler from "./api/products.js"
import marketComparisonHandler from "./api/market-comparison.js"
import predictPriceHandler from "./api/predict-price.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[v0] ${new Date().toISOString()} - ${req.method} ${req.path}`)
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`[v0] Request body keys: ${Object.keys(req.body).join(", ")}`)
  }
  next()
})

// Authentication routes
app.post("/api/auth/agent/register", (req, res) => {
  console.log("[v0] Agent registration route accessed")
  agentRegister(req, res)
})

app.post("/api/auth/agent/login", (req, res) => {
  console.log("[v0] Agent login route accessed")
  agentLogin(req, res)
})

app.post("/api/auth/farmer/register", (req, res) => {
  console.log("[v0] Farmer registration route accessed")
  farmerRegister(req, res)
})

app.post("/api/auth/farmer/login", (req, res) => {
  console.log("[v0] Farmer login route accessed")
  farmerLogin(req, res)
})

// Markets API routes
app.all("/api/markets", (req, res) => {
  console.log("[v0] Markets API route accessed")
  marketsHandler(req, res)
})

app.all("/api/markets/:id", (req, res) => {
  console.log("[v0] Markets API with ID route accessed")
  req.query.id = req.params.id
  marketsHandler(req, res)
})

// Products API routes
app.all("/api/products", (req, res) => {
  console.log("[v0] Products API route accessed")
  productsHandler(req, res)
})

app.all("/api/products/by-name/:productName", (req, res) => {
  console.log("[v0] Products API by name route accessed")
  req.params.productName = req.params.productName
  productsHandler(req, res)
})

app.all("/api/products/:productName", (req, res) => {
  console.log("[v0] Products API with product name route accessed")
  productsHandler(req, res)
})

app.all("/api/products/market/:marketId", (req, res) => {
  console.log("[v0] Products API with market ID route accessed")
  productsHandler(req, res)
})

// Agent-specific routes for markets and products
// Agent Markets API routes
app.all("/api/agent/markets", (req, res) => {
  console.log("[v0] Agent markets API route accessed")
  marketsHandler(req, res)
})

app.all("/api/agent/markets/:id", (req, res) => {
  console.log("[v0] Agent markets API with ID route accessed")
  req.query.id = req.params.id
  marketsHandler(req, res)
})

// Agent Products API routes
app.all("/api/agent/products", (req, res) => {
  console.log("[v0] Agent products API route accessed")
  productsHandler(req, res)
})

app.all("/api/agent/products/:productName", (req, res) => {
  console.log("[v0] Agent products API with product name route accessed")
  productsHandler(req, res)
})

app.all("/api/agent/products/market/:marketId", (req, res) => {
  console.log("[v0] Agent products API with market ID route accessed")
  productsHandler(req, res)
})

// Dashboard routes
app.get("/api/farmer/dashboard", async (req, res) => {
  console.log("[v0] Farmer dashboard data requested")
  try {
    const db = getDB()
    // Mock farmer data for now - in production, get from JWT token
    const farmerData = {
      name: "Sample Farmer",
      email: "farmer@example.com",
      location: "Sample Location",
      totalProducts: await db.collection("products").countDocuments(),
      totalMarkets: await db.collection("markets").countDocuments(),
    }
    console.log("[v0] Farmer dashboard data retrieved successfully")
    res.json({ success: true, data: farmerData })
  } catch (error) {
    console.log("[v0] Error fetching farmer dashboard:", error.message)
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get("/api/agent/dashboard", async (req, res) => {
  console.log("[v0] Agent dashboard data requested")
  try {
    const db = getDB()
    // Mock agent data for now - in production, get from JWT token
    const agentData = {
      name: "Sample Agent",
      email: "agent@example.com",
      location: "Sample Location",
      totalProducts: await db.collection("products").countDocuments(),
      totalMarkets: await db.collection("markets").countDocuments(),
    }
    console.log("[v0] Agent dashboard data retrieved successfully")
    res.json({ success: true, data: agentData })
  } catch (error) {
    console.log("[v0] Error fetching agent dashboard:", error.message)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Static file serving
app.use(express.static(__dirname))

// Root route
app.get("/", (req, res) => {
  console.log("[v0] Root route accessed, serving index.html")
  res.sendFile(path.join(__dirname, "index.html"))
})

// Market comparison API
app.all("/api/market-comparison", (req, res) => {
  console.log("[v0] Market comparison API route accessed")
  marketComparisonHandler(req, res)
})

// Price prediction API
app.all("/api/predict-price", (req, res) => {
  console.log("[v0] Price prediction API route accessed")
  predictPriceHandler(req, res)
})

// 404 handler
app.use((req, res) => {
  console.log(`[v0] 404 - Route not found: ${req.method} ${req.path}`)
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.path}`,
  })
})

// Error handler
app.use((error, req, res, next) => {
  console.log("[v0] Server error:", error.message)
  res.status(500).json({ success: false, error: error.message })
})

// Start server
async function startServer() {
  try {
    console.log("[v0] Starting AgriTech AI server...")
    console.log("[v0] Connecting to database...")

    await connectDB()
    console.log("[v0] Database connected successfully")

    console.log("[v0] Initializing database collections...")
    await initializeCollections()
    console.log("[v0] Database collections initialized")

    app.listen(PORT, () => {
      console.log(`[v0] ✅ Server running on port ${PORT}`)
      console.log(`[v0] ✅ Server started at ${new Date().toISOString()}`)
      console.log(`[v0] 🌐 Access your app at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.log("[v0] ❌ Failed to start server:", error.message)
    process.exit(1)
  }
}

startServer()
