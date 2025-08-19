import { getDB } from "../utils/database.js"

export default async function marketComparison(req, res) {
  console.log("[v0] 📊 Market comparison API called")
  console.log("[v0] Request method:", req.method)
  console.log("[v0] Request query:", req.query)

  const db = getDB()
  console.log("[v0] 📊 Database instance retrieved")

  try {
    switch (req.method) {
      case "GET":
        console.log("[v0] 📋 Fetching market comparison data...")

        // Get all markets with their products and prices
        const markets = await db.collection("markets").find({}).toArray()
        console.log("[v0] ✅ Retrieved", markets.length, "markets")

        const comparisonData = []

        for (const market of markets) {
          console.log("[v0] 🔍 Processing market:", market.name)

          // Get products for this market
          const products = await db.collection("products").find({ marketId: market._id }).toArray()

          const marketData = {
            marketId: market._id,
            marketName: market.name,
            location: market.location,
            products: products.map((product) => ({
              name: product.name,
              sellingPrice: product.sellingPrice,
              buyingPrice: product.buyingPrice,
              stock: product.stock,
            })),
          }

          comparisonData.push(marketData)
        }

        console.log("[v0] ✅ Market comparison data prepared successfully")
        res.json({
          success: true,
          data: comparisonData,
          timestamp: new Date().toISOString(),
        })
        break

      default:
        console.log("[v0] ❌ Unsupported method for market comparison API:", req.method)
        res.status(405).json({ message: "Method not allowed" })
    }
  } catch (error) {
    console.error("[v0] ❌ Market comparison API error:", error.message)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
