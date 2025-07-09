import { getDB } from "../utils/database.js"

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const db = getDB()

    // Get market comparison data
    const comparison = await db
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
            marketId: "$marketId",
            marketName: "$market.name",
            productName: "$name",
            sellingPrice: 1,
            buyingPrice: 1,
            stock: 1,
            trend: {
              $switch: {
                branches: [
                  { case: { $gt: ["$sellingPrice", 50] }, then: "up" },
                  { case: { $lt: ["$sellingPrice", 20] }, then: "down" },
                ],
                default: "stable",
              },
            },
          },
        },
        { $limit: 20 },
      ])
      .toArray()

    res.status(200).json(comparison)
  } catch (error) {
    console.error("Market comparison error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
