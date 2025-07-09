import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || ""

console.log("Connecting to MongoDB with URI:", MONGODB_URI.replace(/\/\/.*@/, "//***:***@"))

const client = new MongoClient(MONGODB_URI)

async function initializeDatabase() {
  try {
    console.log("Attempting to connect to MongoDB...")
    await client.connect()
    console.log("✅ Connected to MongoDB successfully!")

    const db = client.db("agritech")

    // Drop existing collections if they exist
    const collections = await db.listCollections().toArray()
    for (const collection of collections) {
      await db.collection(collection.name).drop()
      console.log(`Dropped existing collection: ${collection.name}`)
    }

    // Create collections
    await db.createCollection("farmers")
    await db.createCollection("agents")
    await db.createCollection("markets")
    await db.createCollection("products")
    await db.createCollection("predictions")

    console.log("✅ Collections created successfully!")

    // Create sample farmer
    const hashedFarmerPassword = await bcrypt.hash("farmer123", 10)
    await db.collection("farmers").insertOne({
      name: "John Farmer",
      email: "farmer@example.com",
      password: hashedFarmerPassword,
      phone: "+1234567890",
      location: "Rural County",
      farmSize: "50 acres",
      crops: ["Tomatoes", "Potatoes", "Onions"],
      createdAt: new Date(),
    })

    // Create sample agent
    const hashedAgentPassword = await bcrypt.hash("agent123", 10)
    const agentResult = await db.collection("agents").insertOne({
      name: "Jane Agent",
      email: "agent@example.com",
      password: hashedAgentPassword,
      phone: "+1234567891",
      company: "AgriTrade Corp",
      license: "AGT-2024-001",
      createdAt: new Date(),
    })

    // Create sample markets
    const market1 = await db.collection("markets").insertOne({
      name: "Central Market",
      location: "Downtown",
      description: "Main agricultural market in the city center",
      agentId: agentResult.insertedId,
      address: "123 Market Street, Downtown",
      operatingHours: "6:00 AM - 6:00 PM",
      createdAt: new Date(),
      productCount: 0,
    })

    const market2 = await db.collection("markets").insertOne({
      name: "Farmers Market",
      location: "Suburb",
      description: "Local farmers market with fresh produce",
      agentId: agentResult.insertedId,
      address: "456 Farm Road, Suburb",
      operatingHours: "7:00 AM - 5:00 PM",
      createdAt: new Date(),
      productCount: 0,
    })

    // Create sample products
    const products = [
      {
        name: "Tomatoes",
        category: "Vegetables",
        marketId: market1.insertedId,
        sellingPrice: 3.5,
        buyingPrice: 2.0,
        stock: 500,
        unit: "kg",
        quality: "Grade A",
        agentId: agentResult.insertedId,
        createdAt: new Date(),
      },
      {
        name: "Potatoes",
        category: "Vegetables",
        marketId: market1.insertedId,
        sellingPrice: 2.25,
        buyingPrice: 1.5,
        stock: 800,
        unit: "kg",
        quality: "Grade A",
        agentId: agentResult.insertedId,
        createdAt: new Date(),
      },
      {
        name: "Onions",
        category: "Vegetables",
        marketId: market2.insertedId,
        sellingPrice: 1.75,
        buyingPrice: 1.0,
        stock: 600,
        unit: "kg",
        quality: "Grade B",
        agentId: agentResult.insertedId,
        createdAt: new Date(),
      },
      {
        name: "Carrots",
        category: "Vegetables",
        marketId: market2.insertedId,
        sellingPrice: 2.8,
        buyingPrice: 1.8,
        stock: 400,
        unit: "kg",
        quality: "Grade A",
        agentId: agentResult.insertedId,
        createdAt: new Date(),
      },
    ]

    await db.collection("products").insertMany(products)

    // Update market product counts
    await db.collection("markets").updateOne({ _id: market1.insertedId }, { $set: { productCount: 2 } })

    await db.collection("markets").updateOne({ _id: market2.insertedId }, { $set: { productCount: 2 } })

    // Create sample predictions
    const predictions = [
      {
        product: "Tomatoes",
        currentPrice: 3.5,
        predictedPrice: 4.2,
        confidence: 85,
        timeframe: "next_week",
        factors: ["seasonal_demand", "weather_conditions"],
        createdAt: new Date(),
      },
      {
        product: "Potatoes",
        currentPrice: 2.25,
        predictedPrice: 2.1,
        confidence: 78,
        timeframe: "next_week",
        factors: ["supply_increase", "harvest_season"],
        createdAt: new Date(),
      },
    ]

    await db.collection("predictions").insertMany(predictions)

    console.log("✅ Sample data inserted successfully!")
    console.log("\n🔑 Login Credentials:")
    console.log("👨‍🌾 Farmer: farmer@example.com / farmer123")
    console.log("👨‍💼 Agent: agent@example.com / agent123")
    console.log("\n🌐 Access URLs:")
    console.log("🏠 Main Site: http://localhost:3000")
    console.log("👨‍🌾 Farmer Portal: http://localhost:3000/farmer-login.html")
    console.log("👨‍💼 Agent Portal: http://localhost:3000/agent-login.html")
  } catch (error) {
    console.error("❌ Database initialization error:", error.message)
    if (error.message.includes("Invalid scheme")) {
      console.log("\n💡 MongoDB URL Format Help:")
      console.log("Local MongoDB: mongodb://localhost:27017/agritech")
      console.log("MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/agritech")
      console.log("\n🔧 Check your .env file and ensure MONGODB_URI is set correctly")
    }
  } finally {
    await client.close()
    console.log("🔌 Database connection closed")
  }
}

initializeDatabase()
