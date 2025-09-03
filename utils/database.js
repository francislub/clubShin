import { MongoClient } from "mongodb"
import dotenv from "dotenv"

dotenv.config()

let client = null
let db = null

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DB_NAME = process.env.DB_NAME || "agritech_ai"

export async function connectDB() {
  try {
    console.log("[v0] Attempting to connect to MongoDB...")
    console.log("[v0] MongoDB URI:", MONGODB_URI.replace(/\/\/.*@/, "//***:***@"))

    if (client && client.topology && client.topology.isConnected()) {
      console.log("[v0] Database already connected")
      return db
    }

    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // Increased from 5000ms to 30000ms
      connectTimeoutMS: 30000, // Increased from 10000ms to 30000ms
      socketTimeoutMS: 30000, // Added socket timeout
      maxPoolSize: 10, // Added connection pool size
      retryWrites: true, // Enable retry writes
      retryReads: true, // Enable retry reads
    })

    await client.connect()
    db = client.db(DB_NAME)

    console.log("[v0] ✅ Successfully connected to MongoDB database:", DB_NAME)

    // Test the connection
    await db.admin().ping()
    console.log("[v0] ✅ Database ping successful")

    return db
  } catch (error) {
    console.error("[v0] ❌ MongoDB connection error:", error.message)
    if (error.name === "MongoServerSelectionError") {
      console.error("[v0] ❌ Server selection failed. Check if MongoDB is running and accessible.")
      console.error("[v0] ❌ Connection string:", MONGODB_URI.replace(/\/\/.*@/, "//***:***@"))
    }
    throw error
  }
}

export function getDB() {
  if (!db) {
    console.error("[v0] ❌ Database not connected. Call connectDB() first.")
    throw new Error("Database not connected. Call connectDB() first.")
  }
  console.log("[v0] 📊 Database instance retrieved")
  return db
}

export async function closeDB() {
  try {
    if (client) {
      console.log("[v0] 🔌 Closing database connection...")
      await client.close()
      client = null
      db = null
      console.log("[v0] ✅ Database connection closed successfully")
    }
  } catch (error) {
    console.error("[v0] ❌ Error closing database connection:", error.message)
    throw error
  }
}

// Collection helpers with logging
export async function getCollection(collectionName) {
  console.log(`[v0] 📋 Accessing collection: ${collectionName}`)
  const database = getDB()
  return database.collection(collectionName)
}

// Initialize collections and indexes
export async function initializeCollections() {
  try {
    console.log("[v0] 🏗️ Initializing database collections...")
    const database = getDB()

    // Create collections if they don't exist
    const collections = ["users", "farmers", "agents", "markets", "products", "transactions", "predictions"]

    for (const collectionName of collections) {
      try {
        await database.createCollection(collectionName)
        console.log(`[v0] ✅ Collection '${collectionName}' created/verified`)
      } catch (error) {
        if (error.code === 48) {
          console.log(`[v0] ℹ️ Collection '${collectionName}' already exists`)
        } else {
          throw error
        }
      }
    }

    // Create indexes for better performance
    console.log("[v0] 🔍 Creating database indexes...")

    // User indexes
    await database.collection("users").createIndex({ email: 1 }, { unique: true })
    await database.collection("farmers").createIndex({ email: 1 }, { unique: true })
    await database.collection("agents").createIndex({ email: 1 }, { unique: true })

    // Market indexes
    await database.collection("markets").createIndex({ name: 1 })
    await database.collection("markets").createIndex({ agentId: 1 })

    // Product indexes
    await database.collection("products").createIndex({ name: 1 })
    await database.collection("products").createIndex({ marketId: 1 })
    await database.collection("products").createIndex({ agentId: 1 })

    console.log("[v0] ✅ Database initialization completed successfully")
  } catch (error) {
    console.error("[v0] ❌ Error initializing collections:", error.message)
    throw error
  }
}
