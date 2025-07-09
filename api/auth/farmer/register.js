import bcrypt from "bcryptjs"
import { getDB } from "../../../utils/database.js"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const db = getDB()
    const farmers = db.collection("farmers")

    const { name, email, phone, password, farmLocation, farmSize, primaryCrops } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" })
    }

    // Check if farmer already exists
    const existingFarmer = await farmers.findOne({ email })
    if (existingFarmer) {
      return res.status(400).json({ message: "Farmer with this email already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new farmer
    const newFarmer = {
      name,
      email,
      phone,
      password: hashedPassword,
      farmLocation,
      farmSize,
      primaryCrops,
      createdAt: new Date(),
      totalPredictions: 0,
      moneySaved: 0,
    }

    const result = await farmers.insertOne(newFarmer)

    res.status(201).json({
      message: "Farmer registered successfully",
      farmerId: result.insertedId,
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
