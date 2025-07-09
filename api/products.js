import { ObjectId } from "mongodb"
import jwt from "jsonwebtoken"
import { getDB } from "../utils/database.js"

export default async function handler(req, res) {
  try {
    const db = getDB()
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
      // Get all products with market information
      const allProducts = await products
        .aggregate([
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

      res.status(200).json(allProducts)
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
    console.error("Products API error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
