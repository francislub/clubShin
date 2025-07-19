import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import { connectDB, closeDB } from "./utils/database.js"

// Load environment variables first
dotenv.config()

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

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Serve static files
app.use(express.static("."))

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  })
})

// Import and use API routes after database connection
async function setupRoutes() {
  try {
    // Connect to database first
    await connectDB()
    console.log("✅ Database connected successfully")

    // Import routes after database connection
    const { default: farmerLogin } = await import("./api/auth/farmer/login.js")
    const { default: agentLogin } = await import("./api/auth/agent/login.js")
    const { default: farmerRegister } = await import("./api/auth/farmer/register.js")
    const { default: agentRegister } = await import("./api/auth/agent/register.js")
    const { default: markets } = await import("./api/markets.js")
    const { default: products } = await import("./api/products.js")
    const { default: predictPrice } = await import("./api/predict-price.js")
    const { default: farmerDashboard } = await import("./api/farmer/dashboard.js")
    const { default: agentDashboard } = await import("./api/agent/dashboard.js")
    const { default: marketComparison } = await import("./api/market-comparison.js")

    // Authentication Routes
    app.post("/api/auth/farmer/login", farmerLogin)
    app.post("/api/auth/agent/login", agentLogin)
    app.post("/api/auth/farmer/register", farmerRegister)
    app.post("/api/auth/agent/register", agentRegister)

    // Market Routes
    app.get("/api/markets", markets)
    app.post("/api/markets", markets)
    app.delete("/api/markets/:id", (req, res) => {
      req.query.id = req.params.id
      markets(req, res)
    })

    // Product Routes
    app.get("/api/products", products)
    app.post("/api/products", products)
    app.delete("/api/products/:id", (req, res) => {
      req.query.id = req.params.id
      products(req, res)
    })

    // Additional product routes
    app.get("/api/products/by-name/:name", async (req, res) => {
      try {
        req.method = "GET"
        req.params.productName = req.params.name
        await products(req, res)
      } catch (error) {
        res.status(500).json({ error: "Internal server error" })
      }
    })

    app.get("/api/products/by-market/:marketId", async (req, res) => {
      try {
        req.method = "GET"
        req.params.marketId = req.params.marketId
        await products(req, res)
      } catch (error) {
        res.status(500).json({ error: "Internal server error" })
      }
    })

    // Prediction Routes
    app.post("/api/predict-price", predictPrice)

    // Dashboard Routes
    app.get("/api/farmer/dashboard", farmerDashboard)
    app.get("/api/agent/dashboard", agentDashboard)

    // Market Comparison
    app.get("/api/market-comparison", marketComparison)

    // Agent specific routes
    app.get("/api/agent/markets", async (req, res) => {
      try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) {
          return res.status(401).json({ message: "No token provided" })
        }

        const jwt = await import("jsonwebtoken")
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET || "your-secret-key")

        if (decoded.type !== "agent") {
          return res.status(403).json({ message: "Access denied" })
        }

        const { getDB } = await import("./utils/database.js")
        const { ObjectId } = await import("mongodb")
        const db = getDB()

        const agentMarkets = await db
          .collection("markets")
          .find({
            agentId: new ObjectId(decoded.id),
          })
          .toArray()

        res.json(agentMarkets)
      } catch (error) {
        console.error("Agent markets error:", error)
        res.status(500).json({ message: "Internal server error" })
      }
    })

    app.get("/api/agent/products", async (req, res) => {
      try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) {
          return res.status(401).json({ message: "No token provided" })
        }

        const jwt = await import("jsonwebtoken")
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET || "your-secret-key")

        if (decoded.type !== "agent") {
          return res.status(403).json({ message: "Access denied" })
        }

        const { getDB } = await import("./utils/database.js")
        const { ObjectId } = await import("mongodb")
        const db = getDB()

        const agentProducts = await db
          .collection("products")
          .aggregate([
            { $match: { agentId: new ObjectId(decoded.id) } },
            {
              $lookup: {
                from: "markets",
                localField: "marketId",
                foreignField: "_id",
                as: "market",
              },
            },
            { $unwind: "$market" },
            {
              $project: {
                name: 1,
                sellingPrice: 1,
                buyingPrice: 1,
                stock: 1,
                marketName: "$market.name",
                createdAt: 1,
              },
            },
          ])
          .toArray()

        res.json(agentProducts)
      } catch (error) {
        console.error("Agent products error:", error)
        res.status(500).json({ message: "Internal server error" })
      }
    })

    console.log("✅ API routes configured successfully")
  } catch (error) {
    console.error("❌ Failed to setup routes:", error)
    throw error
  }
}

// Define all your HTML file routes explicitly
const htmlFiles = [
  "index.html",
  "farmer-login.html",
  "farmer-register.html",
  "farmer-dashboard.html",
  "farmer-markets.html",
  "farmer-profile.html",
  "farmer-settings.html",
  "farmer-transactions.html",
  "agent-login.html",
  "agent-register.html",
  "agent-dashboard.html",
  "agent-analytics.html",
  "disease-identification.html",
  "pest-detection.html",
  "control-methods.html",
  "organic-solutions.html",
  "weather.html",
  "soil-testing.html",
  "soil-improvement.html",
  "Landcare.html",
  "market.html",
]

// Serve HTML files - Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

// Handle all HTML file routes with proper error handling
htmlFiles.forEach((file) => {
  const routeName = file.replace(".html", "")

  // Route without .html extension
  app.get(`/${routeName}`, (req, res) => {
    const filePath = path.join(__dirname, file)
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(`Error serving ${file}:`, err)
        res.status(404).send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Page Not Found</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
              .error { color: #e74c3c; }
              .links { margin-top: 20px; }
              .links a { margin: 0 10px; color: #3498db; text-decoration: none; }
            </style>
          </head>
          <body>
            <h1 class="error">404 - Page Not Found</h1>
            <p>The page "${routeName}" could not be found.</p>
            <div class="links">
              <a href="/">Home</a>
              <a href="/farmer-login">Farmer Login</a>
              <a href="/agent-login">Agent Login</a>
              <a href="/disease-identification">Disease ID</a>
              <a href="/soil-testing">Soil Testing</a>
            </div>
          </body>
          </html>
        `)
      }
    })
  })

  // Route with .html extension
  app.get(`/${file}`, (req, res) => {
    const filePath = path.join(__dirname, file)
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(`Error serving ${file}:`, err)
        res.status(404).send(`Page not found: ${file}`)
      }
    })
  })
})

// Catch-all route for any other requests to HTML-like paths
app.get("/:page", (req, res) => {
  const page = req.params.page

  // Skip API routes
  if (page.startsWith("api")) {
    return res.status(404).json({ error: "API route not found" })
  }

  const htmlFile = `${page}.html`
  const filePath = path.join(__dirname, htmlFile)

  // Try to serve the file
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`File not found: ${htmlFile}`)
      res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Page Not Found</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .error { color: #e74c3c; }
            .available { margin-top: 30px; }
            .available ul { list-style: none; padding: 0; }
            .available li { margin: 5px 0; }
            .available a { color: #3498db; text-decoration: none; }
          </style>
        </head>
        <body>
          <h1 class="error">404 - Page Not Found</h1>
          <p>The page "${page}" does not exist.</p>
          <div class="available">
            <h3>Available Pages:</h3>
            <ul>
              ${htmlFiles.map((f) => `<li><a href="/${f.replace(".html", "")}">${f.replace(".html", "").replace("-", " ").toUpperCase()}</a></li>`).join("")}
            </ul>
          </div>
        </body>
        </html>
      `)
    }
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack)
  res.status(500).json({
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  })
})

// 404 handler - this should be last
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`)
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method,
    message: "The requested resource could not be found.",
  })
})

// Start server
async function startServer() {
  try {
    // Setup routes and database connection
    await setupRoutes()

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 AgriTech AI System running on http://localhost:${PORT}`)
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`)
      console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`)
      console.log(`🌱 Farmer Portal: http://localhost:${PORT}/farmer-login`)
      console.log(`👨‍💼 Agent Portal: http://localhost:${PORT}/agent-login`)
      console.log("\n📋 Available Pages:")
      htmlFiles.forEach((file) => {
        const route = file.replace(".html", "")
        console.log(`   http://localhost:${PORT}/${route}`)
      })
      console.log("\n📋 Available API Endpoints:")
      console.log("   POST /api/auth/farmer/login")
      console.log("   POST /api/auth/agent/login")
      console.log("   POST /api/auth/farmer/register")
      console.log("   POST /api/auth/agent/register")
      console.log("   GET  /api/markets")
      console.log("   GET  /api/products")
      console.log("   POST /api/predict-price")
      console.log("   GET  /api/farmer/dashboard")
      console.log("   GET  /api/agent/dashboard")
    })
  } catch (error) {
    console.error("❌ Failed to start server:", error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server...")
  await closeDB()
  process.exit(0)
})

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down server...")
  await closeDB()
  process.exit(0)
})

startServer()
