import bcrypt from "bcryptjs"
import { getDB } from "../../../utils/database.js"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const db = getDB()
    const farmers = db.collection("farmers")

    const { name, firstName, lastName, email, phone, password, farmLocation, farmSize, primaryCrops } = req.body

    console.log("[v0] Farmer registration attempt for:", email)
    console.log("[v0] Registration data:", {
      firstName,
      lastName,
      name,
      email,
      phone,
      farmLocation,
      farmSize,
      primaryCrops,
    })

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    if (!name && (!firstName || !lastName)) {
      return res.status(400).json({ message: "Name (or firstName and lastName) is required" })
    }

    const existingFarmer = await farmers.findOne({ email })
    if (existingFarmer) {
      console.log("[v0] Farmer already exists:", email)
      return res.status(400).json({ message: "Farmer with this email already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newFarmer = {
      email,
      phone,
      password: hashedPassword,
      farmLocation,
      farmSize: farmSize ? Number.parseFloat(farmSize) : null,
      primaryCrops,
      createdAt: new Date(),
      totalPredictions: 0,
      moneySaved: 0,
    }

    if (firstName && lastName) {
      newFarmer.firstName = firstName
      newFarmer.lastName = lastName
      newFarmer.name = `${firstName} ${lastName}`
    } else if (name) {
      newFarmer.name = name
    }

    console.log("[v0] Creating farmer:", { email, name: newFarmer.name })

    const result = await farmers.insertOne(newFarmer)

    console.log("[v0] Farmer registered successfully:", email)
    res.status(201).json({
      message: "Farmer registered successfully",
      farmerId: result.insertedId,
    })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
