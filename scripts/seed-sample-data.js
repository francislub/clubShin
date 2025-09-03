import { MongoClient } from "mongodb"

async function seedSampleData() {
  const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017")

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(process.env.DB_NAME || "clubshin")

    // Sample markets data
    const sampleMarkets = [
      {
        name: "Nakasero Market",
        location: "Kampala Central",
        description: "Main wholesale market in Kampala",
        agentId: "sample_agent_1",
        createdAt: new Date(),
      },
      {
        name: "Owino Market",
        location: "Kampala",
        description: "Large retail market",
        agentId: "sample_agent_1",
        createdAt: new Date(),
      },
      {
        name: "Kalerwe Market",
        location: "Kampala North",
        description: "Northern Kampala market",
        agentId: "sample_agent_2",
        createdAt: new Date(),
      },
    ]

    // Insert markets
    const marketsResult = await db.collection("markets").insertMany(sampleMarkets)
    console.log(`Inserted ${marketsResult.insertedCount} markets`)

    // Get inserted market IDs
    const marketIds = Object.values(marketsResult.insertedIds)

    // Sample products data
    const sampleProducts = [
      {
        name: "Beans",
        category: "Legumes",
        sellingPrice: 4000,
        buyingPrice: 3000,
        stock: 500,
        unit: "kg",
        marketId: marketIds[0],
        marketName: "Nakasero Market",
        marketLocation: "Kampala Central",
        agentId: "sample_agent_1",
        createdAt: new Date(),
      },
      {
        name: "Maize",
        category: "Cereals",
        sellingPrice: 2500,
        buyingPrice: 2000,
        stock: 1000,
        unit: "kg",
        marketId: marketIds[0],
        marketName: "Nakasero Market",
        marketLocation: "Kampala Central",
        agentId: "sample_agent_1",
        createdAt: new Date(),
      },
      {
        name: "Rice",
        category: "Cereals",
        sellingPrice: 5500,
        buyingPrice: 4500,
        stock: 300,
        unit: "kg",
        marketId: marketIds[1],
        marketName: "Owino Market",
        marketLocation: "Kampala",
        agentId: "sample_agent_1",
        createdAt: new Date(),
      },
      {
        name: "Beans",
        category: "Legumes",
        sellingPrice: 3800,
        buyingPrice: 2800,
        stock: 400,
        unit: "kg",
        marketId: marketIds[1],
        marketName: "Owino Market",
        marketLocation: "Kampala",
        agentId: "sample_agent_1",
        createdAt: new Date(),
      },
      {
        name: "Coffee",
        category: "Cash Crops",
        sellingPrice: 8000,
        buyingPrice: 6500,
        stock: 200,
        unit: "kg",
        marketId: marketIds[2],
        marketName: "Kalerwe Market",
        marketLocation: "Kampala North",
        agentId: "sample_agent_2",
        createdAt: new Date(),
      },
    ]

    // Insert products
    const productsResult = await db.collection("products").insertMany(sampleProducts)
    console.log(`Inserted ${productsResult.insertedCount} products`)

    // Sample agents data
    const sampleAgents = [
      {
        _id: "sample_agent_1",
        name: "John Mukasa",
        email: "john@example.com",
        phone: "+256700123456",
        createdAt: new Date(),
      },
      {
        _id: "sample_agent_2",
        name: "Sarah Nakato",
        email: "sarah@example.com",
        phone: "+256700654321",
        createdAt: new Date(),
      },
    ]

    // Insert agents
    const agentsResult = await db.collection("agents").insertMany(sampleAgents)
    console.log(`Inserted ${agentsResult.insertedCount} agents`)

    // Sample farmers data
    const sampleFarmers = [
      {
        name: "Peter Ssemakula",
        email: "peter@example.com",
        phone: "+256700111222",
        location: "Wakiso",
        createdAt: new Date(),
      },
      {
        name: "Mary Namutebi",
        email: "mary@example.com",
        phone: "+256700333444",
        location: "Mukono",
        createdAt: new Date(),
      },
    ]

    // Insert farmers
    const farmersResult = await db.collection("farmers").insertMany(sampleFarmers)
    console.log(`Inserted ${farmersResult.insertedCount} farmers`)

    console.log("Sample data seeded successfully!")
  } catch (error) {
    console.error("Error seeding sample data:", error)
  } finally {
    await client.close()
  }
}

// Run the seeding function
seedSampleData().catch(console.error)
