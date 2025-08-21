const { getDatabase } = require("../../utils/database")
const { ObjectId } = require("mongodb")

module.exports = async (req, res) => {
  console.log(`[v0] ${new Date().toISOString()} - ${req.method} /api/markets/all`)
  console.log("[v0] Markets/all API - Request headers:", JSON.stringify(req.headers, null, 2))
  console.log("[v0] Markets/all API - Query params:", req.query)

  try {
    const db = await getDatabase()
    console.log("[v0] 📊 Database instance retrieved for markets/all")

    if (req.method === "GET") {
      const marketCount = await db.collection("markets").countDocuments()
      console.log(`[v0] Total markets in database: ${marketCount}`)

      // Get all markets with product counts and statistics
      const markets = await db
        .collection("markets")
        .aggregate([
          {
            $lookup: {
              from: "products",
              localField: "_id",
              foreignField: "marketId",
              as: "products",
            },
          },
          {
            $addFields: {
              productCount: { $size: "$products" },
              avgSellingPrice: { $avg: "$products.sellingPrice" },
              avgBuyingPrice: { $avg: "$products.buyingPrice" },
              totalStock: { $sum: "$products.stock" },
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              location: 1,
              description: 1,
              contactInfo: 1,
              productCount: 1,
              avgSellingPrice: { $round: ["$avgSellingPrice", 0] },
              avgBuyingPrice: { $round: ["$avgBuyingPrice", 0] },
              totalStock: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
          { $sort: { createdAt: -1 } },
        ])
        .toArray()

      console.log(`[v0] Found ${markets.length} markets with statistics`)
      console.log("[v0] Markets data sample:", markets.slice(0, 2))
      console.log("[v0] Sending markets response with status 200")

      res.status(200).json(markets)
    } else {
      console.log("[v0] ❌ Method not allowed:", req.method)
      res.status(405).json({ error: "Method not allowed" })
    }
  } catch (error) {
    console.error("[v0] ❌ Error in markets/all API:", error)
    console.error("[v0] Error stack:", error.stack)
    res.status(500).json({
      error: "Failed to fetch markets",
      details: error.message,
    })
  }
}
