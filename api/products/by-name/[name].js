import { getDB } from "../../../utils/database.js"

export default async function handler(req, res) {
  const { name } = req.query

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    console.log("[v0] 📦 Getting products by name:", name)

    const db = getDB()

    // Get products with market information
    const products = await db
      .collection("products")
      .aggregate([
        { $match: { name: name } },
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
            _id: 1,
            name: 1,
            marketId: "$market._id",
            marketName: "$market.name",
            location: "$market.location",
            sellingPrice: 1,
            buyingPrice: 1,
            stock: 1,
          },
        },
      ])
      .toArray()

    console.log("[v0] Found products:", products.length)
    res.status(200).json(products)
  } catch (error) {
    console.error("[v0] ❌ Error getting products by name:", error)
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    })
  }
}
