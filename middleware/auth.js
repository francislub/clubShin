import jwt from "jsonwebtoken"
import { getDB } from "../utils/database.js"
import { ObjectId } from "mongodb"

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const db = getDB()

    let user = null
    if (decoded.type === "farmer") {
      user = await db.collection("farmers").findOne({ _id: new ObjectId(decoded.id) })
    } else if (decoded.type === "agent") {
      user = await db.collection("agents").findOne({ _id: new ObjectId(decoded.id) })
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid token." })
    }

    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      type: decoded.type,
    }

    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    res.status(401).json({ error: "Invalid token." })
  }
}

export default authMiddleware
