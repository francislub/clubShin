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

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    // Find agent by email
    const agent = await agents.findOne({ email })
    if (!agent) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, agent.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: agent._id, email: agent.email, type: "agent" },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" },
    )

    res.status(200).json({
      token,
      name: agent.name,
      email: agent.email,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
