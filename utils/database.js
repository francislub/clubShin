import { MongoClient } from "mongodb"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in environment variables")
  console.log("💡 Please check your .env file and ensure MONGODB_URI is set")
  console.log("📝 Example: MONGODB_URI=mongodb://localhost:27017/agritech")
  process.exit(1)
}

let client = null
let db = null

export async function connectDB() {
  try {
    if (!client) {
      console.log("🔌 Connecting to MongoDB...")
      console.log("📍 URI:", MONGODB_URI.replace(/\/\/.*@/, "//***:***@"))

      client = new MongoClient(MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      })

      await client.connect()
      db = client.db("agritech")

      // Test the connection
      await db.admin().ping()
      console.log("✅ Database connection established successfully")
    }
    return db
  } catch (error) {
    console.error("❌ Database connection failed:", error.message)

    if (error.message.includes("Invalid scheme")) {
      console.log("\n💡 MongoDB URL Format Help:")
      console.log("✅ Local MongoDB: mongodb://localhost:27017/agritech")
      console.log("✅ MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/agritech")
      console.log("\n🔧 Current MONGODB_URI:", MONGODB_URI || "undefined")
    }

    throw error
  }
}

export function getDB() {
  if (!db) {
    throw new Error("❌ Database not connected. Call connectDB() first.")
  }
  return db
}

export async function closeDB() {
  if (client) {
    await client.close()
    client = null
    db = null
    console.log("🔌 Database connection closed")
  }
}
