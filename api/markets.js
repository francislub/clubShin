import { ObjectId } from "mongodb"
import jwt from "jsonwebtoken"
import { getDB } from "../utils/database.js"

export default async function handler(req, res) {
  try {
    const db = getDB()
    const markets = db.collection("markets")

    if (req.method === "GET") {
      // Get all markets
      const allMarkets = await markets.find({}).toArray()
      res.status(200).json(allMarkets)
    } else if (req.method === "POST") {
      // Create new market (agents only)
      const token = req.headers.authorization?.split(" ")[1]
      if (!token) {
        return res.status(401).json({ message: "No token provided" })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
      if (decoded.type !== "agent") {
        return res.status(403).json({ message: "Only agents can create markets" })
      }

      const { name, location, description } = req.body
      const newMarket = {
        name,
        location,
        description,
        agentId: new ObjectId(decoded.id),
        createdAt: new Date(),
        productCount: 0,
      }

      const result = await markets.insertOne(newMarket)
      res.status(201).json({ message: "Market created successfully", marketId: result.insertedId })
    } else if (req.method === "DELETE") {
      // Delete market (agents only)
      const token = req.headers.authorization?.split(" ")[1]
      if (!token) {
        return res.status(401).json({ message: "No token provided" })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
      if (decoded.type !== "agent") {
        return res.status(403).json({ message: "Only agents can delete markets" })
      }

      const marketId = req.query.id
      await markets.deleteOne({ _id: new ObjectId(marketId), agentId: new ObjectId(decoded.id) })

      // Also delete associated products
      const products = db.collection("products")
      await products.deleteMany({ marketId: new ObjectId(marketId) })

      res.status(200).json({ message: "Market deleted successfully" })
    } else {
      res.status(405).json({ message: "Method not allowed" })
    }
  } catch (error) {
    console.error("Markets API error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
