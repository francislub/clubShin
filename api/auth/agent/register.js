import bcrypt from "bcryptjs"
import { getDB } from "../../../utils/database.js"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const db = getDB()
    const agents = db.collection("agents")

    const { name, email, phone, password, company, businessLocation, businessType, licenseNumber } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" })
    }

    // Check if agent already exists
    const existingAgent = await agents.findOne({ email })
    if (existingAgent) {
      return res.status(400).json({ message: "Agent with this email already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new agent
    const newAgent = {
      name,
      email,
      phone,
      password: hashedPassword,
      company,
      businessLocation,
      businessType,
      licenseNumber,
      createdAt: new Date(),
      totalRevenue: 0,
      totalTransactions: 0,
    }

    const result = await agents.insertOne(newAgent)

    res.status(201).json({
      message: "Agent registered successfully",
      agentId: result.insertedId,
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
