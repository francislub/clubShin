import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { getDB } from "../../../utils/database.js"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const db = getDB()
    const agents = db.collection("agents")

    const { email, password } = req.body

    console.log("[v0] Agent login attempt for:", email)

    if (!email || !password) {
      console.log("[v0] Missing email or password")
      return res.status(400).json({ message: "Email and password are required" })
    }

    const agent = await agents.findOne({ email })
    if (!agent) {
      console.log("[v0] Agent not found:", email)
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, agent.password)
    if (!isValidPassword) {
      console.log("[v0] Invalid password for agent:", email)
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
      { id: agent._id, email: agent.email, type: "agent" },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" },
    )

    console.log("[v0] Agent login successful:", email)
    res.status(200).json({
      token,
      name: agent.name,
      email: agent.email,
      type: "agent",
    })
  } catch (error) {
    console.error("[v0] Agent login error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
