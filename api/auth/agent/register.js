import bcrypt from "bcryptjs"
import { getDB } from "../../../utils/database.js"

export default async function agentRegister(req, res) {
  console.log("[v0] 📝 Agent registration attempt started")
  console.log("[v0] Request method:", req.method)
  console.log("[v0] Request body keys:", Object.keys(req.body))

  if (req.method !== "POST") {
    console.log("[v0] ❌ Invalid method for agent registration:", req.method)
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { name, email, password, phone, location, marketArea } = req.body
    console.log("[v0] 📧 Registration attempt for agent:", email)

    if (!name || !email || !password) {
      console.log("[v0] ❌ Missing required fields in agent registration")
      return res.status(400).json({ message: "Name, email, and password are required" })
    }

    const db = getDB()
    console.log("[v0] 🔍 Checking if agent email already exists...")

    const existingAgent = await db.collection("agents").findOne({ email })

    if (existingAgent) {
      console.log("[v0] ❌ Agent email already exists:", email)
      return res.status(400).json({ message: "Email already registered" })
    }

    console.log("[v0] 🔐 Hashing password for agent...")
    const hashedPassword = await bcrypt.hash(password, 12)

    const newAgent = {
      name,
      email,
      password: hashedPassword,
      phone: phone || "",
      location: location || "",
      marketArea: marketArea || "",
      type: "agent",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log("[v0] 💾 Saving new agent to database...")
    const result = await db.collection("agents").insertOne(newAgent)

    console.log("[v0] ✅ Agent registration successful:", email)
    res.status(201).json({
      message: "Agent registered successfully",
      agentId: result.insertedId,
    })
  } catch (error) {
    console.error("[v0] ❌ Agent registration error:", error.message)
    res.status(500).json({ message: "Internal server error" })
  }
}
