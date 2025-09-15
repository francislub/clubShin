import jwt from "jsonwebtoken"
import { getDB } from "../../utils/database.js"
import { ObjectId } from "mongodb"

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
      return res.status(403).json({ message: "Access denied. Agent access required." })
    }

    const db = getDB()
    console.log("[v0] 📊 Database instance retrieved")

    // Get agent profile data
    const agent = await db.collection("agents").findOne({ _id: new ObjectId(decoded.id) })

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" })
    }

    // Remove sensitive data
    const { password, ...agentProfile } = agent

    console.log("[v0] Agent profile retrieved successfully for:", agent.email)
    res.status(200).json({
      profile: agentProfile,
    })
  } catch (error) {
    console.error("[v0] Agent profile error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
