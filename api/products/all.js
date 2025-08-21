const { getDatabase } = require("../../utils/database")
const { ObjectId } = require("mongodb")

module.exports = async (req, res) => {
  console.log(`[v0] ${new Date().toISOString()} - ${req.method} /api/products/all`)
  console.log("[v0] Products/all API - Request headers:", JSON.stringify(req.headers, null, 2))
  console.log("[v0] Products/all API - Query params:", req.query)

  try {
    const db = await getDatabase()
    console.log("[v0] 📊 Database instance retrieved for products/all")

    if (req.method === "GET") {
      const productCount = await db.collection("products").countDocuments()
      console.log(`[v0] Total products in database: ${productCount}`)

      // Get all products with market information
      const products = await db
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
          {
            $unwind: "$market",
          },
          {
            $project: {
              _id: 1,
              name: 1,
              category: 1,
              sellingPrice: 1,
              buyingPrice: 1,
              stock: 1,
              unit: 1,
              description: 1,
              marketId: 1,
              marketName: "$market.name",
              marketLocation: "$market.location",
              createdAt: 1,
              updatedAt: 1,
            },
          },
          { $sort: { createdAt: -1 } },
        ])
        .toArray()

      console.log(`[v0] Found ${products.length} products with market info`)
      console.log("[v0] Products data sample:", products.slice(0, 2))
      console.log("[v0] Sending products response with status 200")

      res.status(200).json(products)
    } else {
      console.log("[v0] ❌ Method not allowed:", req.method)
      res.status(405).json({ error: "Method not allowed" })
    }
  } catch (error) {
    console.error("[v0] ❌ Error in products/all API:", error)
    console.error("[v0] Error stack:", error.stack)
    res.status(500).json({
      error: "Failed to fetch products",
      details: error.message,
    })
  }
}
