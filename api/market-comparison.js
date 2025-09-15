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

        const comparisonData = await db
          .collection("products")
          .aggregate([
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
                productName: "$name",
                marketId: "$marketId",
                marketName: "$market.name",
                location: "$market.location",
                sellingPrice: 1, // Already in UGX
                buyingPrice: 1, // Already in UGX
                stock: 1,
                trend: { $literal: "stable" }, // Default trend
                _id: 1,
              },
            },
          ])
          .toArray()

        console.log("[v0] ✅ Market comparison data prepared successfully:", comparisonData.length, "items")
        res.json(comparisonData)
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
