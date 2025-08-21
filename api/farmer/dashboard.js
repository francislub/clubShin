import { ObjectId } from "mongodb"
import jwt from "jsonwebtoken"
import { getDB } from "../../utils/database.js"

export default async function handler(req, res) {
  console.log(`[v0] ${new Date().toISOString()} - ${req.method} /api/farmer/dashboard`)

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      console.log("[v0] No token provided in farmer dashboard request")
      return res.status(401).json({ message: "No token provided" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
    if (decoded.type !== "farmer") {
      console.log("[v0] Access denied - not a farmer token")
      return res.status(403).json({ message: "Access denied" })
    }

    console.log(`[v0] Farmer dashboard request for farmer ID: ${decoded.id}`)
    const db = getDB()

    const [markets, products, predictions, farmer, recentPredictions] = await Promise.all([
      db.collection("markets").countDocuments(),
      db.collection("products").countDocuments(),
      db.collection("predictions").countDocuments({ farmerId: new ObjectId(decoded.id) }),
      db.collection("farmers").findOne({ _id: new ObjectId(decoded.id) }),
      db
        .collection("predictions")
        .find({ farmerId: new ObjectId(decoded.id) })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
    ])

    let savedAmountUGX = predictions * 185000 // Base calculation

    // If we have recent predictions, calculate more accurate savings
    if (recentPredictions.length > 0) {
      const totalSavings = recentPredictions.reduce((sum, pred) => {
        const potentialLoss = pred.potentialLoss || 185000
        return sum + potentialLoss
      }, 0)
      savedAmountUGX = Math.max(savedAmountUGX, totalSavings)
    }

    const activeMarkets = await db.collection("markets").countDocuments({ status: { $ne: "inactive" } })

    const availableProducts = await db.collection("products").countDocuments({ stock: { $gt: 0 } })

    const response = {
      totalMarkets: markets,
      totalProducts: products,
      predictions,
      savedAmount: savedAmountUGX,
      farmerName: farmer?.name || farmer?.username || "Farmer",
      farmerEmail: farmer?.email || "",
      activeMarkets,
      availableProducts,
      recentPredictionsCount: recentPredictions.length,
      avgSavingsPerPrediction: predictions > 0 ? Math.round(savedAmountUGX / predictions) : 0,
    }

    console.log(`[v0] Farmer dashboard data prepared for ${farmer?.name || "Unknown"}:`, {
      markets,
      products,
      predictions,
      savedAmountUGX,
    })

    res.status(200).json(response)
  } catch (error) {
    console.error("[v0] ❌ Farmer dashboard error:", error)

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" })
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" })
    }

    res.status(500).json({
      message: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}
