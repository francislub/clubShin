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
    if (decoded.type !== "agent") {
      return res.status(403).json({ message: "Access denied" })
    }

    const db = getDB()

    // Get agent-specific statistics
    const myMarkets = await db.collection("markets").countDocuments({ agentId: new ObjectId(decoded.id) })
    const activeProducts = await db.collection("products").countDocuments({ agentId: new ObjectId(decoded.id) })

    // Mock transaction and revenue data
    const totalTransactions = activeProducts * 10
    const totalRevenue = totalTransactions * 100

    // Get agent name
    const agent = await db.collection("agents").findOne({ _id: new ObjectId(decoded.id) })

    res.status(200).json({
      myMarkets,
      activeProducts,
      totalTransactions,
      totalRevenue,
      agentName: agent?.name || "Agent",
    })
  } catch (error) {
    console.error("Agent dashboard error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
