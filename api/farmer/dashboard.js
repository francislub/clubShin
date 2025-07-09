import { ObjectId } from "mongodb"
import jwt from "jsonwebtoken"
import { getDB } from "../../utils/database.js"

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ message: "No token provided" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
    if (decoded.type !== "farmer") {
      return res.status(403).json({ message: "Access denied" })
    }

    const db = getDB()

    // Get dashboard statistics
    const markets = await db.collection("markets").countDocuments()
    const products = await db.collection("products").countDocuments()
    const predictions = await db.collection("predictions").countDocuments({ farmerId: new ObjectId(decoded.id) })

    // Calculate saved amount (mock calculation)
    const savedAmount = predictions * 50 // Assume $50 saved per prediction

    // Get farmer name
    const farmer = await db.collection("farmers").findOne({ _id: new ObjectId(decoded.id) })

    res.status(200).json({
      totalMarkets: markets,
      totalProducts: products,
      predictions,
      savedAmount,
      farmerName: farmer?.name || "Farmer",
    })
  } catch (error) {
    console.error("Farmer dashboard error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
