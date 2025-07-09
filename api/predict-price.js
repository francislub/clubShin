import { ObjectId } from "mongodb"
import { getDB } from "../utils/database.js"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const db = getDB()
    const products = db.collection("products")
    const markets = db.collection("markets")

    const { product, market, quantity } = req.body

    // Get current product data
    const currentProduct = await products.findOne({
      name: product,
      marketId: new ObjectId(market),
    })

    if (!currentProduct) {
      return res.status(404).json({ message: "Product not found in selected market" })
    }

    // AI-powered price prediction algorithm
    const prediction = await generatePricePrediction(currentProduct, quantity, db)

    res.status(200).json(prediction)
  } catch (error) {
    console.error("Price prediction error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

async function generatePricePrediction(product, quantity, db) {
  // Simulate AI prediction algorithm
  const baseSellingPrice = product.sellingPrice
  const baseBuyingPrice = product.buyingPrice

  // Factors affecting price prediction
  const quantityFactor = calculateQuantityFactor(quantity)
  const seasonalFactor = calculateSeasonalFactor()
  const marketTrendFactor = await calculateMarketTrend(product.name, db)
  const demandSupplyFactor = calculateDemandSupply(product.stock, quantity)

  // Calculate predicted prices
  const sellingPricePrediction = baseSellingPrice * quantityFactor * seasonalFactor * marketTrendFactor
  const buyingPricePrediction = baseBuyingPrice * quantityFactor * seasonalFactor * demandSupplyFactor

  // Generate recommendations
  const recommendation = generateRecommendation(
    sellingPricePrediction,
    buyingPricePrediction,
    baseSellingPrice,
    baseBuyingPrice,
    quantity,
    product.stock,
  )

  return {
    sellingPrice: sellingPricePrediction,
    buyingPrice: buyingPricePrediction,
    bestSellTime: getBestTime("sell", marketTrendFactor),
    bestBuyTime: getBestTime("buy", demandSupplyFactor),
    recommendation,
    confidence: calculateConfidence(quantityFactor, seasonalFactor, marketTrendFactor),
    factors: {
      quantity: quantityFactor,
      seasonal: seasonalFactor,
      marketTrend: marketTrendFactor,
      demandSupply: demandSupplyFactor,
    },
  }
}

function calculateQuantityFactor(quantity) {
  // Bulk discount/premium calculation
  if (quantity >= 1000) return 0.95 // 5% discount for bulk
  if (quantity >= 500) return 0.97 // 3% discount
  if (quantity >= 100) return 0.99 // 1% discount
  if (quantity < 10) return 1.05 // 5% premium for small quantities
  return 1.0
}

function calculateSeasonalFactor() {
  const month = new Date().getMonth()
  // Simulate seasonal price variations
  const seasonalFactors = [1.1, 1.05, 1.0, 0.95, 0.9, 0.85, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15]
  return seasonalFactors[month]
}

async function calculateMarketTrend(productName, db) {
  // Analyze historical data to determine market trend
  const products = db.collection("products")
  const historicalData = await products.find({ name: productName }).toArray()

  if (historicalData.length < 2) return 1.0

  // Simple trend calculation based on price changes
  const avgPrice = historicalData.reduce((sum, p) => sum + p.sellingPrice, 0) / historicalData.length
  const latestPrice = historicalData[historicalData.length - 1].sellingPrice

  return latestPrice > avgPrice ? 1.05 : 0.95
}

function calculateDemandSupply(stock, requestedQuantity) {
  const ratio = requestedQuantity / stock
  if (ratio > 0.8) return 1.1 // High demand, low supply
  if (ratio > 0.5) return 1.05 // Medium demand
  if (ratio < 0.1) return 0.95 // Low demand, high supply
  return 1.0
}

function generateRecommendation(predictedSell, predictedBuy, currentSell, currentBuy, quantity, stock) {
  const sellDiff = ((predictedSell - currentSell) / currentSell) * 100
  const buyDiff = ((predictedBuy - currentBuy) / currentBuy) * 100

  if (sellDiff > 5) {
    return `Excellent time to sell! Predicted price is ${sellDiff.toFixed(1)}% higher than current market price.`
  } else if (sellDiff < -5) {
    return `Consider waiting to sell. Predicted price is ${Math.abs(sellDiff).toFixed(1)}% lower than current market price.`
  } else if (buyDiff < -5) {
    return `Good time to buy! Predicted buying price is ${Math.abs(buyDiff).toFixed(1)}% lower than current market price.`
  } else if (quantity > stock * 0.8) {
    return `High demand detected. Consider negotiating better prices due to limited supply.`
  } else {
    return `Market conditions are stable. Current prices are fair for trading.`
  }
}

function getBestTime(action, factor) {
  const hour = new Date().getHours()
  if (action === "sell") {
    return factor > 1 ? "Now (High demand period)" : "Wait 2-3 days (Market improving)"
  } else {
    return factor < 1 ? "Now (Good buying opportunity)" : "Wait for market correction"
  }
}

function calculateConfidence(quantityFactor, seasonalFactor, marketTrendFactor) {
  // Calculate prediction confidence based on various factors
  const baseConfidence = 0.75
  const factorVariance = Math.abs(1 - quantityFactor) + Math.abs(1 - seasonalFactor) + Math.abs(1 - marketTrendFactor)
  return Math.max(0.5, Math.min(0.95, baseConfidence - factorVariance * 0.1))
}
