import { ObjectId } from "mongodb"
import jwt from "jsonwebtoken"
import { getDB } from "../utils/database.js"

export default async function handler(req, res) {
  try {
    console.log("[v0] Markets API route accessed")
    console.log("[v0] Markets API - Method:", req.method)
    console.log("[v0] Markets API - Headers:", req.headers.authorization ? "Token present" : "No token")

    const db = getDB()
    console.log("[v0] 📊 Database instance retrieved")
    const markets = db.collection("markets")

    if (req.method === "GET") {
      const token = req.headers.authorization?.split(" ")[1]

      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
          console.log("[v0] Decoded token - ID:", decoded.id, "Type:", decoded.type)

          if (decoded.type === "agent") {
            // Get only markets belonging to this agent
            const agentMarkets = await markets.find({ agentId: new ObjectId(decoded.id) }).toArray()
            console.log("[v0] Found", agentMarkets.length, "markets for agent", decoded.id)
            return res.status(200).json(agentMarkets)
          }
        } catch (error) {
          console.log("[v0] Token verification failed, proceeding with public access")
        }
      }

      console.log("[v0] Providing public access to all markets for farmers")
      const allMarkets = await markets.find({}).toArray()
      console.log("[v0] Found", allMarkets.length, "total markets")
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
    } else if (req.method === "PUT") {
      // Update market (agents only)
      const token = req.headers.authorization?.split(" ")[1]
      if (!token) {
        return res.status(401).json({ message: "No token provided" })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
      if (decoded.type !== "agent") {
        return res.status(403).json({ message: "Only agents can update markets" })
      }

      const marketId = req.query.id || req.body.id
      const { name, location, description } = req.body

      // Verify market belongs to agent
      const existingMarket = await markets.findOne({
        _id: new ObjectId(marketId),
        agentId: new ObjectId(decoded.id),
      })

      if (!existingMarket) {
        return res.status(404).json({ message: "Market not found or access denied" })
      }

      const updateData = {
        name,
        location,
        description,
        updatedAt: new Date(),
      }

      await markets.updateOne({ _id: new ObjectId(marketId) }, { $set: updateData })

      res.status(200).json({ message: "Market updated successfully" })
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
