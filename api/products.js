import { ObjectId } from "mongodb"
import jwt from "jsonwebtoken"
import { getDB } from "../utils/database.js"

export default async function handler(req, res) {
  try {
    console.log("[v0] Products API - Method:", req.method)
    console.log("[v0] Products API - Headers:", req.headers.authorization ? "Token present" : "No token")

    let db
    try {
      db = getDB()
    } catch (dbError) {
      console.error("[v0] ❌ Database connection failed:", dbError.message)
      return res.status(503).json({
        message: "Database service unavailable. Please try again later.",
        error: "DB_CONNECTION_FAILED",
      })
    }

    const products = db.collection("products")
    const markets = db.collection("markets")

    // Handle different routes
    if (req.params?.productName) {
      // Get products by name
      const productsByName = await products
        .aggregate([
          { $match: { name: req.params.productName } },
          {
            $lookup: {
              from: "markets",
              localField: "marketId",
              foreignField: "_id",
              as: "market",
            },
          },
          { $unwind: "$market" },
          {
            $project: {
              name: 1,
              sellingPrice: 1,
              buyingPrice: 1,
              stock: 1,
              marketId: 1,
              marketName: "$market.name",
              marketLocation: "$market.location",
            },
          },
        ])
        .toArray()

      return res.status(200).json(productsByName)
    }

    if (req.params?.marketId) {
      // Get products by market
      const productsByMarket = await products.find({ marketId: new ObjectId(req.params.marketId) }).toArray()

      return res.status(200).json(productsByMarket)
    }

    if (req.method === "GET") {
      // Get only products belonging to this agent
      const token = req.headers.authorization?.split(" ")[1]
      if (!token) {
        console.log("[v0] No token provided for GET request")
        return res.status(401).json({ message: "No token provided" })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
      console.log("[v0] Decoded token - ID:", decoded.id, "Type:", decoded.type)

      if (decoded.type !== "agent") {
        return res.status(403).json({ message: "Only agents can access products" })
      }

      // Get only products belonging to this agent
      const agentProducts = await products
        .aggregate([
          { $match: { agentId: new ObjectId(decoded.id) } },
          {
            $lookup: {
              from: "markets",
              localField: "marketId",
              foreignField: "_id",
              as: "market",
            },
          },
          {
            $unwind: "$market",
          },
          {
            $project: {
              name: 1,
              sellingPrice: 1,
              buyingPrice: 1,
              stock: 1,
              marketId: 1,
              marketName: "$market.name",
              marketLocation: "$market.location",
              createdAt: 1,
            },
          },
        ])
        .toArray()

      console.log("[v0] Found", agentProducts.length, "products for agent", decoded.id)
      res.status(200).json(agentProducts)
    } else if (req.method === "POST") {
      // Create new product (agents only)
      const token = req.headers.authorization?.split(" ")[1]
      if (!token) {
        return res.status(401).json({ message: "No token provided" })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
      if (decoded.type !== "agent") {
        return res.status(403).json({ message: "Only agents can add products" })
      }

      const { name, marketId, sellingPrice, buyingPrice, stock } = req.body

      // Verify market belongs to agent
      const market = await markets.findOne({
        _id: new ObjectId(marketId),
        agentId: new ObjectId(decoded.id),
      })

      if (!market) {
        return res.status(403).json({ message: "Market not found or access denied" })
      }

      const newProduct = {
        name,
        marketId: new ObjectId(marketId),
        sellingPrice: Number.parseFloat(sellingPrice),
        buyingPrice: Number.parseFloat(buyingPrice),
        stock: Number.parseInt(stock),
        agentId: new ObjectId(decoded.id),
        createdAt: new Date(),
      }

      const result = await products.insertOne(newProduct)

      // Update market product count
      await markets.updateOne({ _id: new ObjectId(marketId) }, { $inc: { productCount: 1 } })

      res.status(201).json({ message: "Product added successfully", productId: result.insertedId })
    } else if (req.method === "PUT") {
      // Update product (agents only)
      const token = req.headers.authorization?.split(" ")[1]
      if (!token) {
        return res.status(401).json({ message: "No token provided" })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
      if (decoded.type !== "agent") {
        return res.status(403).json({ message: "Only agents can update products" })
      }

      const productId = req.query.id || req.body.id
      const { name, marketId, sellingPrice, buyingPrice, stock } = req.body

      // Verify product belongs to agent
      const existingProduct = await products.findOne({
        _id: new ObjectId(productId),
        agentId: new ObjectId(decoded.id),
      })

      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found or access denied" })
      }

      // Verify market belongs to agent if marketId is being changed
      if (marketId && marketId !== existingProduct.marketId.toString()) {
        const market = await markets.findOne({
          _id: new ObjectId(marketId),
          agentId: new ObjectId(decoded.id),
        })

        if (!market) {
          return res.status(403).json({ message: "Market not found or access denied" })
        }
      }

      const updateData = {
        name,
        marketId: new ObjectId(marketId),
        sellingPrice: Number.parseFloat(sellingPrice),
        buyingPrice: Number.parseFloat(buyingPrice),
        stock: Number.parseInt(stock),
        updatedAt: new Date(),
      }

      await products.updateOne({ _id: new ObjectId(productId) }, { $set: updateData })

      res.status(200).json({ message: "Product updated successfully" })
    } else if (req.method === "DELETE") {
      // Delete product (agents only)
      const token = req.headers.authorization?.split(" ")[1]
      if (!token) {
        return res.status(401).json({ message: "No token provided" })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
      if (decoded.type !== "agent") {
        return res.status(403).json({ message: "Only agents can delete products" })
      }

      const productId = req.query.id
      const product = await products.findOne({ _id: new ObjectId(productId) })

      if (product) {
        await products.deleteOne({ _id: new ObjectId(productId), agentId: new ObjectId(decoded.id) })

        // Update market product count
        await markets.updateOne({ _id: product.marketId }, { $inc: { productCount: -1 } })
      }

      res.status(200).json({ message: "Product deleted successfully" })
    } else {
      res.status(405).json({ message: "Method not allowed" })
    }
  } catch (error) {
    console.error("[v0] ❌ Products API error:", error.message)

    if (error.name === "MongoServerSelectionError") {
      return res.status(503).json({
        message: "Database connection failed. Please try again later.",
        error: "DB_SERVER_SELECTION_ERROR",
      })
    }

    if (error.name === "MongoTimeoutError") {
      return res.status(504).json({
        message: "Database operation timed out. Please try again.",
        error: "DB_TIMEOUT_ERROR",
      })
    }

    res.status(500).json({
      message: "Internal server error",
      error: "INTERNAL_SERVER_ERROR",
    })
  }
}
