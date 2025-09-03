import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { connectDB } from "../../../utils/database.js"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const db = await connectDB()
    const farmers = db.collection("farmers")

    const { email, password } = req.body

    console.log("[v0] Farmer login attempt for:", email)

    if (!email || !password) {
      console.log("[v0] Missing email or password")
      return res.status(400).json({ message: "Email and password are required" })
    }

    // Find farmer by email
    const farmer = await farmers.findOne({ email })
    if (!farmer) {
      console.log("[v0] Farmer not found:", email)
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, farmer.password)
    if (!isValidPassword) {
      console.log("[v0] Invalid password for farmer:", email)
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: farmer._id, email: farmer.email, type: "farmer" },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" },
    )

    console.log("[v0] Farmer login successful:", email)
    res.status(200).json({
      token,
      name: farmer.name,
      email: farmer.email,
    })
  } catch (error) {
    console.error("[v0] Farmer login error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
